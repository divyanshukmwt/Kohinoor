import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRelatedProducts } from '../data/products';
import { AppContext } from '../context/AppContext';
import { MaterialPromise } from '../components/MaterialPromise';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail = () => {
  const { productId } = useParams();
  const { products, addToCart, setCartOpen } = useContext(AppContext);

  const product =
    products.find((p) => p.id === productId || p.slug === productId) || products[0];

  const [activeImage, setActiveImage] = useState(product?.images?.[0] || '');
  const [selectedLength, setSelectedLength] = useState('Standard');
  const [quantity, setQuantity] = useState(1);

  const [accordions, setAccordions] = useState({
    desc: true,
    materials: false,
    shipping: false,
  });

  useEffect(() => {
    if (product) {
      setActiveImage(product.images?.[0] || '');
      setSelectedLength(product.category === 'NECKLACES' ? '18"' : 'Standard');
      setQuantity(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  if (!product) return null;

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const toggleAccordion = (section) => {
    setAccordions((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedLength, true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedLength, true);
    setCartOpen(true);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const relatedProducts = getRelatedProducts(product.id, products, 4);
  const reviewsList = Array.isArray(product.reviews) ? product.reviews : [];
  const reviewsCount = product.reviewsCount ?? product.reviewCount ?? reviewsList.length;

  const renderStars = (rating = 4.8) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="material-symbols-outlined filled-icon text-[18px]">
            star
          </span>
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[18px]">
            star_half
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[18px]">
            star
          </span>
        );
      }
    }
    return stars;
  };

  const sizeOptions =
    product.category === 'NECKLACES'
      ? ['16"', '18"', '20"']
      : product.category === 'RINGS'
      ? ['US 6', 'US 7', 'US 8']
      : ['Standard'];

  const materialPills =
    Array.isArray(product.materialTags) && product.materialTags.length > 0
      ? product.materialTags
      : ['Hallmarked Finish', 'Nickel Free', 'Anti-Tarnish'];

  return (
    <main className="max-w-max-width mx-auto px-margin-mobile md:px-gutter-desktop py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-on-surface-variant mb-8 overflow-x-auto whitespace-nowrap no-scrollbar uppercase text-xs tracking-wider">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link
          to={`/collections?category=${product.category}`}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start mb-16">
        {/* LEFT: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-surface-container overflow-hidden rounded-xl border border-outline-variant/30">
            <img
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-200"
              src={activeImage}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square bg-surface-container rounded-lg border-2 overflow-hidden transition-opacity hover:opacity-90 ${
                    activeImage === img ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Info panel */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full tracking-wider text-[11px] font-semibold uppercase">
                {product.collection || product.category}
              </span>
              {product.tag && (
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full tracking-wider text-[11px] font-semibold uppercase">
                  {product.tag}
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl leading-tight text-primary mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex text-gold-accent">{renderStars(product.rating)}</div>
              <span className="text-on-surface-variant text-xs font-medium">
                {Number(product.rating || 4.8).toFixed(1)} ({reviewsCount} Reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl md:text-3xl text-primary font-bold">
              ₹{Number(product.price || 0).toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-on-surface-variant line-through text-sm">
                  ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                </span>
                {discountPercent && (
                  <span className="text-primary font-bold px-2.5 py-0.5 bg-primary-fixed/60 rounded text-xs uppercase tracking-wider">
                    Save {discountPercent}%
                  </span>
                )}
              </>
            )}
          </div>

          {product.stock <= 5 && (
            <div className="flex items-center gap-1.5 text-primary font-semibold bg-surface-container w-fit px-3 py-1 rounded text-xs border border-outline-variant/50">
              <span className="material-symbols-outlined text-[15px]">inventory_2</span>
              Limited edition — {product.stock} pieces available in atelier
            </div>
          )}

          {/* Configuration selections */}
          <div className="space-y-4 border-y border-outline-variant/50 py-5">
            <div>
              <label className="uppercase text-on-surface-variant block mb-2.5 text-xs tracking-wider font-bold">
                Select Size / Fit
              </label>
              <div className="flex gap-2.5">
                {sizeOptions.map((len) => (
                  <button
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`px-5 py-2 border rounded font-bold transition-colors text-xs ${
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
              <label className="uppercase text-on-surface-variant block mb-2.5 text-xs tracking-wider font-bold">
                Craft &amp; Material Highlights
              </label>
              <div className="flex flex-wrap gap-2">
                {materialPills.map((pill) => (
                  <span
                    key={pill}
                    className="bg-surface-container px-3.5 py-1 rounded-full text-xs font-medium text-on-surface border border-outline-variant/50 capitalize"
                  >
                    {pill}
                  </span>
                ))}
                <span className="bg-surface-container px-3.5 py-1 rounded-full text-xs font-medium text-on-surface border border-outline-variant/50">
                  Anti-Tarnish
                </span>
              </div>
            </div>
          </div>

          {/* Add/Buy Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center border border-outline-variant rounded bg-surface h-12 w-full sm:w-32 justify-between px-4">
              <button
                className="text-primary font-bold px-1"
                onClick={() => handleQtyChange(-1)}
              >
                −
              </button>
              <span className="font-bold text-sm">{quantity}</span>
              <button
                className="text-primary font-bold px-1"
                onClick={() => handleQtyChange(1)}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 border border-primary text-primary font-bold rounded hover:bg-primary/5 transition-colors uppercase tracking-widest text-xs"
            >
              ADD TO BAG
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 h-12 bg-primary text-on-primary font-bold rounded hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs"
            >
              BUY NOW
            </button>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-gold-accent text-lg">
                local_shipping
              </span>
              Free Insured Delivery
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-gold-accent text-lg">sync</span>
              15-Day Easy Exchange
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Details */}
      <section className="mb-16 max-w-3xl mx-auto border-t border-outline-variant/40 pt-2">
        <div className="divide-y divide-outline-variant/40">
          <div>
            <button
              className="flex justify-between items-center w-full py-4 text-left"
              onClick={() => toggleAccordion('desc')}
            >
              <span className="font-display text-lg text-on-surface font-semibold">
                Description &amp; Styling Notes
              </span>
              <span
                className={`material-symbols-outlined transition-transform duration-200 ${
                  accordions.desc ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {accordions.desc && (
              <div className="pb-5 text-on-surface-variant leading-relaxed text-sm">
                {product.description}
              </div>
            )}
          </div>

          <div>
            <button
              className="flex justify-between items-center w-full py-4 text-left"
              onClick={() => toggleAccordion('materials')}
            >
              <span className="font-display text-lg text-on-surface font-semibold">
                Materials &amp; Care
              </span>
              <span
                className={`material-symbols-outlined transition-transform duration-200 ${
                  accordions.materials ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {accordions.materials && (
              <div className="pb-5">
                <MaterialPromise
                  materials={Array.isArray(product.materials) ? product.materials : []}
                  care={product.care}
                />
              </div>
            )}
          </div>

          <div>
            <button
              className="flex justify-between items-center w-full py-4 text-left"
              onClick={() => toggleAccordion('shipping')}
            >
              <span className="font-display text-lg text-on-surface font-semibold">
                Shipping &amp; Returns
              </span>
              <span
                className={`material-symbols-outlined transition-transform duration-200 ${
                  accordions.shipping ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {accordions.shipping && (
              <div className="pb-5 text-on-surface-variant text-sm leading-relaxed">
                {product.shipping}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      {reviewsList.length > 0 && (
        <section className="mb-16 border-t border-outline-variant/30 pt-12">
          <h2 className="font-display text-2xl md:text-3xl text-primary text-center mb-10">
            Client Impressions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reviewsList.map((review, idx) => (
              <div
                key={idx}
                className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <span className="font-bold text-on-surface text-sm">{review.name}</span>
                    <span className="text-on-surface-variant text-xs">{review.time}</span>
                  </div>
                  <div className="flex text-gold-accent mb-2.5">{renderStars(review.rating)}</div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    &ldquo;{review.content}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      <section className="mb-12 border-t border-outline-variant/30 pt-12">
        <h2 className="font-display text-2xl md:text-3xl text-primary mb-8">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
};
