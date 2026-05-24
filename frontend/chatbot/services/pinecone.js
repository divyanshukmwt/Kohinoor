/**
 * Pinecone Semantic Search — Éclat Platform (Frontend)
 * 
 * In production: calls backend /api/chatbot/semantic-search directly.
 * Backend owns the Pinecone API key. Nothing secret is in the browser.
 * In mock mode: keyword scoring against mockProducts.
 */

import { api, MOCK_FALLBACK } from '../utils/apiClient';
import { mockProducts } from '../data/mockProducts';

// In-memory product cache (avoids double-fetching after Pinecone search)
const _cache = new Map();

export function cacheProducts(products) {
  products.forEach((p) => _cache.set(p.id, p));
}
export function getCachedProduct(id)   { return _cache.get(id) ?? null; }
export function getCachedProducts(ids) { return ids.map((id) => _cache.get(id)).filter(Boolean); }

/**
 * Semantic product search
 * @param {string} embeddingQuery
 * @param {Object} filters
 * @param {number} topK
 * @returns {Promise<string[]>} ranked product IDs
 */
export async function semanticSearch(embeddingQuery, filters = {}, topK = 6) {
  if (MOCK_FALLBACK) {
    return _mockSearch(embeddingQuery, filters, topK);
  }

  try {
    // Calls backend → Gemini embedding → Pinecone search → returns IDs + hydrated products
    const data = await api.post('/api/chatbot/semantic-search', {
      query:  embeddingQuery,
      filters: _sanitize(filters),
      topK,
    });

    // Cache any hydrated products returned alongside IDs
    if (data.products?.length) cacheProducts(data.products);

    return data.productIds ?? [];
  } catch (err) {
    console.warn('[Pinecone] semantic search failed, using mock:', err.message);
    return _mockSearch(embeddingQuery, filters, topK);
  }
}

// ─────────────────────────────────────────────
// MOCK SEMANTIC SEARCH
// ─────────────────────────────────────────────

function _mockSearch(query, filters, topK) {
  const q = query.toLowerCase();
  let results = [...mockProducts];

  // Metadata filters
  if (filters.materials?.length) {
    results = results.filter((p) =>
      p.materials?.some((m) => filters.materials.map((f) => f.toLowerCase()).includes(m.toLowerCase()))
    );
  }
  if (filters.wearType) {
    const byWear = results.filter((p) => p.wearType === filters.wearType);
    if (byWear.length) results = byWear;
  }
  if (filters.gender && filters.gender !== 'unisex') {
    const byGender = results.filter((p) =>
      p.gender?.includes(filters.gender) || p.gender?.includes('unisex')
    );
    if (byGender.length) results = byGender;
  }
  if (filters.occasions?.length) {
    const byOcc = results.filter((p) =>
      p.occasions?.some((o) =>
        filters.occasions.some((fo) => o.toLowerCase().includes(fo.toLowerCase()))
      )
    );
    if (byOcc.length) results = byOcc;
  }
  if (filters.minPrice != null) results = results.filter((p) => p.price >= filters.minPrice);
  if (filters.maxPrice != null) results = results.filter((p) => p.price <= filters.maxPrice);

  // Score by keyword overlap on embeddingText + styleTags
  const keywords = q.split(/\s+/).filter(Boolean);
  const scored = results.map((p) => {
    const text = ((p.embeddingText || '') + ' ' + (p.styleTags || []).join(' ')).toLowerCase();
    const score = keywords.reduce((s, kw) => s + (text.includes(kw) ? 2 : 0), 0);
    return { ...p, _score: score };
  });

  return scored.sort((a, b) => b._score - a._score).slice(0, topK).map((p) => p.id);
}

function _sanitize(filters) {
  const clean = {};
  if (filters.materials?.length)  clean.materials = filters.materials;
  if (filters.occasions?.length)  clean.occasions  = filters.occasions;
  if (filters.styleTags?.length)  clean.styleTags  = filters.styleTags;
  if (filters.wearType)           clean.wearType   = filters.wearType;
  if (filters.gender)             clean.gender     = filters.gender;
  if (filters.minPrice != null)   clean.minPrice   = filters.minPrice;
  if (filters.maxPrice != null)   clean.maxPrice   = filters.maxPrice;
  return clean;
}
