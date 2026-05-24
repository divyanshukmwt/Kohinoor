"""
Chatbot Service — Éclat Platform
Thin orchestration layer that delegates to the recommendation engine.
The recommendation_engine.py handles the full Gemini → Pinecone → PostgreSQL pipeline.
"""

from typing import Optional
from sqlalchemy.orm import Session

from app.recommendation.recommendation_engine import run_recommendation_pipeline


def get_recommendations(
    db:         Session,
    selections: dict,
    query:      str = "",
    top_k:      int = 6,
) -> dict:
    """
    Entry point for recommendation requests.
    Delegates to the full pipeline in recommendation_engine.py.
    """
    return run_recommendation_pipeline(
        db=                   db,
        selections=           selections,
        conversational_query= query,
        top_k=                top_k,
    )
