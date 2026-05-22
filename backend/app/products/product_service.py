from sqlalchemy.orm import Session
from app.products import product_schema

products_store = []

def get_products(db: Session):
    return products_store

def get_product_by_id(product_id: int, db: Session):
    return next((p for p in products_store if p["id"] == product_id), None)

def get_products_by_category(category: str, db: Session):
    return [p for p in products_store if p["category"] == category]

def create_product(product: product_schema.ProductCreate, db: Session):
    new_product = product.dict()
    new_product["id"] = len(products_store) + 1
    products_store.append(new_product)
    return new_product
