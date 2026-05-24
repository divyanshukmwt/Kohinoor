/**
 * Search Service
 *
 * Placeholder for search/filter API calls.
 *
 * API endpoint reference:
 *   GET /api/search?q=...&category=...&priceMin=...&priceMax=...
 */

import { searchProducts } from './products';

/**
 * Full-text search across products and journal
 * @param {string} query
 * @param {{ category?: string, priceMin?: number, priceMax?: number }} filters
 * @returns {Promise<{ products: Array, journal: Array }>}
 */
export async function search(query, filters = {}) {
  // TODO: Replace with →
  // const params = new URLSearchParams({ q: query, ...filters });
  // const res = await fetch(`/api/search?${params}`);
  // return res.json();

  const products = await searchProducts(query);
  return { products, journal: [] };
}

/**
 * Get search suggestions (autocomplete)
 * @param {string} query
 * @returns {Promise<Array<string>>}
 */
export async function getSearchSuggestions(query) {
  // TODO: Replace with → fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
  const products = await searchProducts(query);
  return products.map((p) => p.name).slice(0, 5);
}
