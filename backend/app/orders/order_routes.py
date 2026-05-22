from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db

router = APIRouter(prefix="/orders", tags=["Orders"])

orders_store = []

@router.post("/")
def place_order(user_id: int, total: float, db: Session = Depends(get_db)):
    order = {"id": len(orders_store)+1, "user_id": user_id, "total": total, "status": "pending"}
    orders_store.append(order)
    return {"success": True, "order": order}

@router.get("/{user_id}")
def get_orders(user_id: int, db: Session = Depends(get_db)):
    return {"success": True, "orders": [o for o in orders_store if o["user_id"] == user_id]}
