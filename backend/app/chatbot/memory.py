"""
Session Memory — Éclat Platform
In-process session store for multi-step chatbot flow.
Keys match the frontend FLOW_STEPS: purpose, gender, material, wearType, style, budget
"""

_sessions: dict = {}

REQUIRED_STEPS = ["purpose", "gender", "material", "wearType", "style", "budget"]


def save_session(session_id: str, step: str, answer: str) -> None:
    """Save an answer for a given session step."""
    if session_id not in _sessions:
        _sessions[session_id] = {}
    _sessions[session_id][step] = answer


def get_session(session_id: str) -> dict:
    """Retrieve all answers for a session."""
    return _sessions.get(session_id, {})


def is_session_complete(session_id: str) -> bool:
    """Check if all required steps have been answered."""
    session = _sessions.get(session_id, {})
    return all(step in session for step in REQUIRED_STEPS)


def clear_session(session_id: str) -> None:
    """Remove a session after recommendation is generated."""
    _sessions.pop(session_id, None)


def get_all_sessions() -> dict:
    """Debug utility: return all active sessions."""
    return dict(_sessions)
