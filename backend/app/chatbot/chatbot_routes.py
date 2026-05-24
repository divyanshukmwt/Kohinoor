"""
Chatbot Routes — Éclat Platform
Recommendation pipeline, semantic search proxy, conversational AI.
"""

from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.database.connection import get_db
from app.recommendation.recommendation_engine import run_recommendation_pipeline
from app.chatbot.gemini_service import generate_conversational_response
from app.chatbot.pinecone_service import upsert_product, delete_product, bulk_upsert_products
from app.chatbot.memory import save_session, get_session, is_session_complete, clear_session

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


# ─────────────────────────────────────────────
# REQUEST MODELS
# ─────────────────────────────────────────────

class RecommendRequest(BaseModel):
    purpose:   Optional[str] = ""
    gender:    Optional[str] = ""
    material:  Optional[str] = ""
    wearType:  Optional[str] = ""
    style:     Optional[str] = ""
    budget:    Optional[str] = None
    query:     Optional[str] = ""  # Optional free-text refinement

class ConversationMessage(BaseModel):
    role:    str  # "user" | "assistant"
    content: str

class ConversationRequest(BaseModel):
    messages: List[ConversationMessage]
    context:  Optional[str] = None

class SemanticSearchRequest(BaseModel):
    query:   str
    filters: Optional[dict] = {}
    topK:    Optional[int]  = 6

class IndexProductRequest(BaseModel):
    id:            str
    embeddingText: str
    category:      str
    materials:     List[str] = []
    occasions:     List[str] = []
    styleTags:     List[str] = []
    wearType:      str = ""
    gender:        List[str] = []
    price:         float = 0
    featured:      bool = False

class BulkIndexRequest(BaseModel):
    products: List[dict]

class StepRequest(BaseModel):
    session_id: str
    step:       str
    answer:     str


# ─────────────────────────────────────────────
# RECOMMENDATION PIPELINE
# ─────────────────────────────────────────────

@router.post("/recommend")
def recommend(body: RecommendRequest, db: Session = Depends(get_db)):
    """
    Main recommendation endpoint.
    Flow: Gemini → Pinecone → PostgreSQL
    """
    selections = {
        "purpose":  body.purpose,
        "gender":   body.gender,
        "material": body.material,
        "wearType": body.wearType,
        "style":    body.style,
        "budget":   body.budget,
    }
    return run_recommendation_pipeline(db, selections, body.query or "")


@router.post("/semantic-search")
def semantic_search_endpoint(body: SemanticSearchRequest, db: Session = Depends(get_db)):
    """
    Raw semantic search endpoint.
    Called from frontend Next.js API route to keep Pinecone key server-side.
    Returns product IDs from Pinecone + hydrated products from PostgreSQL.
    """
    from app.chatbot.pinecone_service import semantic_search
    from app.products.product_service import get_products_by_ids

    filters = body.filters or {}
    product_ids = semantic_search(
        query_text= body.query,
        materials=  filters.get("materials"),
        occasions=  filters.get("occasions"),
        style_tags= filters.get("styleTags"),
        wear_type=  filters.get("wearType"),
        gender=     filters.get("gender"),
        min_price=  filters.get("minPrice"),
        max_price=  filters.get("maxPrice"),
        top_k=      body.topK or 6,
    )

    products = get_products_by_ids(db, product_ids) if product_ids else []

    return {
        "success":    True,
        "productIds": product_ids,
        "products":   [p.to_dict() for p in products],
    }


# ─────────────────────────────────────────────
# CONVERSATIONAL AI
# ─────────────────────────────────────────────

@router.post("/conversation")
def conversation(body: ConversationRequest):
    """Generate an Éclat persona response from conversation history."""
    history = [{"role": m.role, "content": m.content} for m in body.messages]
    response = generate_conversational_response(history, body.context)
    return {"success": True, "message": response}


# ─────────────────────────────────────────────
# FLOW (step-by-step session)
# ─────────────────────────────────────────────

STEP_ORDER = ["purpose", "gender", "material", "wearType", "style", "budget"]

FLOW_QUESTIONS = {
    "purpose":  {"question": "What is the occasion?", "options": [
        {"value": "wedding", "label": "Wedding"},
        {"value": "anniversary", "label": "Anniversary"},
        {"value": "gifting", "label": "Gifting"},
        {"value": "party", "label": "Party"},
        {"value": "daily", "label": "Daily Wear"},
    ]},
    "gender":   {"question": "Who is it for?", "options": [
        {"value": "female", "label": "Women"},
        {"value": "male",   "label": "Men"},
        {"value": "unisex", "label": "Unisex"},
    ]},
    "material": {"question": "What material?", "options": [
        {"value": "gold",     "label": "Gold"},
        {"value": "silver",   "label": "Silver"},
        {"value": "platinum", "label": "Platinum"},
        {"value": "diamond",  "label": "Diamond"},
        {"value": "rose gold","label": "Rose Gold"},
    ]},
    "wearType": {"question": "What type of piece?", "options": [
        {"value": "neck",  "label": "Necklace"},
        {"value": "ears",  "label": "Earrings"},
        {"value": "rings", "label": "Ring"},
        {"value": "hands", "label": "Bracelet"},
        {"value": "foot",  "label": "Anklet"},
    ]},
    "style":    {"question": "What aesthetic?", "options": [
        {"value": "elegant",      "label": "Elegant"},
        {"value": "minimal",      "label": "Minimal"},
        {"value": "bold",         "label": "Bold"},
        {"value": "traditional",  "label": "Traditional"},
        {"value": "contemporary", "label": "Contemporary"},
    ]},
    "budget":   {"question": "What is your budget?", "options": [
        {"value": "under_5k",  "label": "Under ₹5,000"},
        {"value": "5k_20k",    "label": "₹5,000 – ₹20,000"},
        {"value": "20k_50k",   "label": "₹20,000 – ₹50,000"},
        {"value": "above_50k", "label": "Above ₹50,000"},
    ]},
}


@router.get("/flow")
def get_flow():
    return {
        "success": True,
        "steps": [
            {"step": i + 1, "field": step, **FLOW_QUESTIONS[step]}
            for i, step in enumerate(STEP_ORDER)
        ],
    }


@router.post("/step")
def chatbot_step(data: StepRequest):
    save_session(data.session_id, data.step, data.answer)
    current_index = STEP_ORDER.index(data.step) if data.step in STEP_ORDER else -1
    next_index = current_index + 1

    if next_index < len(STEP_ORDER):
        next_step = STEP_ORDER[next_index]
        return {
            "success":  True,
            "step":     next_step,
            **FLOW_QUESTIONS[next_step],
        }

    return {"success": True, "step": "complete", "message": "All steps complete. Call /chatbot/recommend-from-session."}


@router.post("/recommend-from-session")
def recommend_from_session(session_id: str, db: Session = Depends(get_db)):
    if not is_session_complete(session_id):
        return {"success": False, "message": "Session incomplete"}
    session = get_session(session_id)
    result  = run_recommendation_pipeline(db, session)
    clear_session(session_id)
    return result


# ─────────────────────────────────────────────
# PINECONE INDEX MANAGEMENT
# ─────────────────────────────────────────────

@router.post("/index-product")
def index_product(body: IndexProductRequest):
    return upsert_product(body.dict())


@router.post("/index-products-bulk")
def index_products_bulk(body: BulkIndexRequest):
    return bulk_upsert_products(body.products)


@router.delete("/index-product/{product_id}")
def remove_product_index(product_id: str):
    return delete_product(product_id)
