from pydantic import BaseModel
from typing import Optional, List

# ======================================================
# SCHEMAS - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/database/schemas.py
# PURPOSE: API request/response ka format define karna
# ======================================================

class ProductBase(BaseModel):

    # --- Basic Info ---
    id: str
    slug: str
    name: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount: Optional[float] = None
    stock: int = 0

    # --- Ratings ---
    rating: Optional[float] = 0
    review_count: Optional[int] = 0

    # --- Media ---
    images: Optional[List[str]] = []

    # --- Classification ---
    category: Optional[str] = None
    collection: Optional[str] = None
    materials: Optional[List[str]] = []
    gemstones: Optional[List[str]] = []
    dimensions: Optional[str] = None

    # --- Targeting ---
    gender: Optional[List[str]] = []
    occasions: Optional[List[str]] = []
    style_tags: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    wear_type: Optional[str] = None

    # --- Relations ---
    related_products: Optional[List[str]] = []
    complete_look: Optional[List[str]] = []

    # --- Flags ---
    featured: Optional[bool] = False
    is_new: Optional[bool] = False
    is_bestseller: Optional[bool] = False

    class Config:
        from_attributes = True