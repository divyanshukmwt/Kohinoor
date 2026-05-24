/**
 * Cart Service — Éclat Platform (Main App)
 * Real API calls to FastAPI backend with session-based cart.
 * Session ID persisted in localStorage via getSessionId().
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_FALLBACK === 'true';

function getSessionId() {
  if (typeof window === 'undefined') return 'ssr-session';
  let sid = localStorage.getItem('eclat_session_id');
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('eclat_session_id', sid);
  }
  return sid;
}

async function cartFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': getSessionId(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Cart API ${res.status}`);
  return res.json();
}

export async function getCart() {
  if (USE_MOCK) return { success: true, cart: { items: [], subtotal: 0 } };
  try {
    return await cartFetch('/api/cart');
  } catch (err) {
    console.warn('[cart] getCart failed:', err.message);
    return { success: false, cart: { items: [], subtotal: 0 } };
  }
}

export async function addToCart(productId, quantity = 1) {
  if (USE_MOCK) return { success: true, mock: true };
  try {
    return await cartFetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  } catch (err) {
    console.warn('[cart] addToCart failed:', err.message);
    return { success: false, error: err.message };
  }
}

export async function updateCartItem(itemId, quantity) {
  if (USE_MOCK) return { success: true };
  try {
    return await cartFetch(`/api/cart/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  } catch (err) {
    console.warn('[cart] updateCartItem failed:', err.message);
    return { success: false, error: err.message };
  }
}

export async function removeCartItem(itemId) {
  if (USE_MOCK) return { success: true };
  try {
    return await cartFetch(`/api/cart/${itemId}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[cart] removeCartItem failed:', err.message);
    return { success: false };
  }
}

export async function clearCart() {
  if (USE_MOCK) return { success: true };
  try {
    return await cartFetch('/api/cart', { method: 'DELETE' });
  } catch (err) {
    console.warn('[cart] clearCart failed:', err.message);
    return { success: false };
  }
}
