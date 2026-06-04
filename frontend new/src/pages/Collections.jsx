import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'ALL';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('NEWEST');
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [visibleLimit, setVisibleLimit] = useState(8);

  // Sync category state with search parameters
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Sync search state with search parameters
  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Update URL query params
    const newParams = new URLSearchParams(searchParams);
    if (category === 'ALL') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
    setVisibleLimit(8); // Reset pagination
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setVisibleLimit(8); // Reset pagination
  };

  const handleLoadMore = () => {
    setVisibleLimit(prev => Math.min(prev + 4, filteredProducts.length));
  };

  // 1. Filter products by category and search query
  let filteredProducts = products.filter(product => {
    // Category filter
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    
    // Search query filter
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // 2. Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'PRICE_LOW_TO_HIGH') {
      return a.price - b.price;
    }
    if (sortBy === 'PRICE_HIGH_TO_LOW') {
      return b.price - a.price;
    }
    if (sortBy === 'MOST_POPULAR') {
      return b.reviewsCount - a.reviewsCount; // Using review count as popularity proxy
    }
    // Default 'NEWEST': products are sorted as they appear in database or we can sort by id
    return 0; 
  });

  const displayedProducts = filteredProducts.slice(0, visibleLimit);

  return (
    <main className="max-w-max-width mx-auto px-margin-mobile md:px-gutter-desktop min-h-screen">
      {/* Section 1: Page Header */}
      <section className="py-section-v flex flex-col items-center text-center">
        <nav className="flex items-center gap-2 mb-4 text-on-surface-variant">
          <Link to="/" className="font-label-md text-label-md hover:text-primary transition-colors uppercase">
            HOME
          </Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="font-label-md text-label-md text-primary uppercase">COLLECTIONS</span>
        </nav>
        
        <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === 'ALL' ? 'All Collections' : selectedCategory}
        </h1>
        <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant text-base">
          Experience the fusion of ancient Indian heritage and modern anti-tarnish technology. Handcrafted elegance designed for the contemporary royal.
        </p>
      </section>

      {/* Section 2: Sticky Filter & Sort Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md py-4 mb-8 border-b border-outline-variant/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {['ALL', 'NECKLACES', 'EARRINGS', 'RINGS', 'BRACELETS'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-full border transition-all active:scale-95 text-xs font-bold font-label-md ${
                  selectedCategory === cat
                    ? 'border-outline bg-primary text-on-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting controls */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-56">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full appearance-none bg-surface-container border border-outline-variant px-4 py-2.5 pr-10 font-label-md text-xs font-bold tracking-widest text-on-surface focus:border-secondary outline-none rounded-lg transition-colors cursor-pointer uppercase"
              >
                <option value="NEWEST">SORT BY: NEWEST</option>
                <option value="PRICE_LOW_TO_HIGH">PRICE: LOW TO HIGH</option>
                <option value="PRICE_HIGH_TO_LOW">PRICE: HIGH TO LOW</option>
                <option value="MOST_POPULAR">MOST POPULAR</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Results Count */}
      <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-4">
        <p className="font-body-md text-body-md text-on-surface-variant text-sm">
          Showing <span className="font-bold text-on-surface">{filteredProducts.length}</span> products 
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        <div className="flex items-center gap-2">
          <button className="material-symbols-outlined p-1 text-primary active:scale-90 transition-transform" title="Grid View">
            grid_view
          </button>
          <button className="material-symbols-outlined p-1 text-on-surface-variant hover:text-primary active:scale-90 transition-transform" title="List View">
            view_list
          </button>
        </div>
      </div>

      {/* Section 4: Product Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-gutter-desktop gap-y-12 mb-section-v">
          {displayedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-on-surface-variant space-y-4">
          <span className="material-symbols-outlined text-6xl">search_off</span>
          <p className="font-body-lg text-lg">No products found matching the criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('ALL');
            }}
            className="text-primary font-bold border-b border-primary pb-0.5"
          >
            Clear Filters & Search
          </button>
        </div>
      )}

      {/* Section 5: Pagination */}
      {filteredProducts.length > visibleLimit && (
        <div className="flex flex-col items-center gap-6 mb-section-v">
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-[0.2em] text-xs">
            Viewing {displayedProducts.length} of {filteredProducts.length} products
          </p>
          <div className="w-64 h-1 bg-surface-variant rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(displayedProducts.length / filteredProducts.length) * 100}%` }}
            ></div>
          </div>
          <button 
            onClick={handleLoadMore}
            className="px-12 py-4 border-2 border-primary text-primary font-button text-button hover:bg-primary hover:text-on-primary transition-all active:scale-95 rounded-lg uppercase tracking-widest text-xs font-bold"
          >
            LOAD MORE PIECES
          </button>
        </div>
      )}
    </main>
  );
};
