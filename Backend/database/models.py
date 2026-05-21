# backend/database/models.py

from sqlalchemy import Column, String, Integer, Float, Boolean, ARRAY, Text
from sqlalchemy.dialects.postgresql import ARRAY as PG_ARRAY
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)        # e.g. "prd_101"
    slug = Column(String, unique=True)           # e.g. "gold-diamond-necklace"

    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)

    images = Column(PG_ARRAY(String))            # ImageKit URLs list

    category = Column(String)                    # ring, necklace, etc.
    collection = Column(String)                  # bridal, everyday, etc.

    materials = Column(PG_ARRAY(String))         # ["gold", "diamond"]
    gemstones = Column(PG_ARRAY(String))         # ["ruby", "emerald"]

    gender = Column(PG_ARRAY(String))            # ["women", "unisex"]
    occasions = Column(PG_ARRAY(String))         # ["wedding", "party"]
    style_tags = Column(PG_ARRAY(String))        # ["elegant", "luxury"]
    wear_type = Column(String)                   # neck, finger, wrist

    embedding_text = Column(Text)                # text used for Pinecone embedding

    related_products = Column(PG_ARRAY(String))  # list of product IDs
    complete_look = Column(PG_ARRAY(String))     # list of product IDs

    featured = Column(Boolean, default=False)