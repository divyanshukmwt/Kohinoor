'use client';

import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { formatPrice } from '@/utils/helpers';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, openDrawer } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    openDrawer();
  };

  // Normalize image: backend returns string URLs, mock returns string or {url,alt}
  const imgSrc = product.images?.[0]?.url || product.images?.[0] || '/images/placeholder.jpg';
  const imgAlt = product.images?.[0]?.alt || product.name;

  return (
    <article className="group product-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <Link href={`/shop/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square bg-soft-beige/50 overflow-hidden mb-5">
          <img
            src={imgSrc}
            alt={imgAlt}
            className="product-image object-cover w-full h-full"
            loading={index < 3 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-on-background/0 group-hover:bg-on-background/5 transition-all duration-700" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {(product.isNew || product.is_new) && (
              <span className="font-inter text-[10px] uppercase tracking-[0.1em] bg-ivory-base text-primary px-3 py-1.5">New</span>
            )}
            {(product.isBestseller || product.is_bestseller) && (
              <span className="font-inter text-[10px] uppercase tracking-[0.1em] bg-champagne-gold text-matte-black px-3 py-1.5">Bestseller</span>
            )}
          </div>

          {/* Quick add */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-4 right-4 py-3 bg-ivory-base/95 backdrop-blur-sm font-inter text-[11px] uppercase tracking-[0.1em] text-on-background opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 hover:bg-matte-black hover:text-ivory-base"
          >
            Add to Bag
          </button>
        </div>

        {/* Info */}
        <div className="flex justify-between items-start px-0">
          <div className="flex-1 min-w-0 pr-4">
            <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mb-1">{product.category}</p>
            <h3 className="font-inter text-[15px] text-on-background mb-1.5 truncate">{product.name}</h3>
            <p className="font-inter text-[12px] text-outline/70 line-clamp-1">{product.shortDescription}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bodoni text-[16px] text-on-background">{formatPrice(product.price)}</p>
            {product.stock <= 3 && product.stock > 0 && (
              <p className="font-inter text-[10px] text-error uppercase tracking-[0.05em] mt-0.5">Only {product.stock} left</p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
