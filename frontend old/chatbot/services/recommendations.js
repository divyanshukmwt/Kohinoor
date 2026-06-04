/**
 * Recommendations Service — Éclat Platform
 *
 * Orchestrates the full semantic recommendation pipeline:
 *   1. Gemini → semantic query extraction + structured filters
 *   2. Pinecone → vector similarity search → ranked product IDs
 *   3. PostgreSQL → hydrate full product objects (via backend)
 *
 * In production: all steps run through FastAPI backend via /api/chatbot/recommend
 * In mock mode:  client-side Gemini → mock Pinecone → mock products
 */

import { generateSemanticQuery } from './gemini';
import { semanticSearch, getCachedProducts, cacheProducts } from './pinecone';
import { fetchProductsByIds } from './products';
import { api, MOCK_FALLBACK } from '../utils/apiClient';
import { BUDGET_RANGES } from '../data/flowConfig';

/**
 * Get recommendations from flow selections (primary pipeline)
 *
 * @param {Object} selections - { purpose, gender, material, wearType, style, budget }
 * @param {string} [conversationalQuery] - Optional free-text refinement
 * @returns {Promise<{ products: Object[], source: string, embeddingQuery: string }>}
 */
export async function getFlowRecommendations(selections, conversationalQuery = '') {
  // ── Production: single backend call handles entire pipeline ──────────
  if (!MOCK_FALLBACK && process.env.NEXT_PUBLIC_API_URL) {
    try {
      const data = await api.post('/api/chatbot/recommend', {
        purpose:  selections.purpose  || '',
        gender:   selections.gender   || '',
        material: selections.material || '',
        wearType: selections.wearType || '',
        style:    selections.style    || '',
        budget:   selections.budget   || null,
        query:    conversationalQuery || '',
      });

      if (data.products?.length) {
        cacheProducts(data.products);
      }

      return {
        products:       data.products       ?? [],
        embeddingQuery: data.embeddingQuery  ?? '',
        source:         data.source          ?? 'backend',
        pineconeCount:  data.pineconeCount   ?? 0,
      };
    } catch (err) {
      console.warn('[Recommendations] Backend pipeline failed, using client fallback:', err.message);
    }
  }

  // ── Mock / Fallback: client-side pipeline ────────────────────────────
  return _clientSidePipeline(selections, conversationalQuery);
}

/**
 * Get recommendations from a conversational (free-text) query
 *
 * @param {string} query - Natural language query
 * @param {Object} [previousSelections] - Context from earlier flow steps
 * @returns {Promise<{ products: Object[], source: string }>}
 */
export async function getConversationalRecommendations(query, previousSelections = {}) {
  if (!MOCK_FALLBACK && process.env.NEXT_PUBLIC_API_URL) {
    try {
      const data = await api.post('/api/chatbot/recommend', {
        ...previousSelections,
        query,
      });

      if (data.products?.length) cacheProducts(data.products);
      return { products: data.products ?? [], source: 'backend' };
    } catch (err) {
      console.warn('[Recommendations] Conversational backend failed:', err.message);
    }
  }

  return _clientSidePipeline(previousSelections, query);
}

// ─────────────────────────────────────────────
// CLIENT-SIDE PIPELINE (mock/fallback)
// ─────────────────────────────────────────────

async function _clientSidePipeline(selections, conversationalQuery = '') {
  try {
    // 1. Gemini semantic extraction
    const { embeddingQuery, filters } = await generateSemanticQuery(
      selections,
      conversationalQuery
    );

    // 2. Budget filter overlay
    const budgetRange = BUDGET_RANGES[selections.budget];
    if (budgetRange) {
      if (budgetRange.min)              filters.minPrice = budgetRange.min;
      if (budgetRange.max !== Infinity) filters.maxPrice = budgetRange.max;
    }

    // 3. Pinecone / mock semantic search
    const productIds = await semanticSearch(embeddingQuery, filters, 6);

    if (!productIds.length) {
      return { products: [], source: 'empty', embeddingQuery };
    }

    // 4. Try cache first, then fetch
    const cached = getCachedProducts(productIds);
    const missingIds = productIds.filter((id) => !cached.find((p) => p.id === id));

    const fetched = missingIds.length ? await fetchProductsByIds(missingIds) : [];
    if (fetched.length) cacheProducts(fetched);

    // Merge + preserve Pinecone ranking
    const idOrder = Object.fromEntries(productIds.map((id, i) => [id, i]));
    const allProducts = [...cached, ...fetched].sort(
      (a, b) => (idOrder[a.id] ?? 99) - (idOrder[b.id] ?? 99)
    );

    return { products: allProducts.slice(0, 6), embeddingQuery, source: 'client_mock' };
  } catch (err) {
    console.error('[Recommendations] Client pipeline error:', err);
    return { products: [], source: 'error', embeddingQuery: '' };
  }
}

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────

/**
 * Format price in INR
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
  return new Intl.NumberFormat('en-IN', {
    style:               'currency',
    currency:            'INR',
    maximumFractionDigits: 0,
  }).format(price);
}
