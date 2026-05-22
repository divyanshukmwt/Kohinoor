from sqlalchemy import Column, String, Integer, Float, Boolean, Text
from sqlalchemy.dialects.postgresql import ARRAY as PG_ARRAY
from sqlalchemy.ext.declarative import declarative_base

# ======================================================
# DATABASE MODELS - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/database/models.py
# PURPOSE: PostgreSQL tables ka structure define karna
# ======================================================

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    # --- Basic Info ---
    id = Column(String, primary_key=True)
    slug = Column(String, unique=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    short_description = Column(Text)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    discount = Column(Float, nullable=True)
    stock = Column(Integer, default=0)

    # --- Ratings ---
    rating = Column(Float, default=0)
    review_count = Column(Integer, default=0)

    # --- Media ---
    images = Column(PG_ARRAY(String))

    # --- Classification ---
    category = Column(String)
    collection = Column(String)
    materials = Column(PG_ARRAY(String))
    gemstones = Column(PG_ARRAY(String))
    dimensions = Column(String, nullable=True)

    # --- Targeting ---
    gender = Column(PG_ARRAY(String))
    occasions = Column(PG_ARRAY(String))
    style_tags = Column(PG_ARRAY(String))
    tags = Column(PG_ARRAY(String))
    wear_type = Column(String)

    # --- AI Embedding ---
    embedding_text = Column(Text)

    # --- Relations ---
    related_products = Column(PG_ARRAY(String))
    complete_look = Column(PG_ARRAY(String))

    # --- Flags ---
    featured = Column(Boolean, default=False)
    is_new = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)