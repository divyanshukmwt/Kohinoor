# ======================================================
# AUTH SERVICE - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/auth/auth_service.py
# ======================================================

from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

# ======================================================
# PASSWORD HASHING SETUP
# ======================================================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ======================================================
# JWT CONFIG
# ======================================================

SECRET_KEY = "kohinoor_secret_key_change_this_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


# ======================================================
# HELPER FUNCTIONS
# ======================================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ======================================================
# SIGNUP USER
# ======================================================

def signup_user(data, db=None):

    # -----------------------------------------------
    # STEP 1: Check if email already exists in DB
    # UNCOMMENT WHEN DATABASE IS CONNECTED:
    # -----------------------------------------------
    #
    # existing_user = db["users"].find_one({"email": data.email})
    # if existing_user:
    #     return {
    #         "success": False,
    #         "message": "Email already registered"
    #     }

    # -----------------------------------------------
    # STEP 2: Hash the password
    # -----------------------------------------------
    hashed = hash_password(data.password)

    # -----------------------------------------------
    # STEP 3: Build user document for MongoDB
    # -----------------------------------------------
    new_user = {
        "username":   data.username,
        "email":      data.email,
        "password":   hashed,
        "created_at": datetime.utcnow().isoformat()
    }

    # -----------------------------------------------
    # STEP 4: Save to MongoDB
    # UNCOMMENT WHEN DATABASE IS CONNECTED:
    # -----------------------------------------------
    #
    # db["users"].insert_one(new_user)

    # -----------------------------------------------
    # STEP 5: Return success
    # -----------------------------------------------
    return {
        "success": True,
        "message": "User registered successfully",
        "user": {
            "username": new_user["username"],
            "email":    new_user["email"]
        }
    }


# ======================================================
# LOGIN USER
# ======================================================

def login_user(data, db=None):

    # -----------------------------------------------
    # STEP 1: Find user by email in DB
    # UNCOMMENT WHEN DATABASE IS CONNECTED:
    # -----------------------------------------------
    #
    # user = db["users"].find_one({"email": data.email})
    # if not user:
    #     return {
    #         "success": False,
    #         "message": "Email not found"
    #     }

    # -----------------------------------------------
    # STEP 2: Verify password
    # UNCOMMENT WHEN DATABASE IS CONNECTED:
    # -----------------------------------------------
    #
    # if not verify_password(data.password, user["password"]):
    #     return {
    #         "success": False,
    #         "message": "Incorrect password"
    #     }

    # -----------------------------------------------
    # STEP 3: Generate JWT token
    # UNCOMMENT WHEN DATABASE IS CONNECTED:
    # -----------------------------------------------
    #
    # token = create_access_token({
    #     "sub":      user["email"],
    #     "username": user["username"]
    # })

    # -----------------------------------------------
    # PLACEHOLDER (remove when DB connected)
    # -----------------------------------------------
    return {
        "success": True,
        "message": "Login successful",
        "token":   "placeholder_token_connect_db_to_get_real_jwt"
    }

    # -----------------------------------------------
    # REAL RESPONSE — uncomment when DB connected,
    # and delete the placeholder return above it
    # -----------------------------------------------
    #
    # return {
    #     "success": True,
    #     "message": "Login successful",
    #     "token":   token,
    #     "user": {
    #         "username": user["username"],
    #         "email":    user["email"]
    #     }
    # }