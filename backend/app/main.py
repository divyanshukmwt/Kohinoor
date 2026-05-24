"""
Éclat Jewellery Platform — FastAPI Backend
Production-ready API server with all routers registered.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import create_tables
from app.products.product_routes import router as product_router
from app.cart.cart_routes         import router as cart_router
from app.orders.order_routes      import router as order_router
from app.chatbot.chatbot_routes   import router as chatbot_router

# ── App ────────────────────────────────────────
app = FastAPI(
    title="Éclat Jewellery API",
    description="AI-powered luxury jewellery commerce platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ───────────────────────────────────────
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=     [o.strip() for o in ALLOWED_ORIGINS],
    allow_credentials= True,
    allow_methods=     ["*"],
    allow_headers=     ["*"],
)

# ── Startup ────────────────────────────────────
@app.on_event("startup")
def on_startup():
    try:
        create_tables()
        print("✅ Éclat API ready — tables initialized")
    except Exception as e:
        print(f"⚠️  DB init warning (tables may already exist): {e}")

# ── Routers ────────────────────────────────────
app.include_router(product_router,  prefix="/api")
app.include_router(cart_router,     prefix="/api")
app.include_router(order_router,    prefix="/api")
app.include_router(chatbot_router,  prefix="/api")

# Admin routes (optional — add X-Admin-Key header for protection)
try:
    from app.admin.admin_routes import router as admin_router
    app.include_router(admin_router, prefix="/api")
    print("✅ Admin routes registered")
except ImportError:
    pass  # Admin module not present — that's fine

# ── Health ────────────────────────────────────
@app.get("/")
def root():
    return {"status": "healthy", "service": "Éclat Jewellery API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}
