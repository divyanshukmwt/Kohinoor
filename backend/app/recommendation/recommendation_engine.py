"""
Recommendation Engine — Éclat Platform
Full pipeline: Gemini semantic extraction → Pinecone search → PostgreSQL hydration.
Budget keys match frontend flowConfig.js exactly.
"""

from typing import Optional, List
from sqlalchemy.orm import Session

from app.chatbot.gemini_service import extract_semantic_query
from app.chatbot.pinecone_service import semantic_search
from app.products.product_service import get_products_by_ids, get_products

# ── Budget ranges match frontend flowConfig.js exactly ────────────────
BUDGET_RANGES = {
    "under_5k":  {"min": 0,      "max": 5_000},
    "5k_15k":    {"min": 5_000,  "max": 15_000},
    "15k_50k":   {"min": 15_000, "max": 50_000},
    "luxury":    {"min": 50_000, "max": None},
    # Legacy aliases (backward compat)
    "5k_20k":    {"min": 5_000,  "max": 20_000},
    "20k_50k":   {"min": 20_000, "max": 50_000},
    "above_50k": {"min": 50_000, "max": None},
}

# wearType (frontend) → category (DB)
WEAR_TO_CATEGORY = {
    "neck":   "necklace",
    "wrist":  "bracelet",
    "finger": "ring",
    "ear":    "earrings",
    "foot":   "anklet",
    # aliases
    "hands":  "bracelet",
    "ears":   "earrings",
    "rings":  "ring",
}


def run_recommendation_pipeline(
    db:                   Session,
    selections:           dict,
    conversational_query: str = "",
    top_k:                int = 6,
) -> dict:
    """
    Full recommendation pipeline.
    Flow:
      1. Gemini → embeddingQuery + structured filters
      2. Pinecone → vector search → ranked product IDs
      3. PostgreSQL → hydrate full product objects in ranked order
      4. Fallback → DB keyword search if Pinecone returns nothing
    """

    # ── Step 1: Gemini semantic extraction ───────────────────────────────
    try:
        semantic = extract_semantic_query(selections, conversational_query)
        embedding_query: str = semantic.get("embeddingQuery", "luxury jewellery")
        filters: dict        = semantic.get("filters", {})
    except Exception as e:
        print(f"[Pipeline] Gemini extraction failed: {e}")
        embedding_query = _build_fallback_query(selections, conversational_query)
        filters = _build_fallback_filters(selections)

    # ── Apply budget filter ───────────────────────────────────────────────
    budget_key = selections.get("budget")
    if budget_key and budget_key in BUDGET_RANGES:
        br = BUDGET_RANGES[budget_key]
        filters.setdefault("minPrice", br["min"])
        if br["max"] is not None:
            filters.setdefault("maxPrice", br["max"])

    # ── Step 2: Pinecone vector search ────────────────────────────────────
    wear_type = filters.get("wearType") or selections.get("wearType") or ""
    category  = WEAR_TO_CATEGORY.get(wear_type.lower(), None) if wear_type else None

    try:
        product_ids = semantic_search(
            query_text= embedding_query,
            category=   category,
            materials=  filters.get("materials"),
            occasions=  filters.get("occasions"),
            style_tags= filters.get("styleTags"),
            wear_type=  wear_type or None,
            gender=     filters.get("gender"),
            min_price=  filters.get("minPrice"),
            max_price=  filters.get("maxPrice"),
            top_k=      top_k * 2,
        )
    except Exception as e:
        print(f"[Pipeline] Pinecone search failed: {e}")
        product_ids = []

    # ── Step 3: Hydrate from PostgreSQL ──────────────────────────────────
    if product_ids:
        products = get_products_by_ids(db, product_ids)
        source   = "pinecone"
    else:
        products = _fallback_db_search(db, selections, filters, limit=top_k)
        source   = "db_fallback"

    products = products[:top_k]

    return {
        "success":        True,
        "products":       [p.to_dict() for p in products],
        "embeddingQuery": embedding_query,
        "pineconeCount":  len(product_ids),
        "source":         source,
        "filters":        filters,
    }


def _fallback_db_search(db: Session, selections: dict, filters: dict, limit: int = 6):
    wear_raw = filters.get("wearType") or selections.get("wearType") or ""
    category = WEAR_TO_CATEGORY.get(wear_raw.lower(), None) if wear_raw else None
    gender   = filters.get("gender") or selections.get("gender")

    query_parts = []
    if selections.get("material"): query_parts.append(selections["material"])
    if selections.get("purpose"):  query_parts.append(selections["purpose"])
    if selections.get("style"):    query_parts.append(selections["style"])
    search_text = " ".join(query_parts) if query_parts else None

    material_list = filters.get("materials")
    material      = material_list[0] if material_list else None

    return get_products(
        db,
        category=  category,
        gender=    gender,
        min_price= filters.get("minPrice"),
        max_price= filters.get("maxPrice"),
        search=    search_text or material,
        limit=     limit,
    )


def _build_fallback_query(selections: dict, free_text: str = "") -> str:
    parts = []
    for key in ("style", "material", "purpose", "wearType"):
        v = selections.get(key, "")
        if v: parts.append(v)
    if free_text: parts.append(free_text)
    return " ".join(parts) or "luxury elegant fine jewellery"


def _build_fallback_filters(selections: dict) -> dict:
    f = {}
    if selections.get("material"): f["materials"] = [selections["material"].lower()]
    if selections.get("wearType"): f["wearType"]  = selections["wearType"].lower()
    if selections.get("gender"):   f["gender"]    = selections["gender"].lower()
    if selections.get("style"):    f["styleTags"] = [selections["style"].lower()]
    if selections.get("purpose"):  f["occasions"] = [selections["purpose"].lower()]
    return f
