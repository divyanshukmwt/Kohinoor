"""
Product Service — Kohinoor / Éclat Platform
Full CRUD + Knowledge Base auto-seeding + cross-database (SQLite & PostgreSQL) filtering.
"""

import json
from pathlib import Path
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException

from app.database.models import Product

KB_PATH = Path(__file__).resolve().parent.parent / "data" / "jewellery_knowledge_base.json"


def load_knowledge_base() -> List[dict]:
    """Load the canonical Jewellery Knowledge Base JSON."""
    if not KB_PATH.exists():
        return []
    with open(KB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_seeded(db: Session, force_update: bool = False) -> int:
    """
    Ensure all products from jewellery_knowledge_base.json are seeded in the DB.
    Idempotent: inserts missing products or updates existing ones when force_update=True.
    """
    kb_items = load_knowledge_base()
    if not kb_items:
        return 0

    existing_by_slug = {p.slug: p for p in db.query(Product).all()}
    kb_slugs = {(item.get("slug") or item.get("id")) for item in kb_items}
    seeded_count = 0

    if force_update:
        for slug, prod in list(existing_by_slug.items()):
            if slug not in kb_slugs:
                db.delete(prod)
                del existing_by_slug[slug]

    for item in kb_items:
        slug = item.get("slug") or item.get("id")
        existing = existing_by_slug.get(slug)

        if existing and not force_update:
            continue

        if existing and force_update:
            _apply_product_fields(existing, item)
            seeded_count += 1
        else:
            product = Product(id=item.get("id") or slug, slug=slug, name=item["name"], price=item["price"])
            _apply_product_fields(product, item)
            db.add(product)
            seeded_count += 1

    if seeded_count > 0:
        db.commit()
    return seeded_count


def _apply_product_fields(product: Product, data: dict):
    product.slug              = data.get("slug") or data.get("id") or product.slug
    product.name              = data.get("name", product.name)
    product.description       = data.get("description", "")
    product.short_description = data.get("shortDescription", "")
    product.price             = float(data.get("price", 0))
    product.original_price    = float(data["originalPrice"]) if data.get("originalPrice") is not None else None
    product.discount          = data.get("discount")
    product.stock             = int(data.get("stock", 10))
    product.rating            = float(data.get("rating", 4.7))
    product.review_count      = int(data.get("reviewsCount") or data.get("reviewCount") or 0)
    product.tag               = data.get("tag")
    product.images            = data.get("images", [])
    product.category          = (data.get("category") or "NECKLACES").upper()
    product.collection        = data.get("collection")
    product.materials         = data.get("materials", [])
    product.material_details  = data.get("materialDetails") or data.get("materials", [])
    product.gemstones         = data.get("gemstones", [])
    product.dimensions        = data.get("dimensions")
    product.gender            = data.get("gender", ["female", "unisex"])
    product.occasions         = data.get("occasions", [])
    product.style_tags        = data.get("styleTags", [])
    product.tags              = data.get("tags", [])
    product.wear_type         = data.get("wearType")
    product.embedding_text    = data.get("embeddingText", "")
    product.care              = data.get("care")
    product.shipping          = data.get("shipping")
    product.reviews           = data.get("reviews", [])
    product.related_products  = data.get("relatedProducts", [])
    product.complete_look     = data.get("completeLook", [])
    product.featured          = bool(data.get("featured", False))
    product.is_new            = bool(data.get("isNew", False))
    product.is_bestseller     = bool(data.get("isBestseller", False))


# ─────────────────────────────────────────────
# READ
# ─────────────────────────────────────────────

CATEGORY_SYNONYMS = {
    "necklace": "NECKLACES",
    "necklaces": "NECKLACES",
    "pendant": "NECKLACES",
    "pendants": "NECKLACES",
    "neck": "NECKLACES",
    "earring": "EARRINGS",
    "earrings": "EARRINGS",
    "ears": "EARRINGS",
    "ear": "EARRINGS",
    "jhumka": "EARRINGS",
    "ring": "RINGS",
    "rings": "RINGS",
    "finger": "RINGS",
    "bracelet": "BRACELETS",
    "bracelets": "BRACELETS",
    "bangle": "BRACELETS",
    "bangles": "BRACELETS",
    "kada": "BRACELETS",
    "hands": "BRACELETS",
    "wrist": "BRACELETS",
    "anklet": "BRACELETS",
    "anklets": "BRACELETS",
    "foot": "BRACELETS",
}


def get_products(
    db: Session,
    category:      Optional[str] = None,
    wear_type:     Optional[str] = None,
    gender:        Optional[str] = None,
    featured:      Optional[bool] = None,
    is_new:        Optional[bool] = None,
    is_bestseller: Optional[bool] = None,
    min_price:     Optional[float] = None,
    max_price:     Optional[float] = None,
    search:        Optional[str] = None,
    limit:         int = 50,
    offset:        int = 0,
) -> List[Product]:
    q = db.query(Product)

    if category and category.upper() != "ALL":
        norm_cat = CATEGORY_SYNONYMS.get(category.strip().lower(), category.strip().upper())
        q = q.filter(Product.category.ilike(f"%{norm_cat}%"))
    if wear_type:
        q = q.filter(Product.wear_type.ilike(f"%{wear_type.strip()}%"))
    if featured is not None:
        q = q.filter(Product.featured == featured)
    if is_new is not None:
        q = q.filter(Product.is_new == is_new)
    if is_bestseller is not None:
        q = q.filter(Product.is_bestseller == is_bestseller)
    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)

    items = q.order_by(Product.featured.desc(), Product.rating.desc()).all()

    # Cross-DB JSON array filtering for gender & search
    if gender and gender.lower() != "unisex":
        g_low = gender.lower()
        items = [
            p for p in items
            if not p.gender or g_low in [x.lower() for x in (p.gender or [])] or "unisex" in [x.lower() for x in (p.gender or [])]
        ]

    if search:
        terms = [t.strip().lower() for t in search.split() if t.strip()]
        if terms:
            def _matches(p: Product) -> bool:
                haystack = " ".join([
                    p.name or "",
                    p.description or "",
                    p.short_description or "",
                    p.category or "",
                    p.tag or "",
                    p.collection or "",
                    p.embedding_text or "",
                    " ".join(p.materials or []),
                    " ".join(p.occasions or []),
                    " ".join(p.style_tags or []),
                    " ".join(p.tags or []),
                ]).lower()
                return any(t in haystack for t in terms)

            items = [p for p in items if _matches(p)]

    return items[offset: offset + limit]


