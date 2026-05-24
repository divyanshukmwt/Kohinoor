import { notFound } from 'next/navigation';
import ProductGallery from '@/components/product/ProductGallery';
import ProductTabs from '@/components/product/ProductTabs';
import ProductGrid from '@/components/product/ProductGrid';
import AddToCartButton from '@/components/product/AddToCartButton';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts, getProducts } from '@/services/products';
import { formatPrice } from '@/utils/helpers';

// Generate static params — graceful fallback if backend down at build time
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return []; // dynamic rendering fallback
  }
}

export async function generateMetadata({ params }) {
  try {
    const product = await getProductBySlug(params.slug);
    if (!product) return { title: 'Not Found' };
    return {
      title: `${product.name} — AURELIA LORE`,
      description: product.shortDescription || product.description,
    };
  } catch {
    return { title: 'Product — AURELIA LORE' };
  }
}

export default async function ProductDetailPage({ params }) {
  let product = null;
  try {
    product = await getProductBySlug(params.slug);
  } catch {
    notFound();
  }
  if (!product) notFound();

  let related = [];
  try {
    related = await getRelatedProducts(product.id);
  } catch {
    related = [];
  }

  const images = (product.images || []).map((url) =>
    typeof url === 'string' ? { url, alt: product.name } : url
  );

  return (
    <div className="min-h-screen bg-ivory-base pt-28">
      {/* ── PDP Hero ── */}
      <section className="px-6 md:px-[80px] pt-12 pb-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 lg:pt-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8">
              <Link href="/shop" className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-on-background transition-colors">
                Collections
              </Link>
              <span className="text-outline/30 text-[11px]">/</span>
              <span className="font-inter text-[11px] uppercase tracking-[0.1em] text-on-background">
                {product.name}
              </span>
            </nav>

            {/* Category + Badges */}
            <div className="flex items-center gap-3 mb-4">
              <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-champagne-gold">
                {product.category}
              </p>
              {product.isNew && (
                <span className="font-inter text-[10px] uppercase tracking-[0.08em] bg-primary/10 text-primary px-2.5 py-1">
                  New Arrival
                </span>
              )}
              {product.isBestseller && (
                <span className="font-inter text-[10px] uppercase tracking-[0.08em] bg-champagne-gold/15 text-tertiary px-2.5 py-1">
                  Bestseller
                </span>
              )}
            </div>

            <h1 className="font-bodoni text-[clamp(28px,3.5vw,44px)] text-on-background leading-tight mb-4">
              {product.name}
            </h1>
            <p className="font-bodoni italic text-[18px] text-tertiary leading-snug mb-8">
              {product.shortDescription}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <p className="font-bodoni text-[32px] text-on-background">
                {formatPrice(product.price)}
              </p>
              {product.stock <= 3 && product.stock > 0 && (
                <p className="font-inter text-[11px] uppercase tracking-[0.08em] text-error">
                  Only {product.stock} remaining
                </p>
              )}
            </div>

            <div className="gold-line mb-8" />

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-3 mb-8">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                      fill={i < Math.floor(product.rating) ? '#E2C9A1' : 'none'}
                      stroke="#E2C9A1" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="font-inter text-[13px] text-outline">
                  {product.rating} · {product.reviewCount} reviews
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: '⬡', label: 'Ethically Sourced' },
                { icon: '◇', label: 'Certificate Included' },
                { icon: '○', label: 'Free Insured Shipping' },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-2 py-4 px-2 border border-champagne-gold/15">
                  <span className="text-champagne-gold text-[16px]">{badge.icon}</span>
                  <p className="font-inter text-[9px] uppercase tracking-[0.08em] text-outline text-center leading-4">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Tabs ── */}
      <section className="px-6 md:px-[80px] pb-20 max-w-[1440px] mx-auto">
        <ProductTabs product={product} />
      </section>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section className="px-6 md:px-[80px] py-24 bg-surface-container-low/30">
          <div className="max-w-[1440px] mx-auto">
            <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-4">
              You May Also Desire
            </p>
            <h2 className="font-bodoni text-[32px] text-on-background mb-12">
              Complete the Collection
            </h2>
            <ProductGrid products={related} columns={3} />
          </div>
        </section>
      )}
    </div>
  );
}
