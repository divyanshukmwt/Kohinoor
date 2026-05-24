"""
Database Connection — Éclat Platform
SQLAlchemy engine, session factory, and dependency injection.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://eclat_user:eclat_pass@localhost:5432/eclat_db"
)

engine = create_engine(
    DATABASE_URL,
    poolclass=    QueuePool,
    pool_size=    10,
    max_overflow= 20,
    pool_pre_ping=True,
    pool_recycle= 3600,
    echo=         os.getenv("DB_ECHO", "false").lower() == "true",
)

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
    print("✅ Database tables ready")
