from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db

router = APIRouter(prefix="/cart", tags=["Cart"])

cart_store = []

@router.post("/add")
def add_to_cart(user_id: int, product_id: int, quantity: int = 1, db: Session = Depends(get_db)):
    item = {"user_id": user_id, "product_id": product_id, "quantity": quantity}
    cart_store.append(item)
    return {"success": True, "message": "Item added to cart", "item": item}

@router.get("/{user_id}")
def get_user_cart(user_id: int, db: Session = Depends(get_db)):
    items = [i for i in cart_store if i["user_id"] == user_id]
    return {"success": True, "cart_items": items}

@router.put("/update")
def update_cart(user_id: int, product_id: int, quantity: int, db: Session = Depends(get_db)):
    for i in cart_store:
        if i["user_id"] == user_id and i["product_id"] == product_id:
            i["quantity"] = quantity
            return {"success": True, "message": "Cart item updated", "item": i}
    return {"success": False, "message": "Item not found"}

@router.delete("/remove/{product_id}")
def remove_item(user_id: int, product_id: int, db: Session = Depends(get_db)):
    global cart_store
    cart_store = [i for i in cart_store if not (i["user_id"] == user_id and i["product_id"] == product_id)]
    return {"success": True, "message": "Item removed from cart"}