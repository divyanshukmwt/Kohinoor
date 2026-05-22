from sqlalchemy import Column, String, Integer, Float, Boolean, Text
from sqlalchemy.dialects.postgresql import ARRAY as PG_ARRAY
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)
    slug = Column(String, unique=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    images = Column(PG_ARRAY(String))
    category = Column(String)
    collection = Column(String)
    materials = Column(PG_ARRAY(String))
    gemstones = Column(PG_ARRAY(String))
    gender = Column(PG_ARRAY(String))
    occasions = Column(PG_ARRAY(String))
    style_tags = Column(PG_ARRAY(String))
    wear_type = Column(String)
    embedding_text = Column(Text)
    related_products = Column(PG_ARRAY(String))
    complete_look = Column(PG_ARRAY(String))
    featured = Column(Boolean, default=False)