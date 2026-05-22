from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# ======================================================
# SCHEMAS - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/database/schemas.py
# PURPOSE: API request/response ka format define karna
# ======================================================

class ProductBase(BaseModel):

    # --- Basic Info ---
    id: int                                # Product ID (int rakha hai DB ke liye easy hoga)
    slug: str                              # URL-friendly unique identifier
    name: str                              # Product ka naam
    description: Optional[str] = None      # Detailed description
    short_description: Optional[str] = None
    price: float                           # Current selling price
    original_price: Optional[float] = None # MRP ya original price
    discount: Optional[float] = None       # Discount percentage
    currency: str = "INR"                  # Currency support (default INR)
    stock: int = 0                         # Available stock
    in_stock: bool = True                  # Quick flag for availability

    # --- Ratings ---
    rating: Optional[float] = 0
    review_count: Optional[int] = 0

    # --- Media ---
    images: Optional[List[str]] = []       # Product images (URLs)
    videos: Optional[List[str]] = []       # Optional product videos

    # --- Classification ---
    category: Optional[str] = None         # e.g. Ring, Necklace
    collection: Optional[str] = None       # e.g. Men's Jewelry, Bridal
    materials: Optional[List[str]] = []    # e.g. Silver, Gold
    gemstones: Optional[List[str]] = []    # e.g. Diamond, Zircon
    dimensions: Optional[str] = None       # Size info (e.g. 7 inch)

    # --- Targeting ---
    gender: Optional[List[str]] = []       # e.g. Men, Women, Unisex
    occasions: Optional[List[str]] = []    # e.g. Wedding, Party
    style_tags: Optional[List[str]] = []   # e.g. Minimal, Trendy
    tags: Optional[List[str]] = []         # General tags
    wear_type: Optional[str] = None        # e.g. Wrist, Neck

    # --- Relations ---
    related_products: Optional[List[str]] = []
    complete_look: Optional[List[str]] = []

    # --- Flags ---
    featured: Optional[bool] = False
    is_new: Optional[bool] = False
    is_bestseller: Optional[bool] = False
    limited_edition: Optional[bool] = False

    # --- SEO / Marketing ---
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

    # --- Timestamps ---
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
