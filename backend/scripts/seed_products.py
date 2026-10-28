"""
Seed Script — Kohinoor / Éclat Platform
Seeds the Jewellery Knowledge Base into SQLite/PostgreSQL (No Pinecone required).
Run: python -m scripts.seed_products
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import SessionLocal, create_tables
from app.products.product_service import ensure_seeded, load_knowledge_base


def seed():
    print("[INFO] Initialising tables and seeding Jewellery Knowledge Base...")
    create_tables()
    db = SessionLocal()
    try:
        kb = load_knowledge_base()
        count = ensure_seeded(db, force_update=True)
        print(f"[OK] Successfully seeded/updated {count} products from Jewellery Knowledge Base ({len(kb)} total items).")
    finally:
        db.close()


if __name__ == "__main__":
    seed()