# ======================================================
# PROMPTS - Kohinoor Jewelry Shop Chatbot
# FILE: Kohinoor/backend/app/chatbot/prompts.py
# ======================================================

SYSTEM_PROMPT = """
You are a helpful jewelry assistant for Kohinoor Jewelry Shop.
Your job is to help customers find the perfect jewelry based on:
- Occasion (Function/Event or Gifting)
- Jewelry type (Gold, Silver, Diamond, Kundan, Polki, Jadau)
- Body part (Neck, Hands, Ears, Rings, Waist, Foot)
- Budget (Under ₹5,000 to Above ₹50,000)

Always be polite, helpful, and suggest jewelry that fits the customer's needs.
If you don't have enough information, ask one question at a time.
Respond in a friendly, conversational tone.
"""

# ======================================================
# QUESTION FLOW
# ======================================================

QUESTIONS = {
    "purpose": "What is the purpose?\n1. Function / Event\n2. Gifting",
    "gender": "Who is it for?\n1. Women\n2. Men\n3. Kids\n4. Unisex",
    "jewelry_type": "What type of jewelry?\n1. Gold\n2. Silver\n3. Diamond\n4. Kundan\n5. Polki\n6. Jadau",
    "wear_type": "Which body part?\n1. Neck\n2. Hands / Bangles\n3. Earrings\n4. Rings\n5. Waist Chain\n6. Foot / Anklet",
    "style": "What style are you looking for?\n1. Elegant\n2. Traditional\n3. Modern\n4. Minimal\n5. Bold",
    "budget": "What is your budget?\n1. Under ₹5,000\n2. ₹5,000 - ₹20,000\n3. ₹20,000 - ₹50,000\n4. Above ₹50,000"
}

# ======================================================
# RESPONSE MESSAGES
# ======================================================

SUCCESS_MESSAGE = "Jewelry recommendation generated successfully"
NO_RESULT_MESSAGE = "Sorry, no matching jewelry found. Please try different options."

# ======================================================
# PROMPT BUILDER
# ======================================================

def build_prompt(history: list, user_message: str) -> list:
    messages = []
    for msg in history:
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    messages.append({
        "role": "user",
        "content": user_message
    })
    return messages
