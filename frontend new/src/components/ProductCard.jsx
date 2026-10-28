import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(AppContext);
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const renderStars = (rating = 4.7) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-sm filled-icon">
            star
          </span>
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-sm">
            star_half
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-sm">
            star
          </span>
        );
      }
    }
    return stars;
  };

  const reviewsCount = product.reviewsCount ?? product.reviewCount ?? 0;

  return (
    <div className="product-card group flex flex-col justify-between h-full bg-surface rounded-lg border border-outline-variant/30 hover:border-outline-variant transition-colors duration-200 p-2.5">
      <Link to={`/product/${product.id}`} className="block flex-1">
        <div className="relative overflow-hidden rounded-md bg-surface-container aspect-[3/4] mb-3.5">
          <img
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            src={product.images?.[0]}
          />
          {product.tag && (
            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-surface/95 text-primary border border-outline-variant/50 font-label-md text-[10px] rounded uppercase tracking-wider font-semibold">
              {product.tag}
            </div>
          )}
          <button
            onClick={handleWishlistClick}
            aria-label="Toggle wishlist"
            className="wishlist-btn absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface/90 flex items-center justify-center text-primary transition-colors duration-150 hover:bg-surface"
          >
            <span
              className={`material-symbols-outlined text-lg ${
                isWishlisted ? 'wishlist-active' : ''
              }`}
            >
              favorite
            </span>
          </button>
        </div>

        <div className="text-center px-1 flex flex-col items-center">
          <p className="font-label-md text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest">
            {product.category}
          </p>
          <h3 className="font-display text-base font-semibold text-on-surface group-hover:text-primary transition-colors duration-150 mb-1.5 line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center justify-center gap-0.5 mb-2 text-gold-accent">
            {renderStars(product.rating)}
            <span className="font-label-md text-[10px] ml-1 text-on-surface-variant">
              ({reviewsCount})
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="font-body text-base font-bold text-primary">
              ₹{Number(product.price || 0).toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="font-body text-on-surface-variant line-through text-xs">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="pt-1">
        <button
          onClick={handleCartClick}
          className="w-full py-2.5 border border-primary text-primary font-button rounded hover:bg-primary hover:text-on-primary transition-colors duration-200 tracking-widest uppercase text-xs font-bold bg-transparent"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};
