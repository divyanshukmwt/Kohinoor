"""
Database Models — Éclat Jewellery Platform
All SQLAlchemy ORM models for PostgreSQL.
"""

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text,
    DateTime, ForeignKey, Enum
)
from sqlalchemy.dialects.postgresql import ARRAY as PG_ARRAY, UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

Base = declarative_base()


# ─────────────────────────────────────────────
# PRODUCT
# ─────────────────────────────────────────────

class Product(Base):
    __tablename__ = "products"

    # Identity
    id              = Column(String, primary_key=True, default=lambda: f"prd_{uuid.uuid4().hex[:8]}")
    slug            = Column(String, unique=True, nullable=False, index=True)
    name            = Column(String, nullable=False)
    description     = Column(Text)
    short_description = Column(Text)

    # Pricing
    price           = Column(Float, nullable=False)
    original_price  = Column(Float, nullable=True)
    discount        = Column(Float, nullable=True)
    stock           = Column(Integer, default=0)

    # Ratings
    rating          = Column(Float, default=0.0)
    review_count    = Column(Integer, default=0)

    # Media (ImageKit CDN URLs)
    images          = Column(PG_ARRAY(String), default=[])

    # Classification
    category        = Column(String, index=True)
    collection      = Column(String, nullable=True)
    materials       = Column(PG_ARRAY(String), default=[])
    gemstones       = Column(PG_ARRAY(String), default=[])
    dimensions      = Column(String, nullable=True)

    # Targeting
    gender          = Column(PG_ARRAY(String), default=[])
    occasions       = Column(PG_ARRAY(String), default=[])
    style_tags      = Column(PG_ARRAY(String), default=[])
    tags            = Column(PG_ARRAY(String), default=[])
    wear_type       = Column(String, nullable=True, index=True)

    # AI / Semantic
    embedding_text  = Column(Text)  # Rich text used to generate Pinecone embedding

    # Relations
    related_products = Column(PG_ARRAY(String), default=[])
    complete_look    = Column(PG_ARRAY(String), default=[])

    # Flags
    featured        = Column(Boolean, default=False)
    is_new          = Column(Boolean, default=False)
    is_bestseller   = Column(Boolean, default=False)

    # Timestamps
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    cart_items      = relationship("CartItem", back_populates="product")
    order_items     = relationship("OrderItem", back_populates="product")

    def to_dict(self):
        return {
            "id":                self.id,
            "slug":              self.slug,
            "name":              self.name,
            "description":       self.description,
            "shortDescription":  self.short_description,
            "price":             self.price,
            "originalPrice":     self.original_price,
            "discount":          self.discount,
            "stock":             self.stock,
            "rating":            self.rating,
            "reviewCount":       self.review_count,
            "images":            self.images or [],
            "category":          self.category,
            "collection":        self.collection,
            "materials":         self.materials or [],
            "gemstones":         self.gemstones or [],
            "dimensions":        self.dimensions,
            "gender":            self.gender or [],
            "occasions":         self.occasions or [],
            "styleTags":         self.style_tags or [],
            "tags":              self.tags or [],
            "wearType":          self.wear_type,
            "embeddingText":     self.embedding_text,
            "relatedProducts":   self.related_products or [],
            "completeLook":      self.complete_look or [],
            "featured":          self.featured,
            "isNew":             self.is_new,
            "isBestseller":      self.is_bestseller,
            "createdAt":         self.created_at.isoformat() if self.created_at else None,
        }


# ─────────────────────────────────────────────
# CART
# ─────────────────────────────────────────────

class Cart(Base):
    __tablename__ = "carts"

    id          = Column(String, primary_key=True, default=lambda: f"cart_{uuid.uuid4().hex[:10]}")
    session_id  = Column(String, unique=True, nullable=False, index=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    items       = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":         self.id,
            "sessionId":  self.session_id,
            "items":      [item.to_dict() for item in self.items],
            "updatedAt":  self.updated_at.isoformat() if self.updated_at else None,
        }


class CartItem(Base):
    __tablename__ = "cart_items"

    id          = Column(String, primary_key=True, default=lambda: f"ci_{uuid.uuid4().hex[:8]}")
    cart_id     = Column(String, ForeignKey("carts.id", ondelete="CASCADE"), nullable=False)
    product_id  = Column(String, ForeignKey("products.id"), nullable=False)
    quantity    = Column(Integer, default=1, nullable=False)
    added_at    = Column(DateTime(timezone=True), server_default=func.now())

    cart        = relationship("Cart", back_populates="items")
    product     = relationship("Product", back_populates="cart_items")

    def to_dict(self):
        product_data = self.product.to_dict() if self.product else {}
        return {
            "id":        self.id,
            "productId": self.product_id,
            "quantity":  self.quantity,
            "addedAt":   self.added_at.isoformat() if self.added_at else None,
            "product":   product_data,
        }


# ─────────────────────────────────────────────
# ORDERS
# ─────────────────────────────────────────────

class OrderStatus(str, enum.Enum):
    pending    = "pending"
    confirmed  = "confirmed"
    processing = "processing"
    shipped    = "shipped"
    delivered  = "delivered"
    cancelled  = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id              = Column(String, primary_key=True, default=lambda: f"ord_{uuid.uuid4().hex[:10]}")
    session_id      = Column(String, nullable=False, index=True)
    status          = Column(String, default=OrderStatus.pending)

    # Pricing
    subtotal        = Column(Float, nullable=False)
    shipping        = Column(Float, default=0)
    total           = Column(Float, nullable=False)

    # Customer info
    customer_name   = Column(String, nullable=True)
    customer_email  = Column(String, nullable=True)
    shipping_address = Column(Text, nullable=True)

    # Metadata
    notes           = Column(Text, nullable=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    items           = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":              self.id,
            "sessionId":       self.session_id,
            "status":          self.status,
            "subtotal":        self.subtotal,
            "shipping":        self.shipping,
            "total":           self.total,
            "customerName":    self.customer_name,
            "customerEmail":   self.customer_email,
            "shippingAddress": self.shipping_address,
            "notes":           self.notes,
            "items":           [item.to_dict() for item in self.items],
            "createdAt":       self.created_at.isoformat() if self.created_at else None,
        }


class OrderItem(Base):
    __tablename__ = "order_items"

    id          = Column(String, primary_key=True, default=lambda: f"oi_{uuid.uuid4().hex[:8]}")
    order_id    = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id  = Column(String, ForeignKey("products.id"), nullable=False)
    quantity    = Column(Integer, default=1)
    unit_price  = Column(Float, nullable=False)  # Snapshot at time of order

    order       = relationship("Order", back_populates="items")
    product     = relationship("Product", back_populates="order_items")

    def to_dict(self):
        return {
            "id":        self.id,
            "productId": self.product_id,
            "quantity":  self.quantity,
            "unitPrice": self.unit_price,
            "product":   self.product.to_dict() if self.product else {},
        }
