"""
Cart Routes — Éclat Platform
Session-based REST API. No auth required — sessions via X-Session-ID header.
"""

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database.connection import get_db
from app.cart import cart_service

router = APIRouter(prefix="/cart", tags=["Cart"])


class AddToCartRequest(BaseModel):
    productId: str
    quantity:  int = 1


class UpdateCartRequest(BaseModel):
    quantity: int


def _require_session(x_session_id: Optional[str] = Header(None, alias="X-Session-ID")) -> str:
    if not x_session_id:
        raise HTTPException(status_code=400, detail="X-Session-ID header required")
    return x_session_id


@router.get("/")
def get_cart(
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    return cart_service.get_cart(db, session_id)


@router.post("/")
def add_to_cart(
    body: AddToCartRequest,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    return cart_service.add_to_cart(db, session_id, body.productId, body.quantity)


@router.patch("/{item_id}")
def update_item(
    item_id: str,
    body: UpdateCartRequest,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    return cart_service.update_cart_item(db, session_id, item_id, body.quantity)


@router.delete("/{item_id}")
def remove_item(
    item_id: str,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    return cart_service.remove_from_cart(db, session_id, item_id)


@router.delete("/")
def clear_cart(
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    return cart_service.clear_cart(db, session_id)
