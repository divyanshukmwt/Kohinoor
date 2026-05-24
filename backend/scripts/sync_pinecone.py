"""
Pinecone Sync Utility — Éclat Platform
Re-index all products from PostgreSQL into Pinecone.
Run: python -m scripts.sync_pinecone
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import SessionLocal
from app.database.models import Product
from app.chatbot.pinecone_service import bulk_upsert_products, delete_product


def sync_all():
    print("🔄 Syncing all products to Pinecone...")
    db = SessionLocal()

    try:
        products = db.query(Product).all()
        if not products:
            print("No products found in database.")
            return

        product_dicts = [
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

        result = bulk_upsert_products(product_dicts)
        print(f"✅ {result['message']}")

    finally:
        db.close()


def sync_single(product_id: str):
    """Re-index a single product by ID."""
    from app.chatbot.pinecone_service import upsert_product

    db = SessionLocal()
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            print(f"Product '{product_id}' not found")
            return

        result = upsert_product({
            "id":            product.id,
            "embeddingText": product.embedding_text or product.name,
            "category":      product.category or "",
            "materials":     product.materials or [],
            "occasions":     product.occasions or [],
            "styleTags":     product.style_tags or [],
            "wearType":      product.wear_type or "",
            "gender":        product.gender or [],
            "price":         float(product.price),
            "featured":      bool(product.featured),
        })
        print(f"✅ {result['message']}")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        sync_single(sys.argv[1])
    else:
        sync_all()
