'use client';

import { useState } from 'react';
import useCartStore from '@/store/cartStore';

export default function AddToCartButton({ product }) {
  const [added, setAdded] = useState(false);
  const { addToCart, openDrawer, isInCart } = useCartStore();
  const inCart = isInCart(product.id);

  const handleClick = () => {
    addToCart(product);
    openDrawer();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleClick}
        disabled={product.stock === 0}
        className="btn-primary w-full justify-center group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>
          {product.stock === 0 ? 'Sold Out'
            : added ? 'Added to Bag ✓'
            : inCart ? 'Add Another'
            : 'Add to Bag'}
        </span>
        {product.stock > 0 && !added && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        )}
      </button>
      <button className="w-full py-4 font-inter text-[12px] uppercase tracking-[0.1em] text-outline border border-champagne-gold/20 hover:border-champagne-gold/50 transition-colors duration-300">
        Enquire about Bespoke
      </button>
    </div>
  );
}
