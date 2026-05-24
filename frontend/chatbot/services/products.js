/**
 * Products Service — Éclat Platform
 * Fetches full product data from PostgreSQL via the FastAPI backend.
 * Falls back to mock data when NEXT_PUBLIC_MOCK_FALLBACK=true or API is unreachable.
 */

import { api, MOCK_FALLBACK } from '../utils/apiClient';
import { mockProducts, getProductsByIds as getMockProductsByIds } from '../data/mockProducts';

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────

/**
 * Fetch products by IDs (called after Pinecone semantic search)
 * @param {string[]} ids
 * @returns {Promise<Object[]>}
 */
export async function fetchProductsByIds(ids) {
  if (!ids?.length) return [];

  if (MOCK_FALLBACK) {
    await delay(400);
    return getMockProductsByIds(ids);
  }

  try {
    const products = await api.post('/api/products/batch', { ids });
    return Array.isArray(products) ? products : [];
  } catch (err) {
    console.warn('[Products] Batch fetch failed, using mock:', err.message);
    return getMockProductsByIds(ids);
  }
}

/**
 * Fetch a single product by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchProductById(id) {
  if (MOCK_FALLBACK) {
    await delay(150);
    return mockProducts.find((p) => p.id === id) ?? null;
  }

  try {
    const data = await api.get(`/api/products/${id}`);
    return data.product ?? null;
  } catch (err) {
    console.warn('[Products] fetchById failed:', err.message);
    return mockProducts.find((p) => p.id === id) ?? null;
  }
}

/**
 * Fetch a product by slug (for PDP pages)
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function fetchProductBySlug(slug) {
  if (MOCK_FALLBACK) {
    await delay(150);
    return mockProducts.find((p) => p.slug === slug) ?? null;
  }

  try {
    const data = await api.get(`/api/products/slug/${slug}`);
    return data.product ?? null;
  } catch (err) {
    console.warn('[Products] fetchBySlug failed:', err.message);
    return mockProducts.find((p) => p.slug === slug) ?? null;
  }
}

/**
 * Fetch all products with optional filters
 * @param {Object} filters - { category, wearType, gender, featured, isNew, minPrice, maxPrice, search }
 * @returns {Promise<Object[]>}
 */
export async function fetchProducts(filters = {}) {
  if (MOCK_FALLBACK) {
    await delay(300);
    return applyMockFilters(mockProducts, filters);
  }

  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, v);
    });
    const data = await api.get(`/api/products?${params}`);
    return data.products ?? [];
  } catch (err) {
    console.warn('[Products] fetchProducts failed:', err.message);
    return applyMockFilters(mockProducts, filters);
  }
}

/**
 * Fetch featured products
 * @param {number} limit
 * @returns {Promise<Object[]>}
 */
export async function fetchFeaturedProducts(limit = 6) {
  if (MOCK_FALLBACK) {
    await delay(200);
    return mockProducts.filter((p) => p.featured).slice(0, limit);
  }

  try {
    const data = await api.get(`/api/products/featured?limit=${limit}`);
    return data.products ?? [];
  } catch (err) {
    console.warn('[Products] fetchFeatured failed:', err.message);
    return mockProducts.filter((p) => p.featured).slice(0, limit);
  }
}

// ─────────────────────────────────────────────
// CART INTEGRATION
// ─────────────────────────────────────────────

/**
 * Add product to backend cart
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Object>}
 */
export async function addToCartAPI(productId, quantity = 1) {
  if (MOCK_FALLBACK) {
    await delay(200);
    return { success: true, mock: true };
  }

  try {
    return await api.post('/api/cart', { productId, quantity });
  } catch (err) {
    console.warn('[Cart] addToCart failed:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Get current cart from backend
 * @returns {Promise<Object>}
 */
export async function getCartAPI() {
  if (MOCK_FALLBACK) {
    return { success: true, cart: { items: [], subtotal: 0 } };
  }

  try {
    return await api.get('/api/cart');
  } catch (err) {
    console.warn('[Cart] getCart failed:', err.message);
    return { success: false, cart: { items: [], subtotal: 0 } };
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function applyMockFilters(products, filters) {
  let result = [...products];
  if (filters.category)  result = result.filter((p) => p.category === filters.category);
  if (filters.wearType)  result = result.filter((p) => p.wearType === filters.wearType);
  if (filters.featured)  result = result.filter((p) => p.featured);
  if (filters.isNew)     result = result.filter((p) => p.isNew);
  if (filters.minPrice)  result = result.filter((p) => p.price >= filters.minPrice);
  if (filters.maxPrice)  result = result.filter((p) => p.price <= filters.maxPrice);
  if (filters.gender)    result = result.filter((p) => p.gender?.includes(filters.gender));
  return result;
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
