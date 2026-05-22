# Import APIRouter for creating route groups
from fastapi import APIRouter, HTTPException

# BaseModel is used for request body validation
from pydantic import BaseModel

# Import authentication functions from auth_service.py
from .auth_service import signup_user, login_user


# ======================================================
# CREATE ROUTER OBJECT
# ======================================================

# APIRouter helps organize routes separately
router = APIRouter()


# ======================================================
# SIGNUP REQUEST SCHEMA
# ======================================================

# Defines data required during signup
class SignupRequest(BaseModel):

    username: str
    email: str
    password: str


# ======================================================
# LOGIN REQUEST SCHEMA
# ======================================================

# Defines data required during login
class LoginRequest(BaseModel):

    email: str
    password: str


# ======================================================
# SIGNUP ROUTE
# ======================================================

# API Endpoint:
# POST /signup
@router.post("/signup")
def signup(data: SignupRequest):

    # Call signup logic from auth_service.py
    result = signup_user(data)

    # If signup fails
    if result["success"] is False:

        raise HTTPException(
            status_code=400,
            detail=result["message"]
        )

    # Return success response
    return result


# ======================================================
# LOGIN ROUTE
# ======================================================

# API Endpoint:
# POST /login
@router.post("/login")
def login(data: LoginRequest):

    # Call login logic from auth_service.py
    result = login_user(data)

    # If login fails
    if result["success"] is False:

        raise HTTPException(
            status_code=401,
            detail=result["message"]
        )

    # Return success response
    return result