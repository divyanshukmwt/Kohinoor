/**
 * Next.js API Route — /api/cart/[itemId]
 * Update or remove a specific cart item.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function sessionHeader(request) {
  return request.headers.get('X-Session-ID') || '';
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/cart/${params.itemId}`, {
      method:  'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionHeader(request),
      },
      body: JSON.stringify(body),
    });
    return Response.json(await res.json(), { status: res.ok ? 200 : 400 });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const res = await fetch(`${BACKEND}/api/cart/${params.itemId}`, {
      method:  'DELETE',
      headers: { 'X-Session-ID': sessionHeader(request) },
    });
    return Response.json(await res.json());
  } catch (err) {
    return Response.json({ success: false, error: err.message });
  }
}
