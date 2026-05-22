# ======================================================
# MEMORY - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/chatbot/memory.py
# ======================================================

_sessions = {}

def save_session(session_id: str, step: str, answer: str):
    """Save an answer for a given session."""
    if session_id not in _sessions:
        _sessions[session_id] = {}
    _sessions[session_id][step] = answer

def get_session(session_id: str) -> dict:
    """Retrieve all answers for a session."""
    return _sessions.get(session_id, {})

def is_session_complete(session_id: str) -> bool:
    """Check if all steps are answered."""
    required_steps = ["purpose", "gender", "jewelry_type", "wear_type", "style", "budget"]
    session = _sessions.get(session_id, {})
    return all(step in session for step in required_steps)

def clear_session(session_id: str):
    """Remove a session after recommendation is generated."""
    if session_id in _sessions:
        del _sessions[session_id]