def get_product_by_id(db: Session, product_id: str) -> Optional[Product]:
    product = db.query(Product).filter(or_(Product.id == product_id, Product.slug == product_id)).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return product


def get_product_by_slug(db: Session, slug: str) -> Optional[Product]:
    product = db.query(Product).filter(or_(Product.slug == slug, Product.id == slug)).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with slug '{slug}' not found")
    return product


def get_products_by_ids(db: Session, ids: List[str]) -> List[Product]:
    """Fetch products by list of IDs, preserving order."""
    if not ids:
        return []
    products = db.query(Product).filter(or_(Product.id.in_(ids), Product.slug.in_(ids))).all()
    id_order = {pid: i for i, pid in enumerate(ids)}
    return sorted(products, key=lambda p: id_order.get(p.id, id_order.get(p.slug, 999)))


def get_featured_products(db: Session, limit: int = 6) -> List[Product]:
    return db.query(Product).filter(Product.featured == True).limit(limit).all()


# ─────────────────────────────────────────────
# CREATE / UPDATE / DELETE
# ─────────────────────────────────────────────

def create_product(db: Session, data: dict) -> Product:
    slug = data.get("slug") or data.get("id")
    existing = db.query(Product).filter(or_(Product.slug == slug, Product.id == slug)).first()
    if existing:
        _apply_product_fields(existing, data)
        db.commit()
        db.refresh(existing)
        return existing

    product = Product(
        id=data.get("id") or slug,
        slug=slug,
        name=data["name"],
        price=float(data["price"]),
    )
    _apply_product_fields(product, data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: str, data: dict) -> Product:
    product = get_product_by_id(db, product_id)
    _apply_product_fields(product, {**product.to_dict(), **data})
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: str) -> dict:
    product = get_product_by_id(db, product_id)
    db.delete(product)
    db.commit()
    return {"success": True, "message": f"Product '{product_id}' deleted"}
