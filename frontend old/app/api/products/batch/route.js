/**
 * Next.js API Route — /api/products/batch
 * Fetch multiple products by IDs (used after Pinecone search).
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/products/batch`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!res.ok) return Response.json([], { status: 200 });
    return Response.json(await res.json());
  } catch (err) {
    console.error('[/api/products/batch]', err);
    return Response.json([], { status: 200 });
  }
}
