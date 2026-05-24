/**
 * Utility functions for Aurelia Lore
 */

/**
 * Format price as currency string
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date for journal posts
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a slug from a string
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Debounce a function
 */
export function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Create a CSS class string from conditional classes (cn utility)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 * Interpolate between two values based on progress (0–1)
 */
export function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

/**
 * Pad a number with leading zeros
 */
export function padNumber(num, places = 2) {
  return String(num).padStart(places, '0');
}
