from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from . import product_service, product_schema

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=list[product_schema.ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    return product_service.get_products(db)


@router.get("/{id}", response_model=product_schema.ProductResponse)
def get_product(id: int, db: Session = Depends(get_db)):
    return product_service.get_product_by_id(db, id)


@router.get("/category/{category}", response_model=list[product_schema.ProductResponse])
def get_products_by_category(category: str, db: Session = Depends(get_db)):
    return product_service.get_products_by_category(db, category)