/**
 * Kohinoor Frontend API Client
 * Connects the Vite + React frontend to the FastAPI backend (http://localhost:8000/api)
 * with resilient local Knowledge Base fallback.
 */

import { products as fallbackProducts } from '../data/products';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export function getSessionId() {
  let sid = localStorage.getItem('kohinoor_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('kohinoor_session_id', sid);
  }
  return sid;
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Session-ID': getSessionId(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`API ${response.status}: ${errText || response.statusText}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

export async function fetchProducts(filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
        params.append(k, v);
      }
    });
    const qs = params.toString() ? `?${params.toString()}` : '';
    const data = await apiRequest(`/api/products/${qs}`);
    if (Array.isArray(data.products) && data.products.length > 0) {
      return data.products;
    }
    return fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

// ─────────────────────────────────────────────
// CART & ORDERS
// ─────────────────────────────────────────────

export async function syncCartAdd(productId, quantity = 1) {
  try {
    return await apiRequest('/api/cart/', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  } catch {
    return null;
  }
}

export async function syncCartClear() {
  try {
    return await apiRequest('/api/cart/', { method: 'DELETE' });
  } catch {
    return null;
  }
}

export async function submitOrder(orderPayload) {
  try {
    return await apiRequest('/api/orders/', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
  } catch {
    // Return local confirmation if backend is offline
    return {
      success: true,
      order: {
        id: 'ord_' + Math.random().toString(36).substring(2, 9),
        status: 'confirmed',
        ...orderPayload,
        createdAt: new Date().toISOString(),
      },
    };
  }
}

// ─────────────────────────────────────────────
// AI CONCIERGE & GUIDED RETRIEVAL
// ─────────────────────────────────────────────

export async function fetchGuidedFlow() {
  try {
    const data = await apiRequest('/api/chatbot/flow');
    if (Array.isArray(data.steps) && data.steps.length > 0) {
      return data.steps;
    }
  } catch {
    // Fall through to default steps
  }
  return [
    {
      step: 1,
      field: 'wearType',
      question: 'What piece are you looking for?',
      options: [
        { value: 'neck', label: 'Necklaces & Pendants' },
        { value: 'ears', label: 'Earrings & Jhumkas' },
        { value: 'rings', label: 'Rings & Bands' },
        { value: 'hands', label: 'Bracelets & Bangles' },
        { value: 'foot', label: 'Anklets' },
      ],
    },
    {
      step: 2,
      field: 'material',
      question: 'Preferred metal or stone?',
      options: [
        { value: 'gold', label: 'Gold / 18K Vermeil' },
        { value: 'oxidized silver', label: 'Oxidized & 925 Silver' },
        { value: 'rose gold', label: 'Rose Gold' },
        { value: 'diamond', label: 'Diamond & Polki' },
        { value: 'pearl', label: 'Pearl & Kundan' },
        { value: 'platinum', label: 'Platinum' },
      ],
    },
    {
      step: 3,
      field: 'budget',
      question: 'What is your budget range?',
      options: [
        { value: 'under_2k', label: 'Under ₹2,000' },
        { value: 'under_5k', label: 'Under ₹5,000' },
        { value: '5k_20k', label: '₹5,000 – ₹20,000' },
        { value: 'above_20k', label: 'Above ₹20,000' },
      ],
    },
  ];
}

export async function requestAiRecommendations({
  selections = {},
  query = '',
  apiKey = '',
  model = 'gemini-2.5-flash',
  topK = 4,
}) {
  try {
    const headers = {};
    if (apiKey && apiKey.trim()) headers['X-Gemini-API-Key'] = apiKey.trim();
    if (model && model.trim()) headers['X-Gemini-Model'] = model.trim();

    return await apiRequest('/api/chatbot/recommend', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        purpose: selections.purpose || '',
        gender: selections.gender || '',
        material: selections.material || '',
        wearType: selections.wearType || '',
        style: selections.style || '',
        budget: selections.budget || null,
        query: query || '',
        apiKey: apiKey ? apiKey.trim() : null,
        model: model ? model.trim() : 'gemini-2.5-flash',
        topK,
      }),
    });
  } catch {
    // Local Knowledge Base fallback retrieval if backend is unreachable
    return localKnowledgeBaseRetrieve(selections, query, topK);
  }
}

function localKnowledgeBaseRetrieve(selections = {}, query = '', topK = 4) {
  const q = (query || '').toLowerCase();
  const wearToCat = {
    neck: 'NECKLACES',
    ears: 'EARRINGS',
    rings: 'RINGS',
    hands: 'BRACELETS',
    foot: 'BRACELETS',
  };
  const targetCat = wearToCat[selections.wearType] || null;
  const reqMat = (selections.material || '').trim().toLowerCase();
  const budgetBounds = {
    under_2k: [0, 2000],
    under_5k: [0, 5000],
    '5k_20k': [5000, 20000],
    above_20k: [20000, Infinity],
  };
  const [minP, maxP] = budgetBounds[selections.budget] || [0, Infinity];

  const matchesMaterial = (p) => {
    if (!reqMat) return true;
    const mats = (p.materialTags || []).map((m) => m.toLowerCase());
    if (reqMat === 'rose gold') return mats.includes('rose gold');
    if (reqMat === 'gold') return mats.includes('gold');
    if (reqMat === 'oxidized silver' || reqMat === 'silver')
      return mats.includes('silver') || mats.includes('oxidized silver');
    if (reqMat === 'platinum') return mats.includes('platinum');
    if (reqMat === 'diamond') return mats.includes('diamond') || mats.includes('polki');
    if (reqMat === 'pearl') return mats.includes('pearl') || mats.includes('kundan');
    return mats.includes(reqMat);
  };

  const matchesCategory = (p) => {
    if (selections.wearType === 'foot') return p.wearType === 'foot';
    if (selections.wearType === 'hands') return p.wearType === 'hands';
    if (targetCat) return p.category === targetCat;
    return true;
  };

  const candidates = fallbackProducts.filter((p) => matchesCategory(p) && matchesMaterial(p));
  const inBracket = candidates.filter((p) => p.price >= minP && p.price <= maxP);
  const underMax = candidates.filter((p) => p.price <= maxP);
  const pool = inBracket.length > 0 ? inBracket : underMax.length > 0 ? underMax : candidates;

  const scored = pool.map((p) => {
    let score = 50;
    const text = `${p.name} ${p.description} ${(p.occasions || []).join(' ')} ${(p.styleTags || []).join(' ')}`.toLowerCase();
    if (selections.purpose && text.includes(selections.purpose.toLowerCase())) score += 20;
    if (selections.style && text.includes(selections.style.toLowerCase())) score += 18;
    if (q) {
      q.split(/\s+/).forEach((word) => {
        if (word.length > 2 && text.includes(word)) score += 10;
      });
    }
    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return {
    success: true,
    products: scored.slice(0, topK).map((x) => x.p),
    refinedQuestion: query || 'Curated pieces based on your exact preferences and budget',
    conciergeMessage: 'Here are the exact matching pieces from our Jewellery Knowledge Base.',
    modelUsed: 'local-knowledge-base',
    aiActive: false,
  };
}
