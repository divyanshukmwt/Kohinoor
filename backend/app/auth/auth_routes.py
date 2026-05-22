# ======================================================
# AUTH ROUTES - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/auth/auth_routes.py
# ======================================================

from fastapi import APIRouter, Header
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Auth"])


# ======================================================
# REQUEST MODELS
# ======================================================

class SignupRequest(BaseModel):
    username: str
    email:    str
    password: str

class LoginRequest(BaseModel):
    email:    str
    password: str


# ======================================================
# POST /auth/signup
# ======================================================

@router.post("/signup")
def signup(data: SignupRequest):
    # TODO: uncomment when Sunidhi's DB is ready
    # from app.auth.auth_service import signup_user
    # return signup_user(data, db)

    return {
        "success": True,
        "message": "User registered successfully (dummy - DB not connected yet)",
        "user": {
            "username": data.username,
            "email":    data.email
        }
    }


# ======================================================
# POST /auth/login
# ======================================================

@router.post("/login")
def login(data: LoginRequest):
    # TODO: uncomment when Sunidhi's DB is ready
    # from app.auth.auth_service import login_user
    # return login_user(data, db)

    return {
        "success": True,
        "message": "Login successful (dummy - DB not connected yet)",
        "token":   "placeholder_token_connect_db_to_get_real_jwt",
        "user": {
            "email": data.email
        }
    }


# ======================================================
# GET /auth/me
# Returns current logged in user info from token
# ======================================================

@router.get("/me")
def get_me(authorization: Optional[str] = Header(None)):
    # TODO: uncomment when DB + JWT is ready
    # token = authorization.replace("Bearer ", "")
    # from app.auth.jwt_handler import decode_token
    # user_data = decode_token(token)
    # fetch user from DB using user_data["user_id"]

    if not authorization:
        return {
            "success": False,
            "message": "No token provided. Send Authorization: Bearer <token> in header."
        }

    return {
        "success": True,
        "message": "User profile (dummy - DB not connected yet)",
        "user": {
            "id":       "user_001",
            "username": "anjali",
            "email":    "anjali@example.com",
            "role":     "customer"
        }
    }


# ======================================================
# POST /auth/logout
# ======================================================

@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    # TODO: implement token blacklist when DB is ready

    return {
        "success": True,
        "message": "Logged out successfully"
    }