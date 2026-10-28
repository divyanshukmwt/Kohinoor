"""
Gemini Service — Kohinoor / Éclat Platform
Supports dynamic API key and dynamic Gemini model selection per request.
Refines user questions and guided selections into structured retrieval filters
and concise concierge responses.
"""

import os
import json
import re
from typing import Optional, Dict, Any
from dotenv import load_dotenv
import httpx

load_dotenv()

AVAILABLE_GEMINI_MODELS = [
    {"id": "gemini-2.5-flash",      "label": "Gemini 2.5 Flash (Recommended · Fast)"},
    {"id": "gemini-2.5-pro",        "label": "Gemini 2.5 Pro (Deep Reasoning)"},
    {"id": "gemini-2.5-flash-lite", "label": "Gemini 2.5 Flash-Lite (Ultra Fast)"},
    {"id": "gemini-2.0-flash",      "label": "Gemini 2.0 Flash"},
    {"id": "gemini-1.5-flash",      "label": "Gemini 1.5 Flash"},
]

CONCIERGE_SYSTEM_PROMPT = """You are the Kohinoor AI Jewellery Stylist — a refined, helpful, and knowledgeable jewellery concierge.
Your style is warm, clear, minimal, and editorial. Keep responses concise (1 to 2 sentences, under 45 words).
You help customers find the right piece from our collection of Indian Heritage (Kundan, Polki, Oxidized Silver, Temple Gold) and Contemporary Luxury (18K Gold, Solitaire Diamonds, Rose Gold, Platinum, Anti-Tarnish Daily Wear) jewellery."""


def resolve_model(model: Optional[str] = None) -> str:
    load_dotenv(override=True)
    env_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
    if model and model.strip():
        return model.strip()
    return env_model or "gemini-2.5-flash"


def resolve_api_key(api_key: Optional[str] = None) -> str:
    load_dotenv(override=True)
    env_key = os.getenv("GEMINI_API_KEY", "").strip()
    if api_key and api_key.strip():
        return api_key.strip()
    return env_key


def _call_gemini_generate(
    prompt: str,
    api_key: str,
    model: str,
    temperature: float = 0.2,
    max_tokens: int = 2048,
    system_instruction: Optional[str] = None,
    json_mode: bool = False,
) -> Optional[str]:
    """Call Google Gemini REST API directly via httpx for universal model compatibility."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    gen_config: Dict[str, Any] = {
        "temperature": temperature,
        "maxOutputTokens": max_tokens,
    }
    if json_mode:
        gen_config["responseMimeType"] = "application/json"

    payload: Dict[str, Any] = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": gen_config,
    }
    if system_instruction:
        payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

    try:
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(url, params={"key": api_key}, json=payload)
            if resp.status_code == 404 and model != "gemini-2.5-flash":
                fallback_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
                resp = client.post(fallback_url, params={"key": api_key}, json=payload)
            if resp.status_code != 200:
                print(f"[Gemini API] HTTP {resp.status_code} for model '{model}'")
                return None
            data = resp.json()
            candidates = data.get("candidates") or []
            if not candidates:
                return None
            parts = candidates[0].get("content", {}).get("parts", [])
            return "".join(p.get("text", "") for p in parts if not p.get("thought")).strip()
    except Exception as e:
        print(f"[Gemini API] Request error ({model}): {e}")
        return None


# ─────────────────────────────────────────────
# QUESTION REFINEMENT & FILTER EXTRACTION
# ─────────────────────────────────────────────

def refine_question_and_extract_filters(
    selections: dict,
    user_query: str = "",
    api_key: Optional[str] = None,
    model: Optional[str] = None,
) -> dict:
    """
    Takes guided step selections and/or a free-text user question,
    refines the question, and extracts structured retrieval filters.
    Explicit guided selections are strictly preserved and never diluted.
    """
    effective_key = resolve_api_key(api_key)
    effective_model = resolve_model(model)

    # Compute deterministic baseline first so explicit selections are locked in
    local_result = _deterministic_refine(selections, user_query)

    if not effective_key:
        local_result["modelUsed"] = "local-knowledge-refiner"
        local_result["aiActive"] = False
        return local_result

    selection_summary = ", ".join(f"{k}: {v}" for k, v in (selections or {}).items() if v)
    prompt = f"""You are a jewellery search refiner for Kohinoor Jewellery.
