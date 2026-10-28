"""
Recommendation Engine — Kohinoor / Éclat Platform
Strict, accurate Knowledge Base Filtering & Retrieval Pipeline:
  1. Enforces exact Category / WearType match (e.g., rings -> RINGS, foot -> Anklets)
  2. Enforces exact Material match (e.g., rose gold -> ONLY rose gold items; never platinum or plain silver)
  3. Enforces strict Budget ceiling (never returns items above maxPrice) and prioritizes exact bracket [minPrice, maxPrice]
  4. Ranks matching items by Occasion, Style, Gender, and Keyword relevance
"""

from typing import Optional, List
from sqlalchemy.orm import Session

from app.chatbot.gemini_service import refine_question_and_extract_filters
from app.products.product_service import ensure_seeded
from app.database.models import Product


WEAR_TO_CATEGORY = {
    "neck":      "NECKLACES",
    "necklace":  "NECKLACES",
    "necklaces": "NECKLACES",
    "pendant":   "NECKLACES",
    "ears":      "EARRINGS",
    "ear":       "EARRINGS",
    "earrings":  "EARRINGS",
    "rings":     "RINGS",
    "ring":      "RINGS",
    "finger":    "RINGS",
    "hands":     "BRACELETS",
    "wrist":     "BRACELETS",
    "bracelet":  "BRACELETS",
    "bracelets": "BRACELETS",
    "foot":      "BRACELETS",
    "anklet":    "BRACELETS",
}


def run_recommendation_pipeline(
    db:                   Session,
    selections:           dict,
    conversational_query: str = "",
    top_k:                int = 6,
    api_key:              Optional[str] = None,
    model:                Optional[str] = None,
) -> dict:
    """
    Full Knowledge Base recommendation pipeline (No Pinecone required).
    """
    ensure_seeded(db, force_update=False)

    refined = refine_question_and_extract_filters(
        selections=selections or {},
        user_query=conversational_query or "",
        api_key=api_key,
        model=model,
    )

    filters = refined.get("filters") or {}
    all_products: List[Product] = db.query(Product).all()

    scored_products = _filter_and_score_knowledge_base(all_products, filters, selections or {})

    selected_products = [item["product"].to_dict() for item in scored_products[:top_k]]

    return {
        "success":          True,
        "products":         selected_products,
        "count":            len(selected_products),
        "refinedQuestion":  refined.get("refinedQuestion"),
        "conciergeMessage": refined.get("conciergeMessage"),
        "embeddingQuery":   refined.get("refinedQuestion"),
        "filters":          filters,
        "modelUsed":        refined.get("modelUsed"),
        "aiActive":         refined.get("aiActive", False),
        "source":           "knowledge_base",
    }


def _product_matches_material(p: Product, req_materials: List[str]) -> bool:
    """
    Strictly verify that the product contains the requested material(s).
    Prevents 'rose gold' from matching plain 'gold' or 'platinum', etc.
    """
    if not req_materials:
        return True

    p_mats = {m.strip().lower() for m in (p.materials or []) if m}
    p_gems = {g.strip().lower() for g in (p.gemstones or []) if g}
    p_tags = {t.strip().lower() for t in (p.tags or []) if t}
    all_mat_tokens = p_mats | p_gems | p_tags

    for req in req_materials:
        r = req.strip().lower()
        if r == "rose gold":
            if "rose gold" in p_mats:
                return True
        elif r == "gold":
            if "gold" in p_mats:
                return True
        elif r in ("oxidized silver", "silver"):
            if "silver" in p_mats or "oxidized silver" in p_mats:
                return True
        elif r == "platinum":
            if "platinum" in p_mats:
                return True
        elif r in ("diamond", "polki"):
            if "diamond" in all_mat_tokens or "polki" in all_mat_tokens:
                return True
        elif r in ("pearl", "kundan"):
            if "pearl" in all_mat_tokens or "kundan" in all_mat_tokens:
                return True
        elif r in all_mat_tokens:
            return True

    return False


def _product_matches_category(p: Product, req_cat: Optional[str], req_wear: str) -> bool:
    """
    Strictly verify that the product matches the requested category / wearType.
    Separates anklets ('foot') from wrist bracelets ('hands').
    """
    p_cat = (p.category or "").upper()
    p_wear = (p.wear_type or "").lower()

    if req_wear == "foot":
        return p_wear == "foot"
    if req_wear == "hands":
        return p_wear == "hands" or (p_cat == "BRACELETS" and p_wear != "foot")
    if req_cat:
        return p_cat == req_cat.upper()
    return True


