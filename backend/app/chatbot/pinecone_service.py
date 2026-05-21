# ======================================================
# PINECONE SERVICE - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/chatbot/pinecone_service.py
# ======================================================

import os

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX   = os.getenv("PINECONE_INDEX", "kohinoor-jewelry")
EMBEDDING_MODEL  = "all-MiniLM-L6-v2"

# ======================================================
# LAZY INITIALIZATION
# Nothing connects at import time — only when first called
# ======================================================

_pc              = None
_index           = None
_embedding_model = None


def _get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL)
    return _embedding_model


def _get_index():
    global _pc, _index
    if _index is None:
        if not PINECONE_API_KEY:
            return None
        from pinecone import Pinecone
        _pc    = Pinecone(api_key=PINECONE_API_KEY)
        _index = _pc.Index(PINECONE_INDEX)
    return _index


# ======================================================
# GENERATE EMBEDDING
# ======================================================

def generate_embedding(text: str) -> list:
    model = _get_embedding_model()
    return model.encode(text).tolist()


# ======================================================
# UPSERT PRODUCT INTO PINECONE
# ======================================================

def upsert_product_to_pinecone(product: dict):
    index = _get_index()
    if index is None:
        return {
            "success": False,
            "message": "Pinecone not configured. Add PINECONE_API_KEY to .env"
        }

    embedding = generate_embedding(product["embeddingText"])

    index.upsert(vectors=[
        {
            "id":     str(product["id"]),
            "values": embedding,
            "metadata": {
                "category":  product.get("category", ""),
                "materials": product.get("materials", []),
                "occasions": product.get("occasions", []),
                "styleTags": product.get("styleTags", []),
                "wearType":  product.get("wearType", ""),
                "price":     float(product.get("price", 0))
            }
        }
    ])

    return {
        "success": True,
        "message": f"Product {product['id']} upserted to Pinecone"
    }


# ======================================================
# SEMANTIC SEARCH IN PINECONE
# ======================================================

def search_pinecone(
    query_text: str,
    category:   str   = None,
    materials:  list  = None,
    occasions:  list  = None,
    wear_type:  str   = None,
    price_min:  float = 0,
    price_max:  float = 9999999,
    top_k:      int   = 10
) -> list:

    index = _get_index()
    if index is None:
        return []

    query_vector    = generate_embedding(query_text)
    pinecone_filter = {}

    if category:
        pinecone_filter["category"]  = {"$eq": category}
    if materials:
        pinecone_filter["materials"] = {"$in": materials}
    if occasions:
        pinecone_filter["occasions"] = {"$in": occasions}
    if wear_type:
        pinecone_filter["wearType"]  = {"$eq": wear_type}

    pinecone_filter["price"] = {"$gte": price_min, "$lte": price_max}

    results = index.query(
        vector           = query_vector,
        top_k            = top_k,
        include_metadata = True,
        filter           = pinecone_filter
    )

    return [match["id"] for match in results["matches"]]


# ======================================================
# BUILD QUERY TEXT FROM USER SELECTIONS
# ======================================================

def build_query_text(
    occasion:  str,
    material:  str,
    wear_type: str,
    style:     str = "",
    gender:    str = ""
) -> str:

    WEAR_TO_CATEGORY = {
        "neck":       "necklace",
        "hands":      "bracelet",
        "ears":       "earrings",
        "rings":      "ring",
        "waistchain": "waist chain",
        "foot":       "anklet"
    }

    category    = WEAR_TO_CATEGORY.get(wear_type.lower(), wear_type)
    query_parts = []

    if material:    query_parts.append(material)
    query_parts.append(category)
    if occasion:    query_parts.append(f"for {occasion} occasion")
    if style:       query_parts.append(f"{style} style")
    if gender:      query_parts.append(f"for {gender}")

    return " ".join(query_parts)


# ======================================================
# DELETE PRODUCT FROM PINECONE
# ======================================================

def delete_product_from_pinecone(product_id: str):
    index = _get_index()
    if index is None:
        return {
            "success": False,
            "message": "Pinecone not configured. Add PINECONE_API_KEY to .env"
        }

    index.delete(ids=[str(product_id)])
    return {
        "success": True,
        "message": f"Product {product_id} deleted from Pinecone"
    }