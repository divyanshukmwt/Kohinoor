"""
Product Routes — Éclat Platform
Route order is critical: specific paths (/featured, /slug/{slug}, /batch)
must come BEFORE the wildcard /{product_id} to avoid shadowing.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel

from app.database.connection import get_db
from app.products import product_service

router = APIRouter(prefix="/products", tags=["Products"])


class ProductCreateRequest(BaseModel):
    slug:             str
    name:             str
    description:      Optional[str] = ""
    shortDescription: Optional[str] = ""
    price:            float
    originalPrice:    Optional[float] = None
    discount:         Optional[float] = None
    stock:            int = 0
    images:           List[str] = []
    category:         Optional[str] = None
    collection:       Optional[str] = None
    materials:        List[str] = []
    gemstones:        List[str] = []
    dimensions:       Optional[str] = None
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


class BatchRequest(BaseModel):
    ids: List[str]


# ── Specific paths first ─────────────────────────────────────────────────────

@router.get("/")
def get_all_products(
    category:     Optional[str]   = Query(None),
    wearType:     Optional[str]   = Query(None),
    gender:       Optional[str]   = Query(None),
    featured:     Optional[bool]  = Query(None),
    isNew:        Optional[bool]  = Query(None),
    isBestseller: Optional[bool]  = Query(None),
    minPrice:     Optional[float] = Query(None),
    maxPrice:     Optional[float] = Query(None),
    search:       Optional[str]   = Query(None),
    limit:        int = Query(50, ge=1, le=200),
    offset:       int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    products = product_service.get_products(
        db,
        category=      category,
        wear_type=     wearType,
        gender=        gender,
        featured=      featured,
        is_new=        isNew,
        is_bestseller= isBestseller,
        min_price=     minPrice,
        max_price=     maxPrice,
        search=        search,
        limit=         limit,
        offset=        offset,
    )
    return {"success": True, "products": [p.to_dict() for p in products], "count": len(products)}


@router.get("/featured")
def get_featured(limit: int = Query(6), db: Session = Depends(get_db)):
    products = product_service.get_featured_products(db, limit)
    return {"success": True, "products": [p.to_dict() for p in products]}


@router.post("/batch")
def get_products_by_ids(body: BatchRequest, db: Session = Depends(get_db)):
    """Fetch multiple products by ID array. Called after Pinecone search."""
    products = product_service.get_products_by_ids(db, body.ids)
    return [p.to_dict() for p in products]


@router.get("/slug/{slug}")
def get_by_slug(slug: str, db: Session = Depends(get_db)):
    product = product_service.get_product_by_slug(db, slug)
    return {"success": True, "product": product.to_dict()}


@router.post("/")
def create_product(body: ProductCreateRequest, db: Session = Depends(get_db)):
    product = product_service.create_product(db, body.dict())
    return {"success": True, "product": product.to_dict()}


# ── Wildcard last ─────────────────────────────────────────────────────────────

@router.get("/{product_id}")
def get_by_id(product_id: str, db: Session = Depends(get_db)):
    product = product_service.get_product_by_id(db, product_id)
    return {"success": True, "product": product.to_dict()}


@router.put("/{product_id}")
def update_product(product_id: str, body: dict, db: Session = Depends(get_db)):
    product = product_service.update_product(db, product_id, body)
    return {"success": True, "product": product.to_dict()}


@router.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db)):
    return product_service.delete_product(db, product_id)
