# ======================================================
# CHATBOT ROUTES - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/chatbot/chatbot_routes.py
# ======================================================

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Any

from app.chatbot.chatbot_service import get_jewelry_recommendation
from app.chatbot.pinecone_service import upsert_product_to_pinecone, delete_product_from_pinecone
from app.chatbot.memory import (
    save_session, get_session,
    is_session_complete, clear_session
)
from app.chatbot.prompts import (
    QUESTIONS,
    SUCCESS_MESSAGE, NO_RESULT_MESSAGE
)

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


# ======================================================
# REQUEST MODELS
# ======================================================

class ChatbotRequest(BaseModel):
    occasion:     str
    gender:       Optional[str] = ""
    jewelry_type: str
    wear_type:    str
    style:        Optional[str] = ""
    budget:       Optional[str] = None


class StepRequest(BaseModel):
    session_id: str
    step:       str
    answer:     str


class IndexProductRequest(BaseModel):
    id:            str
    embeddingText: str
    category:      str
    materials:     List[str]
    occasions:     List[str]
    styleTags:     List[str]
    wearType:      str
    price:         float


# ======================================================
# GET /chatbot/start
# ======================================================

@router.get("/start")
def start_chatbot():
    return {
        "success":  True,
        "question": QUESTIONS["purpose"],
        "step":     "purpose"
    }


# ======================================================
# POST /chatbot/step
# Saves answer, returns next question
# ======================================================

@router.post("/step")
def chatbot_step(data: StepRequest):

    save_session(data.session_id, data.step, data.answer)

    step_order    = ["purpose", "gender", "jewelry_type", "wear_type", "style", "budget"]
    current_index = step_order.index(data.step) if data.step in step_order else -1

    if current_index + 1 < len(step_order):
        next_step = step_order[current_index + 1]
        return {
            "success":  True,
            "message":  "Answer saved",
            "question": QUESTIONS.get(next_step, ""),
            "step":     next_step
        }

    return {
        "success": True,
        "message": "All answers collected. Call /chatbot/recommend-from-session.",
        "step":    "complete"
    }


# ======================================================
# POST /chatbot/recommend
# Direct call with all data at once
# ======================================================

@router.post("/recommend")
def recommend_jewelry(data: ChatbotRequest):
    return get_jewelry_recommendation(data)


# ======================================================
# POST /chatbot/recommend-from-session
# Uses saved session answers
# ======================================================

@router.post("/recommend-from-session")
def recommend_from_session(session_id: str):

    if not is_session_complete(session_id):
        return {
            "success": False,
            "message": "Session incomplete. Please answer all questions first."
        }

    session = get_session(session_id)

    class SessionData:
        occasion     = session.get("purpose", "")
        jewelry_type = session.get("jewelry_type", "")
        wear_type    = session.get("wear_type", "")
        budget       = session.get("budget", None)
        style        = session.get("style", "")
        gender       = session.get("gender", "")

    result = get_jewelry_recommendation(SessionData())
    clear_session(session_id)
    return result


# ======================================================
# POST /chatbot/index-product
# Push product embedding into Pinecone
# ======================================================

@router.post("/index-product")
def index_product(data: IndexProductRequest):
    return upsert_product_to_pinecone(data.dict())


# ======================================================
# DELETE /chatbot/index-product/{product_id}
# Remove product from Pinecone
# ======================================================

@router.delete("/index-product/{product_id}")
def remove_product_index(product_id: str):
    return delete_product_from_pinecone(product_id)


# ======================================================
# GET /chatbot/flow
# Full question flow for frontend
# ======================================================

@router.get("/flow", response_model=dict)
def get_chatbot_flow():
    return {
        "success": True,
        "flow": [
            {
                "step": 1,
                "field": "purpose",
                "question": "What is the purpose?",
                "options": [
                    {"value": "function_event", "label": "Function / Event"},
                    {"value": "gifting",        "label": "Gifting"}
                ]
            },
            {
                "step": 2,
                "field": "gender",
                "question": "Who is it for?",
                "options": [
                    {"value": "women",  "label": "Women"},
                    {"value": "men",    "label": "Men"},
                    {"value": "kids",   "label": "Kids"},
                    {"value": "unisex", "label": "Unisex"}
                ]
            },
            {
                "step": 3,
                "field": "jewelry_type",
                "question": "What type of jewelry?",
                "options": [
                    {"value": "Gold",    "label": "Gold"},
                    {"value": "Silver",  "label": "Silver"},
                    {"value": "Diamond", "label": "Diamond"},
                    {"value": "Kundan",  "label": "Kundan"},
                    {"value": "Polki",   "label": "Polki"},
                    {"value": "Jadau",   "label": "Jadau"}
                ]
            },
            {
                "step": 4,
                "field": "wear_type",
                "question": "Which body part?",
                "options": [
                    {"value": "neck",       "label": "Neck"},
                    {"value": "hands",      "label": "Hands / Bangles"},
                    {"value": "ears",       "label": "Earrings"},
                    {"value": "rings",      "label": "Rings"},
                    {"value": "waistchain", "label": "Waist Chain"},
                    {"value": "foot",       "label": "Foot / Anklet"}
                ]
            },
            {
                "step": 5,
                "field": "style",
                "question": "What style are you looking for?",
                "options": [
                    {"value": "elegant",     "label": "Elegant"},
                    {"value": "traditional", "label": "Traditional"},
                    {"value": "modern",      "label": "Modern"},
                    {"value": "minimal",     "label": "Minimal"},
                    {"value": "bold",        "label": "Bold"}
                ]
            },
            {
                "step": 6,
                "field": "budget",
                "question": "What is your budget?",
                "options": [
                    {"value": "under_5k",  "label": "Under ₹5,000"},
                    {"value": "5k_20k",    "label": "₹5,000 - ₹20,000"},
                    {"value": "20k_50k",   "label": "₹20,000 - ₹50,000"},
                    {"value": "above_50k", "label": "Above ₹50,000"}
                ]
            }
        ]
    }
