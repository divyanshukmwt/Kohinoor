/**
 * Product Service — Éclat Platform (Main App)
 * 
 * Real API calls to FastAPI backend with mock fallback.
 * Used by: app/page.js, app/shop/page.js, app/shop/[slug]/page.js
 * 
 * API_URL from NEXT_PUBLIC_API_URL (server-side: process.env; client-side: NEXT_PUBLIC_ prefix)
 */

import { PRODUCTS, CATEGORIES } from '@/data/products';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_FALLBACK === 'true';

async function backendFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  });
  if (!res.ok) throw new Error(`Backend ${res.status}: ${path}`);
  return res.json();
}

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

export async function getProducts(filters = {}) {
  if (USE_MOCK) return applyMockFilters(PRODUCTS, filters);

  try {
    const params = new URLSearchParams();
    const keyMap = { priceMin: 'minPrice', priceMax: 'maxPrice', isNew: 'isNew', isFeatured: 'featured' };
    Object.entries(filters).forEach(([k, v]) => {
      if (v == null || v === '' || v === 'all') return;
      params.append(keyMap[k] || k, v);
    });
    const data = await backendFetch(`/api/products?${params}`);
    return data.products ?? [];
  } catch (err) {
    console.warn('[products] getProducts fallback:', err.message);
    return applyMockFilters(PRODUCTS, filters);
  }
}

export async function getProductBySlug(slug) {
  if (USE_MOCK) return PRODUCTS.find((p) => p.slug === slug) ?? null;

  try {
    const data = await backendFetch(`/api/products/slug/${slug}`);
    return data.product ?? null;
  } catch (err) {
    console.warn('[products] getProductBySlug fallback:', err.message);
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getProductById(id) {
  if (USE_MOCK) return PRODUCTS.find((p) => p.id === id) ?? null;

  try {
    const data = await backendFetch(`/api/products/${id}`);
    return data.product ?? null;
  } catch (err) {
    console.warn('[products] getProductById fallback:', err.message);
    return PRODUCTS.find((p) => p.id === id) ?? null;
  }
}

export async function getFeaturedProducts(limit = 4) {
  if (USE_MOCK) return PRODUCTS.filter((p) => p.isFeatured || p.featured).slice(0, limit);

  try {
    const data = await backendFetch(`/api/products/featured?limit=${limit}`);
    return data.products ?? [];
  } catch (err) {
    console.warn('[products] getFeaturedProducts fallback:', err.message);
    return PRODUCTS.filter((p) => p.isFeatured || p.featured).slice(0, limit);
  }
}

export async function getRelatedProducts(productId) {
  if (USE_MOCK) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return [];
    return PRODUCTS.filter((p) => product.relatedProducts?.includes(p.id));
  }

  try {
    // Fetch related product IDs from the product itself, then batch-fetch
    const data = await backendFetch(`/api/products/${productId}`);
    const related = data.product?.relatedProducts ?? [];
    if (!related.length) return [];
    const batch = await backendFetch('/api/products/batch', {
      method: 'POST',
      body: JSON.stringify({ ids: related }),
    });
    return Array.isArray(batch) ? batch : [];
  } catch (err) {
    console.warn('[products] getRelatedProducts fallback:', err.message);
    return [];
  }
}

export async function getCategories() {
  return CATEGORIES;
}

export async function searchProducts(query) {
  if (USE_MOCK) {
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.includes(q))
    );
  }

  try {
    const data = await backendFetch(`/api/products?search=${encodeURIComponent(query)}`);
    return data.products ?? [];
  } catch (err) {
    console.warn('[products] searchProducts fallback:', err.message);
    return [];
  }
}

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────

function applyMockFilters(products, filters) {
  let result = [...products];
  if (filters.category && filters.category !== 'all')
    result = result.filter((p) => p.category === filters.category);
  if (filters.priceMin != null) result = result.filter((p) => p.price >= filters.priceMin);
  if (filters.priceMax != null) result = result.filter((p) => p.price <= filters.priceMax);
  if (filters.isNew)     result = result.filter((p) => p.isNew);
  if (filters.isFeatured) result = result.filter((p) => p.isFeatured || p.featured);
  return result;
}
