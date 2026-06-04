/**
 * Journal Service
 *
 * Placeholder service layer for journal/editorial content API calls.
 *
 * API endpoint reference:
 *   GET /api/journal              → getPosts()
 *   GET /api/journal/:slug        → getPostBySlug()
 *   GET /api/journal/featured     → getFeaturedPosts()
 */

import { JOURNAL_POSTS } from '@/data/journal';

function delay(ms = 100) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Get all journal posts
 * @param {{ category?: string }} filters
 * @returns {Promise<Array>}
 */
export async function getPosts(filters = {}) {
  // TODO: Replace with → fetch(`/api/journal?${new URLSearchParams(filters)}`)
  await delay();
  if (filters.category && filters.category !== 'all') {
    return JOURNAL_POSTS.filter((p) => p.category === filters.category);
  }
  return JOURNAL_POSTS;
}

/**
 * Get a single post by slug
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getPostBySlug(slug) {
  // TODO: Replace with → fetch(`/api/journal/${slug}`)
  await delay();
  return JOURNAL_POSTS.find((p) => p.slug === slug) ?? null;
}

/**
 * Get featured posts
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getFeaturedPosts(limit = 3) {
  // TODO: Replace with → fetch(`/api/journal/featured?limit=${limit}`)
  await delay();
  return JOURNAL_POSTS.filter((p) => p.isFeatured).slice(0, limit);
}