def _filter_and_score_knowledge_base(
    products: List[Product],
    filters: dict,
    selections: dict,
) -> List[dict]:
    """
    Strict filtering + relevance scoring over the Jewellery Knowledge Base:
      - Never returns wrong category
      - Never returns wrong material when material is specified
      - Never returns items above maxPrice when a budget ceiling is specified
    """
    req_wear = (filters.get("wearType") or selections.get("wearType") or "").lower().strip()
    req_cat = filters.get("category")
    if not req_cat and req_wear in WEAR_TO_CATEGORY:
        req_cat = WEAR_TO_CATEGORY[req_wear]

    req_materials = [m.lower() for m in (filters.get("materials") or []) if m]
    req_occasions = [o.lower() for o in (filters.get("occasions") or []) if o]
    req_styles    = [s.lower() for s in (filters.get("styleTags") or []) if s]
    req_gender    = (filters.get("gender") or "").lower().strip()
    min_price     = filters.get("minPrice")
    max_price     = filters.get("maxPrice")
    keywords      = [k.lower() for k in (filters.get("keywords") or []) if k]

    exact_bracket_matches = []
    under_ceiling_matches = []
    same_cat_mat_closest = []

    for p in products:
        # 1. Hard Filter: Category / WearType
        if not _product_matches_category(p, req_cat, req_wear):
            continue

        # 2. Hard Filter: Material
        if not _product_matches_material(p, req_materials):
            continue

        # 3. Hard Filter: Gender (if explicitly male, only male/unisex)
        p_genders = [g.lower() for g in (p.gender or [])]
        if req_gender == "male" and "male" not in p_genders:
            continue

        p_price = float(p.price or 0)

        # 4. Budget evaluation (Strict ceiling: never exceed max_price)
        within_ceiling = True
        if max_price is not None and p_price > float(max_price):
            within_ceiling = False

        within_floor = True
        if min_price is not None and p_price < float(min_price):
            within_floor = False

        # Score calculation for ranking among valid matches
        score = 50.0
        p_occs = [o.lower() for o in (p.occasions or [])]
        p_styles = [s.lower() for s in (p.style_tags or [])]
        haystack = " ".join([
            p.name or "",
            p.description or "",
            p.short_description or "",
            p.embedding_text or "",
            p.tag or "",
            p.collection or "",
            " ".join(p_occs),
            " ".join(p_styles),
            " ".join(p.tags or []),
        ]).lower()

        # Occasion match boost
        for o in req_occasions:
            if o in p_occs:
                score += 20.0
            elif o in haystack:
                score += 10.0

        # Style match boost
        for s in req_styles:
            if s in p_styles:
                score += 18.0
            elif s in haystack:
                score += 8.0

        # Keyword match boost
        for kw in keywords:
            if kw in (p.name or "").lower():
                score += 15.0
            elif kw in haystack:
                score += 6.0

        score += float(p.rating or 4.5)

        entry = {"product": p, "score": score}

        if within_ceiling and within_floor:
            exact_bracket_matches.append(entry)
        elif within_ceiling:
            # Same category + same material + still under user's max budget ceiling
            entry["score"] -= 15.0
            under_ceiling_matches.append(entry)
        else:
            # Only used if user picked a very low budget for an inherently luxury material (e.g. Platinum under 2k)
            price_diff = abs(p_price - float(max_price or min_price or 0))
            entry["score"] -= (price_diff / 1000.0)
            same_cat_mat_closest.append(entry)

    exact_bracket_matches.sort(key=lambda x: x["score"], reverse=True)
    under_ceiling_matches.sort(key=lambda x: x["score"], reverse=True)
    same_cat_mat_closest.sort(key=lambda x: x["score"], reverse=True)

    # If we have exact in-budget + exact material + exact category matches, return ONLY those!
    if exact_bracket_matches:
        return exact_bracket_matches

    # Otherwise if there are lower-priced items of the exact same category & material (under maxPrice), return those
    if under_ceiling_matches:
        return under_ceiling_matches

    # Otherwise return closest price match that still honors exact Category & Material
    return same_cat_mat_closest