Customer guided selections: {selection_summary or "None"}
Customer question / details: "{user_query or "None"}"

Available categories: NECKLACES, EARRINGS, RINGS, BRACELETS
Available wearTypes: neck, ears, rings, hands, foot
Available materials: gold, silver, oxidized silver, rose gold, platinum, diamond, emerald, ruby, pearl, kundan
Available occasions: wedding, festive, daily, party, gifting, anniversary
Available styles: heritage, traditional, minimal, bold, elegant, contemporary, boho
Available genders: female, male, unisex
Currency: Indian Rupees (₹ / INR). Note: under_2k = under ₹2,000; under_5k = under ₹5,000; 5k_20k = ₹5,000–₹20,000; above_20k = above ₹20,000.

Task:
1. Refine the customer's input into a clean 1-sentence search intent (`refinedQuestion`).
2. Write a brief, warm 1-2 sentence stylist reply (`conciergeMessage`) explaining what you are retrieving for them.
3. Extract accurate filter criteria matching the available values above. Do NOT add materials that the user did not ask for.

Return ONLY valid JSON with this exact structure:
{{
  "refinedQuestion": "Clear refined sentence describing the ideal jewellery piece",
  "conciergeMessage": "Warm 1-2 sentence concierge reply",
  "filters": {{
    "category": null,
    "wearType": null,
    "materials": [],
    "occasions": [],
    "styleTags": [],
    "gender": null,
    "minPrice": null,
    "maxPrice": null,
    "keywords": []
  }}
}}"""

    raw = _call_gemini_generate(
        prompt=prompt,
        api_key=effective_key,
        model=effective_model,
        temperature=0.2,
        max_tokens=2048,
        system_instruction=CONCIERGE_SYSTEM_PROMPT,
        json_mode=True,
    )

    if not raw:
        local_result["modelUsed"] = f"{effective_model} (fallback)"
        local_result["aiActive"] = False
        return local_result

    try:
        cleaned = re.sub(r"```json|```", "", raw).strip()
        parsed = json.loads(cleaned)
        ai_filters = parsed.get("filters") or {}
        merged_filters = _merge_filters(local_result["filters"], ai_filters, selections or {})
        return {
            "refinedQuestion": parsed.get("refinedQuestion") or local_result["refinedQuestion"],
            "conciergeMessage": parsed.get("conciergeMessage") or local_result["conciergeMessage"],
            "embeddingQuery": parsed.get("refinedQuestion") or local_result["refinedQuestion"],
            "filters": merged_filters,
            "modelUsed": effective_model,
            "aiActive": True,
        }
    except Exception as e:
        print(f"[Gemini] JSON parse fallback: {e}")
        local_result["modelUsed"] = f"{effective_model} (fallback)"
        local_result["aiActive"] = False
        return local_result


def _merge_filters(local_f: dict, ai_f: dict, explicit_selections: dict) -> dict:
    """
    Merge AI-extracted filters with deterministic filters.
    Explicit guided selections are NEVER overwritten or polluted by extra AI tags.
    """
    merged = dict(local_f)

    if not merged.get("category") and ai_f.get("category"):
        merged["category"] = str(ai_f["category"]).upper()
    if not merged.get("wearType") and ai_f.get("wearType"):
        merged["wearType"] = str(ai_f["wearType"]).lower()
    if not merged.get("gender") and ai_f.get("gender"):
        merged["gender"] = str(ai_f["gender"]).lower()

    # Only adopt AI-extracted materials/occasions/styles if the user did NOT already specify them in selections or deterministic text
    if not merged.get("materials") and ai_f.get("materials"):
        merged["materials"] = [str(m).lower() for m in ai_f["materials"] if m]
    if not merged.get("occasions") and ai_f.get("occasions"):
        merged["occasions"] = [str(o).lower() for o in ai_f["occasions"] if o]
    if not merged.get("styleTags") and ai_f.get("styleTags"):
        merged["styleTags"] = [str(s).lower() for s in ai_f["styleTags"] if s]

    # Combine keywords for tie-breaking
    kw = list(merged.get("keywords") or [])
    for item in (ai_f.get("keywords") or []):
        if item and str(item).lower() not in kw:
            kw.append(str(item).lower())
    merged["keywords"] = kw

    if not explicit_selections.get("budget"):
        if merged.get("minPrice") is None and ai_f.get("minPrice") is not None:
            merged["minPrice"] = ai_f["minPrice"]
        if merged.get("maxPrice") is None and ai_f.get("maxPrice") is not None:
            merged["maxPrice"] = ai_f["maxPrice"]

    return merged


def _deterministic_refine(selections: dict, user_query: str = "") -> dict:
    """
    Accurate rule-based parser for guided selections + natural language questions.
    """
    selections = selections or {}
    q_low = (user_query or "").lower()

    wear_map = {
        "neck": "NECKLACES",
        "necklace": "NECKLACES",
        "necklaces": "NECKLACES",
        "pendant": "NECKLACES",
        "choker": "NECKLACES",
        "chain": "NECKLACES",
        "hasli": "NECKLACES",
        "lariat": "NECKLACES",
        "ears": "EARRINGS",
        "ear": "EARRINGS",
        "earring": "EARRINGS",
        "earrings": "EARRINGS",
        "jhumka": "EARRINGS",
        "studs": "EARRINGS",
        "chandbali": "EARRINGS",
        "hoops": "EARRINGS",
        "huggies": "EARRINGS",
        "rings": "RINGS",
        "ring": "RINGS",
        "finger": "RINGS",
        "band": "RINGS",
        "signet": "RINGS",
        "hands": "BRACELETS",
        "wrist": "BRACELETS",
        "bracelet": "BRACELETS",
        "bracelets": "BRACELETS",
        "bangle": "BRACELETS",
        "kada": "BRACELETS",
        "foot": "BRACELETS",
        "anklet": "BRACELETS",
        "payal": "BRACELETS",
    }

    wear_raw = (selections.get("wearType") or selections.get("category") or "").strip().lower()
    category = wear_map.get(wear_raw)
    wear_type = wear_raw if wear_raw in ("neck", "ears", "rings", "hands", "foot") else None

    if not category and q_low:
        for token, mapped_cat in wear_map.items():
            if re.search(rf"\b{re.escape(token)}s?\b", q_low):
                category = mapped_cat
                if token in ("anklet", "payal", "foot"):
                    wear_type = "foot"
                elif token in ("bracelet", "bangle", "kada", "hands", "wrist"):
                    wear_type = "hands"
                elif token in ("ring", "rings", "band", "signet"):
                    wear_type = "rings"
                elif token in ("earring", "earrings", "jhumka", "studs", "chandbali", "hoops", "huggies"):
                    wear_type = "ears"
                elif token in ("necklace", "necklaces", "pendant", "choker", "chain", "hasli", "lariat"):
                    wear_type = "neck"
                break

    # Materials (avoid matching 'gold' inside 'rose gold')
    materials = []
    if selections.get("material"):
        materials.append(selections["material"].strip().lower())

    if q_low:
        q_mat_scan = q_low
        if "rose gold" in q_mat_scan:
            if "rose gold" not in materials:
                materials.append("rose gold")
            q_mat_scan = q_mat_scan.replace("rose gold", " ")
        if "oxidized silver" in q_mat_scan or "oxidised silver" in q_mat_scan:
            if "oxidized silver" not in materials:
                materials.append("oxidized silver")
            q_mat_scan = q_mat_scan.replace("oxidized silver", " ").replace("oxidised silver", " ")

        for mat in ["gold", "silver", "platinum", "diamond", "emerald", "ruby", "pearl", "kundan", "polki"]:
            if re.search(rf"\b{re.escape(mat)}\b", q_mat_scan) and mat not in materials:
                materials.append(mat)

    # Occasions
    occasions = []
    if selections.get("purpose"):
        occasions.append(selections["purpose"].strip().lower())
    occasion_aliases = {
        "wedding": "wedding", "bridal": "wedding", "bride": "wedding", "sangeet": "wedding",
        "festive": "festive", "festival": "festive", "diwali": "festive", "ethnic": "festive",
        "daily": "daily", "everyday": "daily", "office": "daily", "work": "daily",
        "party": "party", "evening": "party", "cocktail": "party",
        "gift": "gifting", "gifting": "gifting", "birthday": "gifting", "sister": "gifting", "wife": "gifting", "mother": "gifting",
        "anniversary": "anniversary", "engagement": "anniversary",
    }
    for word, occ in occasion_aliases.items():
        if re.search(rf"\b{re.escape(word)}\b", q_low) and occ not in occasions:
            occasions.append(occ)

    # Styles
    style_tags = []
    if selections.get("style"):
        style_tags.append(selections["style"].strip().lower())
    for st in ["minimal", "minimalist", "traditional", "heritage", "bold", "statement", "elegant", "contemporary", "modern", "boho"]:
        if re.search(rf"\b{re.escape(st)}\b", q_low):
            norm_st = "minimal" if st == "minimalist" else ("contemporary" if st == "modern" else st)
            if norm_st not in style_tags:
                style_tags.append(norm_st)

    # Gender
    gender = (selections.get("gender") or "").strip().lower() or None
    if not gender:
        if re.search(r"\b(men|mens|man|male|husband|brother|boyfriend)\b", q_low):
            gender = "male"
        elif re.search(r"\b(women|womens|woman|female|wife|sister|mother|girlfriend|bride)\b", q_low):
            gender = "female"

    # Budget
    BUDGET_MAP = {
        "under_2k":  (0, 2000),
        "under_5k":  (0, 5000),
        "5k_15k":    (5000, 15000),
        "5k_20k":    (5000, 20000),
        "15k_50k":   (15000, 50000),
        "20k_50k":   (20000, 50000),
        "above_20k": (20000, None),
        "above_50k": (50000, None),
        "luxury":    (20000, None),
    }
    min_price = None
    max_price = None
    budget_key = (selections.get("budget") or "").strip()
    if budget_key in BUDGET_MAP:
        min_price, max_price = BUDGET_MAP[budget_key]

    if q_low and max_price is None and min_price is None:
        m_under = re.search(r"(?:under|below|less than|within|budget|upto|up to)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)\s*(k)?", q_low)
        if m_under:
            val = float(m_under.group(1).replace(",", ""))
            if m_under.group(2) == "k":
                val *= 1000
            max_price = val
        m_above = re.search(r"(?:above|over|more than)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)\s*(k)?", q_low)
        if m_above:
            val = float(m_above.group(1).replace(",", ""))
            if m_above.group(2) == "k":
                val *= 1000
            min_price = val

    stop_words = {
        "i", "want", "need", "looking", "for", "a", "an", "the", "show", "me", "find",
        "some", "piece", "pieces", "jewellery", "jewelry", "under", "below", "above",
        "with", "in", "to", "wear", "on", "my", "please", "can", "you", "suggest", "recommend"
    }
    keywords = [
        w for w in re.findall(r"[a-z0-9]+", q_low)
        if len(w) > 2 and w not in stop_words and not w.isdigit()
    ]

    summary_parts = []
    if style_tags:
        summary_parts.append("/".join(style_tags).title())
    if materials:
        summary_parts.append("/".join(materials).title())
    if wear_type == "foot":
        summary_parts.append("Anklets")
    elif category:
        summary_parts.append(category.title())
    else:
        summary_parts.append("Jewellery")
    if occasions:
        summary_parts.append(f"for {', '.join(occasions).title()}")
    if gender and gender != "unisex":
        summary_parts.append(f"({gender.title()})")
    if min_price and max_price:
        summary_parts.append(f"within ₹{int(min_price):,}–₹{int(max_price):,}")
    elif max_price:
        summary_parts.append(f"under ₹{int(max_price):,}")
    elif min_price:
        summary_parts.append(f"above ₹{int(min_price):,}")

    refined_question = " ".join(summary_parts)
    if user_query and not selections:
        refined_question = f"{refined_question} — refined from \"{user_query.strip()}\""

    concierge_msg = (
        f"Here are our {', '.join(materials) if materials else 'curated'} "
        f"{'anklets' if wear_type == 'foot' else (category.lower() if category else 'pieces')} "
        f"matching your preferences and budget."
    )

    return {
        "refinedQuestion": refined_question,
        "conciergeMessage": concierge_msg,
        "embeddingQuery": refined_question,
        "filters": {
            "category": category,
            "wearType": wear_type,
            "materials": materials,
            "occasions": occasions,
            "styleTags": style_tags,
            "gender": gender,
            "minPrice": min_price,
            "maxPrice": max_price,
            "keywords": keywords,
        },
        "modelUsed": "local-knowledge-refiner",
        "aiActive": False,
    }


# ─────────────────────────────────────────────
# CONVERSATIONAL RESPONSE
# ─────────────────────────────────────────────

def generate_conversational_response(
    conversation_history: list,
    system_context: Optional[str] = None,
    api_key: Optional[str] = None,
    model: Optional[str] = None,
) -> dict:
    effective_key = resolve_api_key(api_key)
    effective_model = resolve_model(model)

    last_user = next(
        (m.get("content", "") for m in reversed(conversation_history or []) if m.get("role") == "user"),
        ""
    )

    if not effective_key:
        return {
            "message": _fallback_chat_response(last_user),
            "modelUsed": "local-knowledge-refiner",
            "aiActive": False,
        }

    transcript = "\n".join(
        f"{'Customer' if m.get('role') == 'user' else 'Concierge'}: {m.get('content', '')}"
        for m in (conversation_history or [])[-6:]
    )
    prompt = f"{transcript}\nConcierge:"

    reply = _call_gemini_generate(
        prompt=prompt,
        api_key=effective_key,
        model=effective_model,
        temperature=0.6,
        max_tokens=200,
        system_instruction=system_context or CONCIERGE_SYSTEM_PROMPT,
    )

    if reply:
        return {
            "message": reply,
            "modelUsed": effective_model,
            "aiActive": True,
        }

    return {
        "message": _fallback_chat_response(last_user),
        "modelUsed": f"{effective_model} (fallback)",
        "aiActive": False,
    }


def _fallback_chat_response(last_text: str) -> str:
    last = (last_text or "").lower()
    if "rose gold" in last:
        return "Our 18K rose gold pieces combine warm blush tones with anti-tarnish durability. Here are our matching pieces."
    if "gold" in last:
        return "Our 18K gold and heritage gold-toned pieces balance timeless warmth with anti-tarnish durability. Here are our top matches."
    if "silver" in last or "oxidized" in last or "jhumka" in last:
        return "Handcrafted 925 and oxidized silver is a signature of the Kohinoor Heritage Edit. Take a look at these pieces."
    if "diamond" in last or "solitaire" in last:
        return "From everyday solitaire pendants to certified platinum rings, here are our most luminous diamond creations."
    if "wedding" in last or "bridal" in last or "kundan" in last:
        return "For wedding and celebratory occasions, our Royal Atelier Kundan, Polki, and temple pieces offer heirloom presence."
    return "I have refined your preferences against the Kohinoor Knowledge Base. Explore the curated pieces below."
