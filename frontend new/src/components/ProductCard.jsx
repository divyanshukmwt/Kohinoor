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

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-sm filled-icon">star</span>
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-sm">star_half</span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-sm">star</span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="product-card group flex flex-col justify-between h-full bg-surface">
      <Link to={`/product/${product.id}`} className="block flex-1">
        <div className="relative overflow-hidden rounded-lg bg-surface-container aspect-[3/4] mb-4 shadow-[0_40px_40px_rgba(43,27,23,0.05)] transition-transform duration-500 hover:-translate-y-2">
          <img 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            src={product.images[0]} 
          />
          {product.tag && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-secondary-container text-on-secondary-container font-label-md text-[10px] rounded uppercase tracking-wider">
              {product.tag}
            </div>
          )}
          <button 
            onClick={handleWishlistClick}
            className="wishlist-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 flex items-center justify-center text-primary transition-all hover:bg-surface active:scale-90"
          >
            <span className={`material-symbols-outlined text-lg ${isWishlisted ? 'wishlist-active' : ''}`}>
              favorite
            </span>
          </button>
        </div>

        <div className="text-center px-2 flex flex-col items-center">
          <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest">
            {product.category}
          </p>
          <h3 className="font-headline-md text-base text-on-surface hover:text-primary transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-center gap-1 mb-2 text-tertiary">
            {renderStars(product.rating)}
            <span className="font-label-md text-[10px] ml-1 text-on-surface-variant">
              ({product.reviewsCount})
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-headline-md text-headline-md text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="font-body-md text-body-md text-on-surface-variant line-through text-sm">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="px-2 pb-2">
        <button 
          onClick={handleCartClick}
          className="w-full py-3 border border-primary text-primary font-button text-button hover:bg-primary hover:text-on-primary transition-all active:scale-95 tracking-widest uppercase text-xs font-bold bg-transparent"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};
