import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pathlib import Path

# ======================================================
# DATABASE CONNECTION - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/database/connection.py
# PURPOSE: PostgreSQL se connect karna aur session banana
# ======================================================

# .env file ka path dhundho — teen folders upar jaake
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

# DATABASE_URL .env file se lo
# Format: postgresql://username:password@localhost/database_name
DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy engine banao — yeh PostgreSQL se baat karta hai
engine = create_engine(DATABASE_URL)

# Session factory — har request ke liye ek session banega
SessionLocal = sessionmaker(bind=engine)

# ======================================================
# get_db()
# FastAPI dependency injection ke liye
# Har API route mein DB session deta hai
# ======================================================
def get_db():
    db = SessionLocal()
    try:
        yield db      # session do
    finally:
        db.close()    # kaam khatam hone ke baad band karo