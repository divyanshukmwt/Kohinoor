/**
 * Next.js API Route — /api/chatbot/recommend
 * Proxies recommendation requests to the FastAPI backend.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/api/chatbot/recommend`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    if (!res.ok) {
      return Response.json({ success: false, products: [], error: 'Backend unavailable' }, { status: 200 });
    }

    return Response.json(await res.json());
  } catch (err) {
    console.error('[/api/chatbot/recommend]', err);
    return Response.json({ success: false, products: [], error: err.message }, { status: 200 });
  }
}
