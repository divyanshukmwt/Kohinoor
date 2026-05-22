from fastapi import FastAPI

# ======================================================
# IMPORT AUTH ROUTER
# ======================================================

from app.auth.auth_routes import router as auth_router


# ======================================================
# IMPORT CHATBOT ROUTER
# ======================================================

from app.chatbot.chatbot_routes import router as chatbot_router


# ======================================================
# CREATE FASTAPI APP
# ======================================================

app = FastAPI()


# ======================================================
# HOME ROUTE
# ======================================================

# Default API route
@app.get("/")
def home():

    return {
        "message": "Kohinoor Website Backend Running"
    }


# ======================================================
# CONNECT AUTH ROUTES
# ======================================================

# Auth APIs:
# /signup
# /login
app.include_router(auth_router)


# ======================================================
# CONNECT CHATBOT ROUTES
# ======================================================

# Chatbot API:
# /chatbot/recommend
app.include_router(chatbot_router)