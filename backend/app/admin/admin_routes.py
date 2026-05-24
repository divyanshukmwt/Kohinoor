"""
Admin Routes — Éclat Platform
Protected routes for product management and Pinecone sync.
Requires X-Admin-Key header matching ADMIN_API_KEY env var.
"""

import os
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.database.connection import get_db
from app.database.models import Product, Cart, CartItem, Order
from app.chatbot.pinecone_service import upsert_product, bulk_upsert_products, delete_product as pinecone_delete

router = APIRouter(prefix="/admin", tags=["Admin"])

ADMIN_KEY = os.getenv("ADMIN_API_KEY", "eclat-dev-key")


def _verify(x_admin_key: Optional[str] = Header(None, alias="X-Admin-Key")):
    if x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin key")


@router.post("/sync-pinecone", dependencies=[Depends(_verify)])
def sync_all(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    dicts = [
        {
            "id":            p.id,
            "embeddingText": p.embedding_text or p.name,
            "category":      p.category or "",
            "materials":     p.materials or [],
            "occasions":     p.occasions or [],
            "styleTags":     p.style_tags or [],
            "wearType":      p.wear_type or "",
            "gender":        p.gender or [],
            "price":         float(p.price),
            "featured":      bool(p.featured),
        }
        for p in products
    ]
    result = bulk_upsert_products(dicts)
    return {**result, "productsIndexed": len(dicts)}


@router.post("/sync-pinecone/{product_id}", dependencies=[Depends(_verify)])
def sync_one(product_id: str, db: Session = Depends(get_db)):
    from app.products.product_service import get_product_by_id
    p = get_product_by_id(db, product_id)
    return upsert_product({
        "id":            p.id,
        "embeddingText": p.embedding_text or p.name,
        "category":      p.category or "",
        "materials":     p.materials or [],
        "occasions":     p.occasions or [],
        "styleTags":     p.style_tags or [],
        "wearType":      p.wear_type or "",
        "gender":        p.gender or [],
        "price":         float(p.price),
        "featured":      bool(p.featured),
    })


@router.delete("/sync-pinecone/{product_id}", dependencies=[Depends(_verify)])
def remove_from_index(product_id: str):
    return pinecone_delete(product_id)


@router.get("/stats", dependencies=[Depends(_verify)])
def stats(db: Session = Depends(get_db)):
    return {
        "success": True,
        "stats": {
            "products": {
                "total":    db.query(func.count(Product.id)).scalar(),
                "inStock":  db.query(func.count(Product.id)).filter(Product.stock > 0).scalar(),
                "featured": db.query(func.count(Product.id)).filter(Product.featured == True).scalar(),
            },
            "orders":     {"total": db.query(func.count(Order.id)).scalar()},
            "activeCarts":db.query(func.count(Cart.id)).scalar(),
        },
    }
