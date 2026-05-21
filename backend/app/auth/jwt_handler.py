# ======================================================
# MAIN APP - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/main.py
# ======================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.chatbot.chatbot_routes import router as chatbot_router
from app.auth.auth_routes import router as auth_router

# ======================================================
# FASTAPI APP INIT
# ======================================================

app = FastAPI(
    title="Kohinoor Jewelry Shop API",
    description="Backend API for Kohinoor Jewelry Shop chatbot and authentication",
    version="1.0.0"
)

# ======================================================
# CORS CONFIG
# ======================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# ROUTERS
# ======================================================

app.include_router(chatbot_router)
app.include_router(auth_router)

# ======================================================
# ROOT ENDPOINT
# ======================================================

@app.get("/")
def root():
    return {
        "success": True,
        "message": "Kohinoor Jewelry Shop API is running"
    }
