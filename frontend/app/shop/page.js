'use client';

import { useState, useEffect, useRef } from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import FilterSidebar from '@/components/product/FilterSidebar';
import TypographyBlock from '@/components/ui/TypographyBlock';
import { getProducts } from '@/services/products';

const SORT_OPTIONS = [
  { id: 'default', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'all' });
  const [sort, setSort] = useState('default');
  const [filterOpen, setFilterOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');
      if (!headerRef.current) return;
      gsap.fromTo(
        headerRef.current.querySelectorAll('.shop-header-reveal'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }
      );
    }
    setup();
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProducts(filters);
      const sorted = sortProducts(data, sort);
      setProducts(sorted);
      setLoading(false);
    }
    load();
  }, [filters, sort]);

  function sortProducts(list, sortId) {
    const arr = [...list];
    if (sortId === 'price-asc') return arr.sort((a, b) => a.price - b.price);
    if (sortId === 'price-desc') return arr.sort((a, b) => b.price - a.price);
    if (sortId === 'newest') return arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return arr;
  }

  return (
    <div className="min-h-screen bg-ivory-base pt-28">
      {/* ── Shop Header ── */}
      <header ref={headerRef} className="px-6 md:px-[80px] pt-16 pb-16 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="shop-header-reveal font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-4">
              The Collection
            </p>
            <h1 className="shop-header-reveal font-bodoni text-[clamp(40px,6vw,80px)] leading-tight tracking-tight text-on-background">
              All Pieces
            </h1>
          </div>
          <p className="shop-header-reveal font-inter text-[15px] leading-7 text-on-surface-variant max-w-sm">
            Each piece individually crafted in our Geneva atelier. Every stone ethically sourced and
            certified.
          </p>
        </div>
        {/* Gold divider */}
        <div className="gold-line mt-12" />
      </header>

      {/* ── Shop Body ── */}
      <div className="px-6 md:px-[80px] pb-32 max-w-[1440px] mx-auto">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="md:hidden font-inter text-[11px] uppercase tracking-[0.1em] text-on-background flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="13" y1="18" x2="21" y2="18" />
              </svg>
              Filters
            </button>
            <p className="font-inter text-[13px] text-outline">
              {loading ? '...' : `${products.length} piece${products.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline hidden md:inline">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent font-inter text-[12px] text-on-background uppercase tracking-[0.08em] border border-champagne-gold/20 px-3 py-2 outline-none cursor-pointer hover:border-champagne-gold/40 transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-12 md:gap-16">
          {/* Filter Sidebar — Desktop always visible, mobile toggle */}
          <div
            className={`${
              filterOpen ? 'block' : 'hidden'
            } md:block`}
          >
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-soft-beige mb-5" />
                    <div className="h-3 bg-soft-beige rounded mb-2 w-1/2" />
                    <div className="h-4 bg-soft-beige rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={products} columns={3} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
