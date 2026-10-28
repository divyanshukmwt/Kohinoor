"""
Database Connection — Kohinoor / Éclat Platform
Supports local SQLite out-of-the-box (zero Docker required) with automatic fallback
if PostgreSQL is not running, plus optional PostgreSQL via DATABASE_URL.
"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_SQLITE_URL = f"sqlite:///{(BASE_DIR / 'kohinoor_store.db').as_posix()}"

USE_POSTGRES = os.getenv("USE_POSTGRES", "false").lower() == "true"
ENV_DB_URL = os.getenv("DATABASE_URL", "").strip()


def _build_engine():
    # Default to local SQLite store unless USE_POSTGRES=true is explicitly set
    if USE_POSTGRES and ENV_DB_URL and not ENV_DB_URL.startswith("sqlite"):
        try:
            from sqlalchemy import text
            pg_engine = create_engine(
                ENV_DB_URL,
                pool_pre_ping=True,
                connect_args={"connect_timeout": 2} if "postgresql" in ENV_DB_URL else {},
            )
            with pg_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("[OK] Connected to PostgreSQL database")
            return pg_engine
        except Exception as e:
            print(f"[INFO] PostgreSQL not reachable ({e}); using local SQLite store ({DEFAULT_SQLITE_URL})")

    sqlite_url = ENV_DB_URL if ENV_DB_URL.startswith("sqlite") else DEFAULT_SQLITE_URL
    print(f"[OK] Using local SQLite Knowledge Base store: {sqlite_url}")
    return create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False},
        echo=os.getenv("DB_ECHO", "false").lower() == "true",
    )


engine = _build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency: yields a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all ORM-defined tables (idempotent)."""
    from app.database.models import Base
    Base.metadata.create_all(bind=engine)
    print("[OK] Database tables ready")
