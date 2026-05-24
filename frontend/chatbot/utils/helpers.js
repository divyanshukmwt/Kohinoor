/**
 * Utility functions for the Éclat chatbot
 */

/**
 * Format price in Indian Rupees
 */
export function formatINR(amount) {
  if (!amount && amount !== 0) return "—";
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate text to a given length
 */
export function truncate(text, length = 80) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "…";
}

/**
 * Debounce function
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a UUID-like ID
 */
export function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Convert selections object to readable summary
 */
export function selectionsToSummary(selections) {
  const labels = {
    purpose: "Purpose",
    gender: "For",
    material: "Material",
    wearType: "Wear type",
    style: "Style",
    budget: "Budget",
  };

  return Object.entries(selections)
    .filter(([, v]) => v)
    .map(([k, v]) => `${labels[k]}: ${v}`)
    .join(" · ");
}

/**
 * Check if GSAP is loaded
 */
export function isGSAPLoaded() {
  return typeof window !== "undefined" && !!window.gsap;
}
