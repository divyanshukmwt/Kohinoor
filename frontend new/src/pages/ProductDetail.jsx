import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, getRelatedProducts } from '../data/products';
import { AppContext } from '../context/AppContext';
import { MaterialPromise } from '../components/MaterialPromise';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail = () => {
  const { productId } = useParams();
  const { addToCart } = useContext(AppContext);
  
  // Find product by ID, fallback to Boho Pendant if not found
  const product = products.find(p => p.id === productId) || products[0];

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [fade, setFade] = useState(false);
  const [selectedLength, setSelectedLength] = useState("16\"");
  const [quantity, setQuantity] = useState(1);
  
  // Accordion active states
  const [accordions, setAccordions] = useState({
    desc: true,
    materials: false,
    shipping: false
  });

  // Sticky Mobile Bottom Bar state
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false);

  // Scroll handler for mobile sticky bottom CTA
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400 && window.innerWidth < 768) {
        setShowMobileStickyCta(true);
      } else {
        setShowMobileStickyCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active image when product changes
  useEffect(() => {
    setActiveImage(product.images[0]);
    // Reset configurations
    setSelectedLength("16\"");
    setQuantity(1);
    setAccordions({
      desc: true,
      materials: false,
      shipping: false
    });
  }, [product]);

  const handleThumbnailClick = (imgSrc) => {
    if (imgSrc === activeImage) return;
    setFade(true);
    setTimeout(() => {
      setActiveImage(imgSrc);
      setFade(false);
    }, 200);
  };

  const handleQtyChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const toggleAccordion = (section) => {
    setAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedLength);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedLength);
    // Directly simulate buying checkout
    alert("Proceeding to simulated checkout for: " + product.name + " (" + selectedLength + ")");
  };

  // Determine percentage discount
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const relatedProducts = getRelatedProducts(product.id, 4);

  // Render stars helper
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="material-symbols-outlined filled-icon text-[18px]">star</span>
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[18px]">star_half</span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[18px]">star</span>
        );
      }
    }
    return stars;
  };

  return (
    <main className="max-w-max-width mx-auto px-margin-mobile md:px-gutter-desktop py-8">
      {/* Section 1: Breadcrumb */}
      <nav className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant mb-8 overflow-x-auto whitespace-nowrap no-scrollbar uppercase text-xs tracking-wider">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to={`/collections?category=${product.category}`} className="hover:text-primary transition-colors">
          {product.category}
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-semibold">{product.name}</span>
      </nav>

      {/* Section 2: Main Product Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-section-v">
        {/* LEFT: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-surface-container overflow-hidden rounded-xl shadow-sm border border-outline-variant/20">
            <img 
              alt={product.name} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                fade ? 'opacity-0' : 'opacity-100'
              }`} 
              src={activeImage} 
            />
          </div>
          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleThumbnailClick(img)}
                  className={`aspect-square bg-surface-container rounded-lg border-2 overflow-hidden transition-all hover:opacity-85 ${
                    activeImage === img ? 'border-gold-accent' : 'border-transparent'
                  }`}
                >
                  <img className="w-full h-full object-cover" src={img} alt={`${product.name} view ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Info panel */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="bg-beige-accent text-on-secondary-container px-3 py-1 rounded-full text-label-md font-label-md tracking-wider mb-2 inline-block text-xs font-semibold uppercase">
              {product.category.slice(0, -1) /* singularized name */}
            </span>
            <h1 className="font-display text-[36px] leading-tight text-primary mt-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex text-gold-accent">
                {renderStars(product.rating)}
              </div>
              <span className="text-on-surface-variant text-label-md text-xs font-medium">
                ({product.reviewsCount} Reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-headline-lg font-headline-lg text-primary text-2xl font-bold">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-on-surface-variant line-through text-body-md text-sm">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                {discountPercent && (
                  <span className="text-on-primary-container font-bold text-label-md px-2 py-0.5 bg-primary-fixed rounded text-xs uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          {/* Stock Urgency Message */}
          {product.stock <= 3 && (
            <div className="flex items-center gap-2 text-error font-semibold text-label-md bg-error-container/20 w-fit px-3 py-1 rounded-full text-xs">
              <span className="material-symbols-outlined text-[16px] animate-pulse">priority_high</span>
              Only {product.stock} Left in Stock!
            </div>
          )}

          {/* Configuration selections */}
          <div className="space-y-4 border-y border-outline-variant py-6">
            <div>
              <label className="text-label-md font-label-md uppercase text-on-surface-variant block mb-3 text-xs tracking-wider font-bold">
                Select Length
              </label>
              <div className="flex gap-3">
                {["16\"", "18\"", "20\""].map(len => (
                  <button 
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`px-6 py-2 border-2 text-label-md rounded font-bold transition-all text-xs ${
                      selectedLength === len 
                        ? 'border-primary text-primary bg-primary/5' 
                        : 'border-outline-variant text-on-surface-variant hover:border-primary'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-label-md font-label-md uppercase text-on-surface-variant block mb-3 text-xs tracking-wider font-bold">
                Material Promise
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="bg-surface-container-high px-4 py-1.5 rounded-full text-label-md text-xs font-semibold text-on-surface border border-outline-variant/60">
                  Oxidized Silver
                </span>
                <span className="bg-surface-container-high px-4 py-1.5 rounded-full text-label-md text-xs font-semibold text-on-surface border border-outline-variant/60">
                  Nickel Free
                </span>
                <span className="bg-surface-container-high px-4 py-1.5 rounded-full text-label-md text-xs font-semibold text-on-surface border border-outline-variant/60">
                  Anti-Tarnish
                </span>
              </div>
            </div>
          </div>

          {/* Add/Buy Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-outline-variant rounded bg-surface h-[48px] w-full sm:w-32 justify-between px-4">
              <button 
                className="text-primary hover:scale-115 transition-transform" 
                onClick={() => handleQtyChange(-1)}
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="font-bold text-body-md">{quantity}</span>
              <button 
                className="text-primary hover:scale-115 transition-transform" 
                onClick={() => handleQtyChange(1)}
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 h-[48px] border-2 border-primary text-primary font-bold text-button rounded hover:bg-primary/5 transition-all uppercase tracking-widest text-xs"
            >
              ADD TO CART
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 h-[48px] bg-primary text-on-primary font-bold text-button rounded shadow-lg active:scale-95 hover:opacity-90 transition-all uppercase tracking-widest text-xs"
            >
              BUY NOW
            </button>
          </div>

          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-label-md text-xs text-on-surface-variant font-semibold">
              <span className="material-symbols-outlined text-gold-accent text-lg">local_shipping</span>
              Free Shipping
            </div>
            <div className="flex items-center gap-2 text-label-md text-xs text-on-surface-variant font-semibold">
              <span className="material-symbols-outlined text-gold-accent text-lg">sync</span>
              15 Day Returns
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Accordion Details */}
      <section className="mb-section-v max-w-3xl mx-auto border-t border-outline-variant/30 pt-4">
        <div className="space-y-4">
          {/* Description Accordion */}
          <div className="border-b border-outline-variant/30">
            <button 
              className="flex justify-between items-center w-full py-4 text-left" 
              onClick={() => toggleAccordion('desc')}
            >
              <span className="font-headline-md text-lg md:text-xl text-on-surface font-semibold">Description</span>
              <span className={`material-symbols-outlined transition-transform duration-300 ${
                accordions.desc ? 'rotate-180' : ''
              }`}>
                expand_more
              </span>
            </button>
            <div className={`pb-6 text-body-md text-on-surface-variant leading-relaxed text-sm md:text-base ${
              accordions.desc ? 'block' : 'hidden'
            }`}>
              {product.description}
            </div>
          </div>

          {/* Materials Accordion */}
          <div className="border-b border-outline-variant/30">
            <button 
              className="flex justify-between items-center w-full py-4 text-left" 
              onClick={() => toggleAccordion('materials')}
            >
              <span className="font-headline-md text-lg md:text-xl text-on-surface font-semibold">Materials &amp; Care</span>
              <span className={`material-symbols-outlined transition-transform duration-300 ${
                accordions.materials ? 'rotate-180' : ''
              }`}>
                expand_more
              </span>
            </button>
            <div className={`pb-6 ${accordions.materials ? 'block' : 'hidden'}`}>
              <MaterialPromise materials={product.materials} care={product.care} />
            </div>
          </div>

          {/* Shipping Accordion */}
          <div className="border-b border-outline-variant/30">
            <button 
              className="flex justify-between items-center w-full py-4 text-left" 
              onClick={() => toggleAccordion('shipping')}
            >
              <span className="font-headline-md text-lg md:text-xl text-on-surface font-semibold">Shipping &amp; Returns</span>
              <span className={`material-symbols-outlined transition-transform duration-300 ${
                accordions.shipping ? 'rotate-180' : ''
              }`}>
                expand_more
              </span>
            </button>
            <div className={`pb-6 text-body-md text-on-surface-variant text-sm md:text-base leading-relaxed ${
              accordions.shipping ? 'block' : 'hidden'
            }`}>
              {product.shipping}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Customer Reviews */}
      <section className="mb-section-v border-t border-outline-variant/20 pt-12">
        <h2 className="font-display text-headline-lg text-primary text-center mb-12">
          Whispers of Appreciation
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Aggregated score card */}
          <div className="lg:col-span-1 bg-surface-container rounded-xl p-6 h-fit text-center border border-outline-variant/25 shadow-sm">
            <div className="text-display-lg font-display text-5xl font-bold text-primary">{product.rating.toFixed(1)}</div>
            <div className="flex justify-center text-gold-accent my-2">
              {renderStars(product.rating)}
            </div>
            <p className="text-label-md text-on-surface-variant uppercase font-bold text-xs tracking-wider mt-1">
              Based on {product.reviewsCount} reviews
            </p>
            <button 
              onClick={() => alert("Write review template panel clicked!")}
              className="w-full mt-6 py-3 border border-primary text-primary font-bold text-button rounded hover:bg-primary/5 transition-colors uppercase tracking-widest text-xs"
            >
              WRITE A REVIEW
            </button>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review, idx) => (
              <div 
                key={idx}
                className="bg-surface-container-low p-6 rounded-xl shadow-[0_40px_40px_rgba(43,27,23,0.05)] border-l-4 border-gold-accent flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between mb-4 items-center">
                    <span className="font-bold text-on-surface text-sm md:text-base">{review.name}</span>
                    <span className="text-label-md text-on-surface-variant text-xs">{review.time}</span>
                  </div>
                  <div className="flex text-gold-accent mb-3">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-body-md text-on-surface-variant italic text-sm md:text-base leading-relaxed">
                    "{review.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Related Products */}
      <section className="mb-section-v border-t border-outline-variant/20 pt-12">
        <h2 className="font-display text-headline-lg text-primary mb-8 text-center md:text-left">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Sticky Mobile Bottom Bar */}
      <div 
        className={`md:hidden fixed bottom-0 left-0 w-full bg-surface-bright p-4 flex items-center justify-between border-t border-outline-variant z-[45] transform transition-transform duration-300 shadow-[0_-4px_20px_rgba(43,27,23,0.1)] ${
          showMobileStickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-label-md font-bold text-on-surface truncate text-xs uppercase tracking-wider max-w-[150px]">
            {product.name}
          </span>
          <span className="text-primary font-bold text-sm">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>
        <button 
          onClick={handleAddToCart}
          className="bg-primary text-on-primary px-6 py-2.5 rounded font-bold text-button shadow-lg active:scale-95 transition-all text-xs tracking-wider uppercase"
        >
          ADD TO CART
        </button>
      </div>
    </main>
  );
};
