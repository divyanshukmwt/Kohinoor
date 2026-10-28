"""
Kohinoor / Éclat Jewellery Platform — FastAPI Backend
Production-ready API server with automatic Knowledge Base seeding on startup.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import create_tables, SessionLocal
from app.products.product_service import ensure_seeded
from app.products.product_routes import router as product_router
from app.cart.cart_routes         import router as cart_router
from app.orders.order_routes      import router as order_router
from app.chatbot.chatbot_routes   import router as chatbot_router

# ── App ────────────────────────────────────────
app = FastAPI(
    title="Kohinoor Jewellery & AI Concierge API",
    description="AI-powered heritage & luxury jewellery commerce platform with local Knowledge Base retrieval",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ───────────────────────────────────────
DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
env_origins = [
    o.strip().rstrip("/")
    for o in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]
allow_all = "*" in env_origins
ALLOWED_ORIGINS = ["*"] if allow_all else list(dict.fromkeys(DEFAULT_ORIGINS + env_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=None if allow_all else r"https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app",
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup ────────────────────────────────────
@app.on_event("startup")
def on_startup():
    try:
        create_tables()
        db = SessionLocal()
        try:
            seeded = ensure_seeded(db, force_update=True)
            print(f"[OK] Kohinoor API ready - tables initialized ({seeded} items synced)")
        finally:
            db.close()
    except Exception as e:
        print(f"[WARN] Startup initialization warning: {e}")

# ── Routers ────────────────────────────────────
app.include_router(product_router,  prefix="/api")
app.include_router(cart_router,     prefix="/api")
app.include_router(order_router,    prefix="/api")
app.include_router(chatbot_router,  prefix="/api")


# ── Health ────────────────────────────────────
@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": "Kohinoor Jewellery & AI Concierge API",
        "version": "2.0.0",
        "knowledgeBase": "active",
    }

@app.get("/health")
def health():
    return {"status": "ok"}
