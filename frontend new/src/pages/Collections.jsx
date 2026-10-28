import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const Collections = () => {
  const { products, toggleConcierge } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'ALL';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('FEATURED');
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [visibleLimit, setVisibleLimit] = useState(12);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'ALL') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
    setVisibleLimit(12);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleLoadMore = () => {
    setVisibleLimit((prev) => Math.min(prev + 8, filteredProducts.length));
  };

  // Filter products by category and search query across name, category, description, materials, occasions, and tags
  let filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (product.category || '').toUpperCase() === selectedCategory.toUpperCase();

    if (!searchQuery) return matchesCategory;

    const q = searchQuery.toLowerCase();
    const haystack = [
      product.name,
      product.category,
      product.description,
      product.tag,
      product.collection,
      ...(product.materialTags || []),
      ...(product.materials || []),
      ...(product.occasions || []),
      ...(product.styleTags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return matchesCategory && haystack.includes(q);
  });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'PRICE_LOW_TO_HIGH') return a.price - b.price;
    if (sortBy === 'PRICE_HIGH_TO_LOW') return b.price - a.price;
    if (sortBy === 'MOST_POPULAR') {
      return (b.reviewsCount ?? b.reviewCount ?? 0) - (a.reviewsCount ?? a.reviewCount ?? 0);
    }
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const displayedProducts = filteredProducts.slice(0, visibleLimit);

  return (
    <main className="max-w-max-width mx-auto px-margin-mobile md:px-gutter-desktop min-h-screen">
      {/* Page Header */}
      <section className="py-12 flex flex-col items-center text-center">
        <nav className="flex items-center gap-2 mb-3 text-on-surface-variant text-xs">
          <Link to="/" className="font-label-md hover:text-primary transition-colors uppercase">
            HOME
          </Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="font-label-md text-primary uppercase">COLLECTIONS</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl font-bold text-primary mb-3">
          {searchQuery
            ? `Results for "${searchQuery}"`
            : selectedCategory === 'ALL'
            ? 'All Collections'
            : selectedCategory}
        </h1>
        <p className="max-w-xl font-body text-on-surface-variant text-sm md:text-base">
          Handcrafted Indian heritage and modern fine jewellery, seeded from the Kohinoor Knowledge
          Base.
        </p>
      </section>

      {/* Filter & Sort Bar */}
      <div className="sticky top-16 z-40 bg-surface/95 backdrop-blur-sm py-3.5 mb-8 border-y border-outline-variant/40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {['ALL', 'NECKLACES', 'EARRINGS', 'RINGS', 'BRACELETS'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full border transition-colors duration-150 text-xs font-bold font-label-md ${
                  selectedCategory === cat
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={toggleConcierge}
              className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container text-primary text-xs font-bold uppercase tracking-wider hover:border-primary transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
              Need Styling Help?
            </button>

            <div className="relative w-48">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full appearance-none bg-surface-container border border-outline-variant px-3.5 py-2 pr-8 font-label-md text-xs font-bold tracking-wider text-on-surface focus:border-primary outline-none rounded-lg cursor-pointer uppercase"
              >
                <option value="FEATURED">SORT: FEATURED</option>
                <option value="PRICE_LOW_TO_HIGH">PRICE: LOW TO HIGH</option>
                <option value="PRICE_HIGH_TO_LOW">PRICE: HIGH TO LOW</option>
                <option value="MOST_POPULAR">MOST POPULAR</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-base">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-on-surface-variant text-xs uppercase tracking-wider">
          Showing <span className="font-bold text-on-surface">{filteredProducts.length}</span>{' '}
          pieces
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              const next = new URLSearchParams(searchParams);
              next.delete('search');
              setSearchParams(next);
            }}
            className="text-xs text-primary font-semibold underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Product Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-16">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-on-surface-variant space-y-4">
          <span className="material-symbols-outlined text-5xl">search_off</span>
          <p className="font-body text-base">No pieces found matching those filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('ALL');
            }}
            className="text-primary font-bold border-b border-primary pb-0.5 text-xs uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Load More */}
      {filteredProducts.length > visibleLimit && (
        <div className="flex flex-col items-center gap-4 mb-16">
          <button
            onClick={handleLoadMore}
            className="px-10 py-3.5 border border-primary text-primary font-button hover:bg-primary hover:text-on-primary transition-colors duration-200 rounded uppercase tracking-widest text-xs font-bold"
          >
            SHOW MORE PIECES
          </button>
        </div>
      )}
    </main>
  );
};
