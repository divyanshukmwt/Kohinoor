"""
Product Service — Éclat Platform
Full CRUD against PostgreSQL + semantic search support.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from fastapi import HTTPException

from app.database.models import Product


# ─────────────────────────────────────────────
# READ
# ─────────────────────────────────────────────

def get_products(
    db: Session,
    category:   Optional[str] = None,
    wear_type:  Optional[str] = None,
    gender:     Optional[str] = None,
    featured:   Optional[bool] = None,
    is_new:     Optional[bool] = None,
    is_bestseller: Optional[bool] = None,
    min_price:  Optional[float] = None,
    max_price:  Optional[float] = None,
    search:     Optional[str] = None,
    limit:      int = 50,
    offset:     int = 0,
) -> List[Product]:
    q = db.query(Product)

    if category:
        q = q.filter(Product.category == category)
    if wear_type:
        q = q.filter(Product.wear_type == wear_type)
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
    if gender:
        q = q.filter(Product.gender.any(gender))
    if search:
        term = f"%{search}%"
        q = q.filter(
            or_(
                Product.name.ilike(term),
                Product.description.ilike(term),
                Product.embedding_text.ilike(term),
            )
        )

    return q.order_by(Product.created_at.desc()).limit(limit).offset(offset).all()


def get_product_by_id(db: Session, product_id: str) -> Optional[Product]:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return product


def get_product_by_slug(db: Session, slug: str) -> Optional[Product]:
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with slug '{slug}' not found")
    return product


def get_products_by_ids(db: Session, ids: List[str]) -> List[Product]:
    """Fetch products by list of IDs, preserving order (used after Pinecone search)."""
    products = db.query(Product).filter(Product.id.in_(ids)).all()
    # Preserve ranking order from Pinecone
    id_order = {pid: i for i, pid in enumerate(ids)}
    return sorted(products, key=lambda p: id_order.get(p.id, 999))


def get_featured_products(db: Session, limit: int = 6) -> List[Product]:
    return db.query(Product).filter(Product.featured == True).limit(limit).all()


# ─────────────────────────────────────────────
# CREATE
# ─────────────────────────────────────────────

def create_product(db: Session, data: dict) -> Product:
    # Check slug uniqueness
    existing = db.query(Product).filter(Product.slug == data.get("slug")).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Slug '{data['slug']}' already exists")

    product = Product(
        slug=              data["slug"],
        name=              data["name"],
        description=       data.get("description", ""),
        short_description= data.get("shortDescription", ""),
        price=             data["price"],
        original_price=    data.get("originalPrice"),
        discount=          data.get("discount"),
        stock=             data.get("stock", 0),
        rating=            data.get("rating", 0.0),
        review_count=      data.get("reviewCount", 0),
        images=            data.get("images", []),
        category=          data.get("category"),
        collection=        data.get("collection"),
        materials=         data.get("materials", []),
        gemstones=         data.get("gemstones", []),
        dimensions=        data.get("dimensions"),
        gender=            data.get("gender", []),
        occasions=         data.get("occasions", []),
        style_tags=        data.get("styleTags", []),
        tags=              data.get("tags", []),
        wear_type=         data.get("wearType"),
        embedding_text=    data.get("embeddingText"),
        related_products=  data.get("relatedProducts", []),
        complete_look=     data.get("completeLook", []),
        featured=          data.get("featured", False),
        is_new=            data.get("isNew", False),
        is_bestseller=     data.get("isBestseller", False),
    )

    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# ─────────────────────────────────────────────
# UPDATE
# ─────────────────────────────────────────────

def update_product(db: Session, product_id: str, data: dict) -> Product:
    product = get_product_by_id(db, product_id)

    field_map = {
        "name":              "name",
        "description":       "description",
        "shortDescription":  "short_description",
        "price":             "price",
        "originalPrice":     "original_price",
        "discount":          "discount",
        "stock":             "stock",
        "images":            "images",
        "category":          "category",
        "collection":        "collection",
        "materials":         "materials",
        "gemstones":         "gemstones",
        "dimensions":        "dimensions",
        "gender":            "gender",
        "occasions":         "occasions",
        "styleTags":         "style_tags",
        "tags":              "tags",
        "wearType":          "wear_type",
        "embeddingText":     "embedding_text",
        "relatedProducts":   "related_products",
        "completeLook":      "complete_look",
        "featured":          "featured",
        "isNew":             "is_new",
        "isBestseller":      "is_bestseller",
    }

    for json_key, db_col in field_map.items():
        if json_key in data:
            setattr(product, db_col, data[json_key])

    db.commit()
    db.refresh(product)
    return product


# ─────────────────────────────────────────────
# DELETE
# ─────────────────────────────────────────────

def delete_product(db: Session, product_id: str) -> dict:
    product = get_product_by_id(db, product_id)
    db.delete(product)
    db.commit()
    return {"success": True, "message": f"Product '{product_id}' deleted"}
