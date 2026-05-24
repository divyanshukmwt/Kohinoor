"""
Gemini Service — Éclat Platform
Handles semantic query extraction and conversational response generation
using Google's Gemini API. Falls back gracefully when API key is absent.
"""

import os
import json
import re
from typing import Optional

import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

ECLAT_PERSONA = """You are Éclat — a luxury AI jewellery concierge for an ultra-premium jewellery maison.

Your voice is:
- Calm, editorial, and poetic
- Deeply knowledgeable about jewellery craftsmanship, materials, gemstones, and styling
- Never salesy or pushy
- Speaks with restraint and elegance
- Uses short, beautiful sentences
- References emotion, heritage, and the permanence of fine jewellery

You help customers:
- Discover jewellery that matches their aesthetic and intent
- Understand materials (18k gold, platinum, rose gold, sterling silver)
- Navigate occasions (wedding, anniversary, gifting, daily wear, editorial)
- Find their personal jewellery style

When asked to generate recommendation queries, respond ONLY in valid JSON.
Keep conversational responses under 80 words. Be poetic, not verbose."""


def _get_client():
    """Lazy-initialize Gemini client."""
    if not GEMINI_API_KEY:
        return None
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-1.5-flash")


# ─────────────────────────────────────────────
# SEMANTIC QUERY EXTRACTION
# ─────────────────────────────────────────────

def extract_semantic_query(selections: dict, conversational_query: str = "") -> dict:
    """
    Given user flow selections + optional free-text, generate:
    - embeddingQuery: rich description for Pinecone vector search
    - filters: structured metadata filters
    """
    client = _get_client()
    if not client:
        return _fallback_semantic_query(selections, conversational_query)

    selection_text = ", ".join(
        f"{k}: {v}" for k, v in selections.items() if v
    )

    prompt = f"""Generate a semantic search query for a luxury jewellery recommendation engine.

Customer preferences: {selection_text}
{f'Customer request: "{conversational_query}"' if conversational_query else ''}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{{
  "embeddingQuery": "20-40 word descriptive text capturing aesthetic, material, occasion, style intent, and emotional quality",
  "filters": {{
    "materials": [],
    "occasions": [],
    "styleTags": [],
    "wearType": null,
    "gender": null,
    "minPrice": null,
    "maxPrice": null
  }}
}}"""

    try:
        response = client.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=512,
            )
        )
        raw = response.text.strip()
        # Strip markdown fences if present
        raw = re.sub(r"```json|```", "", raw).strip()
        return json.loads(raw)
    except Exception as e:
        print(f"[Gemini] Semantic query error: {e}")
        return _fallback_semantic_query(selections, conversational_query)


def _fallback_semantic_query(selections: dict, conversational_query: str = "") -> dict:
    """Deterministic fallback when Gemini is unavailable."""
    parts = []
    filters: dict = {}

    style    = selections.get("style") or ""
    material = selections.get("material") or ""
    wear     = selections.get("wearType") or selections.get("wear_type") or ""
    purpose  = selections.get("purpose") or selections.get("occasion") or ""
    gender   = selections.get("gender") or ""
    budget   = selections.get("budget") or ""

    if style:    parts.append(style)
    if material: parts.append(material)
    if wear:     parts.append(f"{wear} jewellery")
    if purpose:  parts.append(f"for {purpose}")
    if gender and gender != "unisex": parts.append(f"for {gender}")
    if conversational_query: parts.append(conversational_query)

    if material: filters["materials"] = [material.lower()]
    if wear:     filters["wearType"]  = wear.lower()
    if gender:   filters["gender"]    = gender.lower()
    if style:    filters["styleTags"] = [style.lower()]
    if purpose:  filters["occasions"] = [purpose.lower()]

    # Parse budget
    BUDGET_MAP = {
        "under_5k":  (0, 5000),
        "5k_20k":    (5000, 20000),
        "20k_50k":   (20000, 50000),
        "above_50k": (50000, None),
    }
    if budget in BUDGET_MAP:
        mn, mx = BUDGET_MAP[budget]
        if mn: filters["minPrice"] = mn
        if mx: filters["maxPrice"] = mx

    return {
        "embeddingQuery": " ".join(parts) or "luxury elegant fine jewellery",
        "filters": filters,
    }


# ─────────────────────────────────────────────
# CONVERSATIONAL RESPONSE
# ─────────────────────────────────────────────

def generate_conversational_response(
    conversation_history: list,
    system_context: Optional[str] = None
) -> str:
    """Generate an Éclat persona response for the chatbot."""
    client = _get_client()
    if not client:
        return _fallback_chat_response(conversation_history)

    system = system_context or ECLAT_PERSONA

    # Build chat with history
    chat = client.start_chat(history=[])
    try:
        # Inject persona + history
        messages = [{"role": "user", "parts": [system]}]
        messages.append({"role": "model", "parts": ["Understood. I am Éclat, your personal jewellery concierge."]})

        for msg in conversation_history[:-1]:
            role = "model" if msg["role"] == "assistant" else "user"
            messages.append({"role": role, "parts": [msg["content"]]})

        last_user = next(
            (m["content"] for m in reversed(conversation_history) if m["role"] == "user"),
            ""
        )

        response = client.generate_content(
            [{"role": m["role"], "parts": m["parts"]} for m in messages]
            + [{"role": "user", "parts": [last_user]}],
            generation_config=genai.types.GenerationConfig(
                temperature=0.85,
                max_output_tokens=512,
            )
        )
        return response.text.strip()
    except Exception as e:
        print(f"[Gemini] Chat error: {e}")
        return _fallback_chat_response(conversation_history)


def _fallback_chat_response(history: list) -> str:
    last = (history[-1]["content"] if history else "").lower()
    if "gold"    in last: return "Gold carries a warmth that endures across every era. Shall I show you pieces that honour that legacy?"
    if "diamond" in last: return "Diamonds hold light the way memory holds meaning — permanently. Let me curate something extraordinary."
    if "minimal" in last or "simple" in last: return "Restraint is its own form of luxury. I'll find pieces that whisper rather than shout."
    if "wedding" in last or "bridal" in last: return "Your most significant day deserves jewellery that will outlast it. Let me guide you."
    return "Every great jewellery discovery begins with a question. What draws you to explore today?"


# ─────────────────────────────────────────────
# EMBEDDING (for Pinecone upsert)
# Uses Gemini text-embedding-004 (768-dim)
# ─────────────────────────────────────────────

def generate_embedding(text: str) -> list:
    """Generate a 768-dimension text embedding via Gemini."""
    if not GEMINI_API_KEY:
        return _mock_embedding(text)

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document",
        )
        return result["embedding"]
    except Exception as e:
        print(f"[Gemini] Embedding error: {e}")
        return _mock_embedding(text)


def _mock_embedding(text: str) -> list:
    """Deterministic mock embedding for dev without API key."""
    import hashlib
    seed = int(hashlib.md5(text.encode()).hexdigest(), 16)
    import random
    rng = random.Random(seed)
    raw = [rng.gauss(0, 1) for _ in range(768)]
    norm = (sum(x**2 for x in raw) ** 0.5) or 1
    return [x / norm for x in raw]
