"""
Orders Service + Routes — Éclat Platform
"""

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database.connection import get_db
from app.database.models import Order, OrderItem, Cart, CartItem, Product

router = APIRouter(prefix="/orders", tags=["Orders"])


class OrderCreateRequest(BaseModel):
    customerName:    Optional[str] = None
    customerEmail:   Optional[str] = None
    shippingAddress: Optional[str] = None
    notes:           Optional[str] = None


def _require_session(x_session_id: Optional[str] = Header(None, alias="X-Session-ID")) -> str:
    if not x_session_id:
        raise HTTPException(status_code=400, detail="X-Session-ID header required")
    return x_session_id


@router.post("/")
def create_order(
    body: OrderCreateRequest,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    """Convert current cart into a confirmed order."""
    cart = db.query(Cart).filter(Cart.session_id == session_id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = 0
    order_items_data = []

    for ci in cart.items:
        if not ci.product:
            continue
        if ci.product.stock < ci.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"'{ci.product.name}' only has {ci.product.stock} in stock",
            )
        line_total = ci.product.price * ci.quantity
        subtotal  += line_total
        order_items_data.append({
            "product":    ci.product,
            "quantity":   ci.quantity,
            "unit_price": ci.product.price,
        })

    total = round(subtotal, 2)

    order = Order(
        session_id=       session_id,
        subtotal=         round(subtotal, 2),
        shipping=         0,
        total=            total,
        customer_name=    body.customerName,
        customer_email=   body.customerEmail,
        shipping_address= body.shippingAddress,
        notes=            body.notes,
    )
    db.add(order)
    db.flush()

    for d in order_items_data:
        oi = OrderItem(
            order_id=   order.id,
            product_id= d["product"].id,
            quantity=   d["quantity"],
            unit_price= d["unit_price"],
        )
        db.add(oi)
        d["product"].stock -= d["quantity"]

    # Clear the cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(order)

    return {"success": True, "order": order.to_dict()}


@router.get("/")
def get_orders(
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(Order.session_id == session_id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return {"success": True, "orders": [o.to_dict() for o in orders]}


@router.get("/{order_id}")
def get_order(
    order_id: str,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.session_id == session_id,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"success": True, "order": order.to_dict()}
