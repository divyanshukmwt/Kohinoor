/**
 * Next.js API Route — /api/products
 * Proxy for product listing with filters.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const res = await fetch(`${BACKEND}/api/products?${searchParams}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return Response.json({ products: [] }, { status: 200 });
    return Response.json(await res.json());
  } catch (err) {
    return Response.json({ products: [], error: err.message }, { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/products`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    return Response.json(await res.json(), { status: res.ok ? 200 : 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
