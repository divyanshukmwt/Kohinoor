"""
Cart Service — Éclat Platform
Session-based cart management via PostgreSQL.
"""

from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.database.models import Cart, CartItem, Product


def _get_or_create_cart(db: Session, session_id: str) -> Cart:
    cart = db.query(Cart).filter(Cart.session_id == session_id).first()
    if not cart:
        cart = Cart(session_id=session_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def get_cart(db: Session, session_id: str) -> dict:
    cart = db.query(Cart).filter(Cart.session_id == session_id).first()
    if not cart:
        return {"success": True, "cart": {"sessionId": session_id, "items": [], "subtotal": 0}}

    subtotal = sum(
        (item.product.price if item.product else 0) * item.quantity
        for item in cart.items
    )
    data = cart.to_dict()
    data["subtotal"] = round(subtotal, 2)
    return {"success": True, "cart": data}


def add_to_cart(db: Session, session_id: str, product_id: str, quantity: int = 1) -> dict:
    # Verify product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")

    if product.stock < quantity:
        raise HTTPException(status_code=400, detail=f"Only {product.stock} items in stock")

    cart = _get_or_create_cart(db, session_id)

    # Check if item already in cart
    existing = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id,
    ).first()

    if existing:
        new_qty = existing.quantity + quantity
        if product.stock < new_qty:
            raise HTTPException(status_code=400, detail=f"Cannot add {quantity} more — stock limit reached")
        existing.quantity = new_qty
    else:
        item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        db.add(item)

    db.commit()
    db.refresh(cart)
    return get_cart(db, session_id)


def update_cart_item(db: Session, session_id: str, item_id: str, quantity: int) -> dict:
    cart = db.query(Cart).filter(Cart.session_id == session_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if quantity <= 0:
        db.delete(item)
    else:
        if item.product and item.product.stock < quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        item.quantity = quantity

    db.commit()
    return get_cart(db, session_id)


def remove_from_cart(db: Session, session_id: str, item_id: str) -> dict:
    cart = db.query(Cart).filter(Cart.session_id == session_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(item)
    db.commit()
    return get_cart(db, session_id)


def clear_cart(db: Session, session_id: str) -> dict:
    cart = db.query(Cart).filter(Cart.session_id == session_id).first()
    if cart:
        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.commit()
    return {"success": True, "message": "Cart cleared"}
