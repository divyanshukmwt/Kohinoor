"""
Pinecone Service — Éclat Platform
Vector upsert + semantic search using Gemini text-embedding-004 (768-dim).
Lazy initialization — connects only when first called.
"""

import os
from typing import Optional, List

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX   = os.getenv("PINECONE_INDEX", "eclat-jewellery")
EMBEDDING_DIM    = 768  # Gemini text-embedding-004

_pc    = None
_index = None


def _get_index():
    global _pc, _index
    if _index is not None:
        return _index
    if not PINECONE_API_KEY:
        return None
    try:
        from pinecone import Pinecone, ServerlessSpec
        _pc = Pinecone(api_key=PINECONE_API_KEY)

        # Create index if it doesn't exist
        existing = [idx.name for idx in _pc.list_indexes()]
        if PINECONE_INDEX not in existing:
            _pc.create_index(
                name=PINECONE_INDEX,
                dimension=EMBEDDING_DIM,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            print(f"✅ Pinecone index '{PINECONE_INDEX}' created")

        _index = _pc.Index(PINECONE_INDEX)
        return _index
    except Exception as e:
        print(f"[Pinecone] Connection error: {e}")
        return None


# ─────────────────────────────────────────────
# UPSERT
# ─────────────────────────────────────────────

def upsert_product(product: dict) -> dict:
    """
    Generate embedding from embeddingText and upsert to Pinecone.
    product dict must include: id, embeddingText, category, materials,
    occasions, styleTags, wearType, price, gender
    """
    from app.chatbot.gemini_service import generate_embedding

    index = _get_index()
    if index is None:
        return {"success": False, "message": "Pinecone not configured. Set PINECONE_API_KEY."}

    text = product.get("embeddingText") or product.get("name", "")
    embedding = generate_embedding(text)

    vector = {
        "id":     str(product["id"]),
        "values": embedding,
        "metadata": {
            "category":  product.get("category", ""),
            "materials": product.get("materials", []),
            "occasions": product.get("occasions", []),
            "styleTags": product.get("styleTags", []),
            "wearType":  product.get("wearType", ""),
            "gender":    product.get("gender", []),
            "price":     float(product.get("price", 0)),
            "featured":  bool(product.get("featured", False)),
        },
    }

    index.upsert(vectors=[vector])
    return {"success": True, "message": f"Product '{product['id']}' indexed in Pinecone"}


def bulk_upsert_products(products: list) -> dict:
    """Batch upsert for initial indexing. Processes in batches of 100."""
    from app.chatbot.gemini_service import generate_embedding

    index = _get_index()
    if index is None:
        return {"success": False, "message": "Pinecone not configured"}

    vectors = []
    for p in products:
        text = p.get("embeddingText") or p.get("name", "")
        try:
            emb = generate_embedding(text)
        except Exception as e:
            print(f"[Pinecone] Embedding failed for {p['id']}: {e}")
            continue

        vectors.append({
            "id":     str(p["id"]),
            "values": emb,
            "metadata": {
                "category":  p.get("category", ""),
                "materials": p.get("materials", []),
                "occasions": p.get("occasions", []),
                "styleTags": p.get("styleTags", []),
                "wearType":  p.get("wearType", ""),
                "gender":    p.get("gender", []),
                "price":     float(p.get("price", 0)),
            },
        })

    # Batch in groups of 100
    batch_size = 100
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        index.upsert(vectors=batch)
        print(f"[Pinecone] Upserted batch {i // batch_size + 1} ({len(batch)} vectors)")

    return {"success": True, "message": f"{len(vectors)} products indexed"}


# ─────────────────────────────────────────────
# SEMANTIC SEARCH
# ─────────────────────────────────────────────

def semantic_search(
    query_text:   str,
    category:     Optional[str]   = None,
    materials:    Optional[list]  = None,
    occasions:    Optional[list]  = None,
    style_tags:   Optional[list]  = None,
    wear_type:    Optional[str]   = None,
    gender:       Optional[str]   = None,
    min_price:    Optional[float] = None,
    max_price:    Optional[float] = None,
    top_k:        int = 10,
) -> List[str]:
    """
    Generate embedding from query_text, apply metadata filters, return product IDs.
    Falls back to empty list when Pinecone is unavailable.
    """
    from app.chatbot.gemini_service import generate_embedding

    index = _get_index()
    if index is None:
        print("[Pinecone] Not configured — returning empty results")
        return []

    try:
        query_vector = generate_embedding(query_text)
        pinecone_filter: dict = {}

        if category:    pinecone_filter["category"]  = {"$eq": category}
        if wear_type:   pinecone_filter["wearType"]  = {"$eq": wear_type.lower()}
        if gender and gender != "unisex":
            pinecone_filter["gender"] = {"$in": [gender.lower(), "unisex"]}
        if materials:   pinecone_filter["materials"] = {"$in": [m.lower() for m in materials]}
        if occasions:   pinecone_filter["occasions"] = {"$in": [o.lower() for o in occasions]}
        if style_tags:  pinecone_filter["styleTags"] = {"$in": [s.lower() for s in style_tags]}

        # Price range filter
        price_filter: dict = {}
        if min_price is not None: price_filter["$gte"] = min_price
        if max_price is not None: price_filter["$lte"] = max_price
        if price_filter:          pinecone_filter["price"] = price_filter

        results = index.query(
            vector=           query_vector,
            top_k=            top_k,
            include_metadata= True,
            filter=           pinecone_filter if pinecone_filter else None,
        )

        return [match["id"] for match in results.get("matches", [])]

    except Exception as e:
        print(f"[Pinecone] Search error: {e}")
        return []


# ─────────────────────────────────────────────
# DELETE
# ─────────────────────────────────────────────

def delete_product(product_id: str) -> dict:
    index = _get_index()
    if index is None:
        return {"success": False, "message": "Pinecone not configured"}
    index.delete(ids=[str(product_id)])
    return {"success": True, "message": f"Product '{product_id}' removed from Pinecone"}
