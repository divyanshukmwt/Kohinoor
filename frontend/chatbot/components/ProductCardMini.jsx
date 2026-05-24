'use client';

import React, { useState } from 'react';
import { formatPrice } from '../services/recommendations';
import useChatbotStore from '../store/useChatbotStore';
import { fetchProductsByIds } from '../services/products';

export default function ProductCardMini({ product }) {
  const { addToCart, addLookToCart } = useChatbotStore();
  const [imageError,   setImageError]   = useState(false);
  const [addedToCart,  setAddedToCart]  = useState(false);
  const [addingLook,   setAddingLook]   = useState(false);

  const handleAddToCart = async () => {
    await addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleAddLook = async () => {
    if (addingLook) return;
    setAddingLook(true);
    try {
      let lookProducts = [product];
      if (product.completeLook?.length) {
        const related = await fetchProductsByIds(product.completeLook);
        lookProducts  = [product, ...related];
      }
      await addLookToCart(lookProducts);
    } finally {
      setAddingLook(false);
    }
  };

  // Use relative frontend URL (not the backend API URL)
  const handleViewProduct = () => {
    window.open(`/shop/${product.slug}`, '_blank');
  };

  return (
    <div className="eclat-product-card" data-product-card>
      {/* Image */}
      <div className="eclat-product-image-wrap">
        {!imageError ? (
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="eclat-product-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="eclat-product-image-placeholder">
            <span>◆</span>
          </div>
        )}
        <div className="eclat-product-overlay" />
      </div>

      {/* Info */}
      <div className="eclat-product-info">
        <div className="eclat-product-category">{product.category}</div>
        <h4 className="eclat-product-name">{product.name}</h4>
        <p className="eclat-product-description">{product.shortDescription || product.description}</p>
        <div className="eclat-product-price">{formatPrice(product.price)}</div>

        {/* Material tags */}
        {product.materials?.length > 0 && (
          <div className="eclat-product-tags">
            {product.materials.slice(0, 3).map((m) => (
              <span key={m} className="eclat-product-tag">{m}</span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="eclat-product-actions">
        <button className="eclat-btn eclat-btn--primary" onClick={handleAddToCart}>
          {addedToCart ? 'Added ✓' : 'Add to Bag'}
        </button>
        <button className="eclat-btn eclat-btn--secondary" onClick={handleViewProduct}>
          View
        </button>
        {product.completeLook?.length > 0 && (
          <button
            className="eclat-btn eclat-btn--ghost"
            onClick={handleAddLook}
            disabled={addingLook}
          >
            {addingLook ? 'Adding...' : '+ Complete Look'}
          </button>
        )}
      </div>
    </div>
  );
}
