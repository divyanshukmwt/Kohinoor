"""
Pydantic Schemas — Éclat Platform
Request/response validation for endpoints that accept structured input.
Most read responses use ORM .to_dict() — these schemas are for WRITE operations.
"""

from pydantic import BaseModel
from typing import Optional, List


class ProductCreate(BaseModel):
    slug:             str
    name:             str
    description:      Optional[str] = ""
    shortDescription: Optional[str] = ""
    price:            float
    originalPrice:    Optional[float] = None
    stock:            int = 0
    images:           List[str] = []
    category:         Optional[str] = None
    collection:       Optional[str] = None
    materials:        List[str] = []
    gemstones:        List[str] = []
    gender:           List[str] = []
    occasions:        List[str] = []
    styleTags:        List[str] = []
    tags:             List[str] = []
    wearType:         Optional[str] = None
    embeddingText:    Optional[str] = None
    relatedProducts:  List[str] = []
    completeLook:     List[str] = []
    featured:         bool = False
    isNew:            bool = False
    isBestseller:     bool = False


class CartItemCreate(BaseModel):
    productId: str
    quantity:  int = 1


class OrderCreate(BaseModel):
    customerName:    Optional[str] = None
    customerEmail:   Optional[str] = None
    shippingAddress: Optional[str] = None
    notes:           Optional[str] = None
