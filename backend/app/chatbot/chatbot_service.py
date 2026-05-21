# ======================================================
# CHATBOT SERVICE - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/chatbot/chatbot_service.py
# PURPOSE: Orchestrates PostgreSQL + Pinecone recommendation
# ======================================================

from app.chatbot.pinecone_service import search_pinecone, build_query_text

# ---- Uncomment when Sunidhi's DB is ready ----
# from app.database import get_db
# from app.models import Product
# from sqlalchemy.orm import Session


# ======================================================
# MAPPINGS
# ======================================================

BUDGET_RANGES = {
    "under_5k":  (0, 5000),
    "5k_20k":    (5000, 20000),
    "20k_50k":   (20000, 50000),
    "above_50k": (50000, 9999999),
}

WEAR_TO_CATEGORY = {
    "neck":       "necklace",
    "hands":      "bracelet",
    "ears":       "earrings",
    "rings":      "ring",
    "waistchain": "waistchain",
    "foot":       "anklet",
}

OCCASION_MAP = {
    "function_event": {
        "label":   "Function / Event",
        "filter":  ["wedding", "festive", "party", "function"]
    },
    "gifting": {
        "label":   "Gifting",
        "filter":  ["gifting", "anniversary", "birthday"]
    }
}


# ======================================================
# MAIN RECOMMENDATION FUNCTION
# Flow:
#   1. Parse user selections
#   2. Build semantic query text
#   3. Search Pinecone → get product IDs
#   4. Fetch full product data from PostgreSQL by IDs
#   5. Return complete recommendation
# ======================================================

def get_jewelry_recommendation(data, db=None):

    # --- Step 1: Parse wear type ---
    category = WEAR_TO_CATEGORY.get(data.wear_type.lower(), data.wear_type)

    # --- Step 2: Parse occasion ---
    occasion_data  = OCCASION_MAP.get(data.occasion.lower())
    if occasion_data:
        occasion_label   = occasion_data["label"]
        occasions_filter = occasion_data["filter"]
    else:
        occasion_label   = data.occasion
        occasions_filter = [data.occasion.lower()]

    # --- Step 3: Parse budget ---
    budget_label = "Any Budget"
    price_min    = 0
    price_max    = 9999999

    if hasattr(data, "budget") and data.budget:
        range_tuple = BUDGET_RANGES.get(data.budget)
        if range_tuple:
            price_min, price_max = range_tuple
            budget_label = data.budget.replace("_", " ").title()

    # --- Step 4: Parse optional fields ---
    style  = getattr(data, "style", "")
    gender = getattr(data, "gender", "")

    # --- Step 5: Build semantic query text for Pinecone ---
    query_text = build_query_text(
        occasion  = occasions_filter[0] if occasions_filter else "",
        material  = data.jewelry_type,
        wear_type = data.wear_type,
        style     = style,
        gender    = gender
    )
    # Example query_text: "Gold necklace for wedding occasion elegant style for women"

    # --- Step 6: Search Pinecone for semantic matches ---
    try:
        pinecone_ids = search_pinecone(
            query_text = query_text,
            category   = category,
            materials  = [data.jewelry_type.lower()],
            occasions  = occasions_filter,
            wear_type  = data.wear_type.lower(),
            price_min  = price_min,
            price_max  = price_max,
            top_k      = 10
        )
    except Exception as e:
        pinecone_ids = []
        print(f"Pinecone search error: {e}")

    # --- Step 7: Fetch full product data from PostgreSQL ---
    # ---- Uncomment when Sunidhi's DB is ready ----
    #
    # products_list = []
    # if pinecone_ids and db:
    #     products = db.query(Product).filter(
    #         Product.id.in_(pinecone_ids)
    #     ).all()
    #
    #     # Preserve Pinecone ranking order
    #     id_order    = {pid: i for i, pid in enumerate(pinecone_ids)}
    #     products    = sorted(products, key=lambda p: id_order.get(str(p.id), 999))
    #
    #     products_list = [
    #         {
    #             "id":              p.id,
    #             "slug":            p.slug,
    #             "name":            p.name,
    #             "description":     p.description,
    #             "price":           p.price,
    #             "stock":           p.stock,
    #             "images":          p.images,
    #             "category":        p.category,
    #             "materials":       p.materials,
    #             "occasions":       p.occasions,
    #             "styleTags":       p.style_tags,
    #             "wearType":        p.wear_type,
    #             "relatedProducts": p.related_products,
    #             "completeLook":    p.complete_look,
    #             "featured":        p.featured
    #         }
    #         for p in products
    #     ]

    # ---- DUMMY PRODUCTS (remove when DB connected) ----
    products_list = _get_dummy_products(
        category     = category,
        material     = data.jewelry_type,
        price_min    = price_min,
        pinecone_ids = pinecone_ids
    )

    # --- Step 8: Return full recommendation ---
    return {
        "success": True,
        "message": "Jewelry recommendation generated successfully",
        "recommendation": {
            "occasion":            occasion_label,
            "occasions_filter":    occasions_filter,
            "jewelry_type":        data.jewelry_type,
            "wear_type":           data.wear_type,
            "category":            category,
            "budget":              budget_label,
            "price_range":         f"₹{price_min} - ₹{price_max}",
            "query_text":          query_text,
            "pinecone_ids_found":  len(pinecone_ids),
            "products":            products_list,
            "recommended_product": f"{data.jewelry_type} {category} for {occasion_label}"
        }
    }


# ======================================================
# DUMMY PRODUCTS HELPER
# Remove this entire function when DB is connected
# ======================================================

def _get_dummy_products(category, material, price_min, pinecone_ids):
    return [
        {
            "id":              pinecone_ids[0] if pinecone_ids else "prd_001",
            "slug":            f"{material.lower()}-{category}-classic",
            "name":            f"{material} {category.title()} - Classic",
            "description":     f"A beautiful {material.lower()} {category} perfect for special occasions.",
            "price":           price_min + 1000,
            "stock":           5,
            "images":          ["https://ik.imagekit.io/kohinoor/placeholder1.jpg"],
            "category":        category,
            "materials":       [material.lower()],
            "occasions":       ["wedding", "festive"],
            "styleTags":       ["elegant", "classic"],
            "wearType":        "neck",
            "relatedProducts": [],
            "completeLook":    [],
            "featured":        True
        },
        {
            "id":              pinecone_ids[1] if len(pinecone_ids) > 1 else "prd_002",
            "slug":            f"{material.lower()}-{category}-premium",
            "name":            f"{material} {category.title()} - Premium",
            "description":     f"Premium {material.lower()} {category} with intricate craftsmanship.",
            "price":           price_min + 3000,
            "stock":           3,
            "images":          ["https://ik.imagekit.io/kohinoor/placeholder2.jpg"],
            "category":        category,
            "materials":       [material.lower()],
            "occasions":       ["wedding", "anniversary"],
            "styleTags":       ["luxury", "premium"],
            "wearType":        "neck",
            "relatedProducts": [],
            "completeLook":    [],
            "featured":        False
        }
    ]