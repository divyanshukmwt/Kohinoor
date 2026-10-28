"""
Chatbot Routes — Kohinoor / Éclat Platform
Guided + Conversational Question Refinement & Knowledge Base Retrieval (Pinecone-free).
Supports dynamic Gemini model and API key selection per request.
"""

from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.database.connection import get_db
from app.recommendation.recommendation_engine import run_recommendation_pipeline
from app.chatbot.gemini_service import (
    generate_conversational_response,
    AVAILABLE_GEMINI_MODELS,
    resolve_model,
    resolve_api_key,
)
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
    query:     Optional[str] = ""
    apiKey:    Optional[str] = None
    model:     Optional[str] = None
    topK:      Optional[int] = 6


class ConversationMessage(BaseModel):
    role:    str  # "user" | "assistant"
    content: str


class ConversationRequest(BaseModel):
    messages: List[ConversationMessage]
    context:  Optional[str] = None
    apiKey:   Optional[str] = None
    model:    Optional[str] = None


class SemanticSearchRequest(BaseModel):
    query:   str
    filters: Optional[dict] = {}
    topK:    Optional[int]  = 6
    apiKey:  Optional[str]  = None
    model:   Optional[str]  = None


class StepRequest(BaseModel):
    session_id: str
    step:       str
    answer:     str


# ─────────────────────────────────────────────
# DYNAMIC MODELS & CONFIG
# ─────────────────────────────────────────────

@router.get("/models")
def get_available_models():
    """Return active Gemini model configured in .env."""
    return {
        "success": True,
        "models": AVAILABLE_GEMINI_MODELS,
        "defaultModel": resolve_model(),
        "hasServerApiKey": bool(resolve_api_key()),
    }


# ─────────────────────────────────────────────
# RECOMMENDATION & RETRIEVAL PIPELINE
# ─────────────────────────────────────────────

@router.post("/recommend")
def recommend(
    body: RecommendRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    x_gemini_model: Optional[str] = Header(None, alias="X-Gemini-Model"),
    db: Session = Depends(get_db),
):
    """
    Main AI Stylist endpoint.
    Refines the user's guided selections and/or question using the chosen Gemini model,
    then filters and retrieves matching jewellery from the Knowledge Base.
    """
    selections = {
        "purpose":  body.purpose,
        "gender":   body.gender,
        "material": body.material,
        "wearType": body.wearType,
        "style":    body.style,
        "budget":   body.budget,
    }
    effective_key = body.apiKey or x_gemini_api_key
    effective_model = body.model or x_gemini_model

    return run_recommendation_pipeline(
        db=db,
        selections=selections,
        conversational_query=body.query or "",
        top_k=body.topK or 6,
        api_key=effective_key,
        model=effective_model,
    )


@router.post("/semantic-search")
def semantic_search_endpoint(
    body: SemanticSearchRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    x_gemini_model: Optional[str] = Header(None, alias="X-Gemini-Model"),
    db: Session = Depends(get_db),
):
    """Knowledge Base search endpoint (Pinecone-free)."""
    result = run_recommendation_pipeline(
        db=db,
        selections=body.filters or {},
        conversational_query=body.query or "",
        top_k=body.topK or 6,
        api_key=body.apiKey or x_gemini_api_key,
        model=body.model or x_gemini_model,
    )
    return {
        "success":         True,
        "productIds":      [p["id"] for p in result.get("products", [])],
        "products":        result.get("products", []),
        "refinedQuestion": result.get("refinedQuestion"),
        "modelUsed":       result.get("modelUsed"),
    }


# ─────────────────────────────────────────────
# CONVERSATIONAL AI
# ─────────────────────────────────────────────

@router.post("/conversation")
def conversation(
    body: ConversationRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    x_gemini_model: Optional[str] = Header(None, alias="X-Gemini-Model"),
):
    """Generate a concise concierge response using the chosen Gemini model."""
    history = [{"role": m.role, "content": m.content} for m in body.messages]
    result = generate_conversational_response(
        conversation_history=history,
        system_context=body.context,
        api_key=body.apiKey or x_gemini_api_key,
        model=body.model or x_gemini_model,
    )
    return {
        "success":   True,
        "message":   result["message"],
        "modelUsed": result["modelUsed"],
        "aiActive":  result["aiActive"],
    }


# ─────────────────────────────────────────────
# GUIDED FLOW DEFINITIONS (3 Essential Questions)
# ─────────────────────────────────────────────

STEP_ORDER = ["wearType", "material", "budget"]

FLOW_QUESTIONS = {
    "wearType": {
        "question": "What piece are you looking for?",
        "options": [
            {"value": "neck",  "label": "Necklaces & Pendants"},
            {"value": "ears",  "label": "Earrings & Jhumkas"},
            {"value": "rings", "label": "Rings & Bands"},
            {"value": "hands", "label": "Bracelets & Bangles"},
            {"value": "foot",  "label": "Anklets"},
        ],
    },
    "material": {
        "question": "Preferred metal or stone?",
        "options": [
            {"value": "gold",            "label": "Gold / 18K Vermeil"},
            {"value": "oxidized silver", "label": "Oxidized & 925 Silver"},
            {"value": "rose gold",       "label": "Rose Gold"},
            {"value": "diamond",         "label": "Diamond & Polki"},
            {"value": "pearl",           "label": "Pearl & Kundan"},
            {"value": "platinum",        "label": "Platinum"},
        ],
    },
    "budget": {
        "question": "What is your budget range?",
        "options": [
            {"value": "under_2k",  "label": "Under ₹2,000"},
            {"value": "under_5k",  "label": "Under ₹5,000"},
            {"value": "5k_20k",    "label": "₹5,000 – ₹20,000"},
            {"value": "above_20k", "label": "Above ₹20,000"},
        ],
    },
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
            "success": True,
            "step":    next_step,
            **FLOW_QUESTIONS[next_step],
        }

    return {"success": True, "step": "complete", "message": "All steps complete."}
