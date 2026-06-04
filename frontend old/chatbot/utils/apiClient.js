/**
 * API Client — Éclat Platform (Chatbot)
 * 
 * Sends requests directly to the FastAPI backend.
 * NEXT_PUBLIC_API_URL = backend base URL (e.g. http://localhost:8000)
 * 
 * Session ID is automatically appended to every request.
 */

const API_BASE      = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const MOCK_FALLBACK = process.env.NEXT_PUBLIC_MOCK_FALLBACK === 'true';

export { MOCK_FALLBACK };

// ─────────────────────────────────────────────
// SESSION
// ─────────────────────────────────────────────

export function getSessionId() {
  if (typeof window === 'undefined') return 'ssr-session';
  let sid = localStorage.getItem('eclat_session_id');
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('eclat_session_id', sid);
  }
  return sid;
}

// ─────────────────────────────────────────────
// CORE FETCH
// ─────────────────────────────────────────────

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': getSessionId(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let msg = `API ${res.status}`;
    try { const e = await res.json(); msg = e.detail || e.message || msg; } catch (_) {}
    throw new Error(msg);
  }

  return res.json();
}

export const api = {
  get:    (path, opts = {}) =>
    apiFetch(path, { method: 'GET', ...opts }),
  post:   (path, body, opts = {}) =>
    apiFetch(path, { method: 'POST',   body: JSON.stringify(body), ...opts }),
  patch:  (path, body, opts = {}) =>
    apiFetch(path, { method: 'PATCH',  body: JSON.stringify(body), ...opts }),
  delete: (path, opts = {}) =>
    apiFetch(path, { method: 'DELETE', ...opts }),
};
