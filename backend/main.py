"""
Entry point for uvicorn when running from the backend/ directory root.
All application logic is in app/main.py.

Usage:
    uvicorn main:app --reload --port 8000
  or
    uvicorn app.main:app --reload --port 8000
"""

from app.main import app  # re-export for convenience

__all__ = ["app"]
