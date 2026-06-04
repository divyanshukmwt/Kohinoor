/**
 * Orders Service — Éclat Platform (Main App)
 * Real API calls to FastAPI backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_FALLBACK === 'true';

function getSessionId() {
  if (typeof window === 'undefined') return 'ssr-session';
  return localStorage.getItem('eclat_session_id') || 'no-session';
}

async function orderFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': getSessionId(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Orders API ${res.status}`);
  return res.json();
}

export async function createOrder(payload = {}) {
  if (USE_MOCK) {
    console.info('[orders] createOrder (mock)', payload);
    return { success: true, order: { id: `ord_${Date.now()}`, status: 'pending', total: 0 } };
  }
  try {
    return await orderFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('[orders] createOrder failed:', err.message);
    return { success: false, error: err.message };
  }
}

export async function getOrders() {
  if (USE_MOCK) return { success: true, orders: [] };
  try {
    return await orderFetch('/api/orders');
  } catch (err) {
    console.warn('[orders] getOrders failed:', err.message);
    return { success: false, orders: [] };
  }
}

export async function getOrderById(orderId) {
  if (USE_MOCK) return { success: false, order: null };
  try {
    return await orderFetch(`/api/orders/${orderId}`);
  } catch (err) {
    console.warn('[orders] getOrderById failed:', err.message);
    return { success: false, order: null };
  }
}
