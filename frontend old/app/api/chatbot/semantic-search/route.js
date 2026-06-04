/**
 * Next.js API Route — /api/chatbot/semantic-search
 *
 * Secure proxy for Pinecone semantic search.
 * Keeps PINECONE_API_KEY and GEMINI_API_KEY server-side only.
 *
 * Flow:
 *   Browser → POST /api/chatbot/semantic-search
 *          → This route → FastAPI backend → Pinecone → product IDs
 *          → Returns { productIds: string[], products: Object[] }
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, filters = {}, topK = 6 } = body;

    if (!query) {
      return Response.json({ error: 'query is required' }, { status: 400 });
    }

    // Proxy to FastAPI backend (which has the real keys)
    const res = await fetch(`${BACKEND_URL}/api/chatbot/semantic-search`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ query, filters, topK }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[/api/chatbot/semantic-search] Backend error:', err);
      return Response.json({ productIds: [], products: [], error: 'Backend unavailable' }, { status: 200 });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error('[/api/chatbot/semantic-search] Error:', err);
    return Response.json({ productIds: [], products: [], error: err.message }, { status: 200 });
  }
}
