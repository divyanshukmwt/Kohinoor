import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const SearchOverlay = () => {
  const { searchOpen, toggleSearch, products } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    setQuery('');
    toggleSearch();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      toggleSearch();
      navigate(`/collections?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handlePopularSearch = (term) => {
    setQuery(term);
    toggleSearch();
    navigate(`/collections?search=${encodeURIComponent(term)}`);
  };

  const handleProductClick = (productId) => {
    toggleSearch();
    navigate(`/product/${productId}`);
  };

  const matchingProducts = query.trim()
    ? products
        .filter((p) => {
          const q = query.toLowerCase();
          return (
            (p.name || '').toLowerCase().includes(q) ||
            (p.category || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q) ||
            (p.tag || '').toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  return (
    <div
      className={`fixed inset-0 bg-surface/98 z-[90] flex-col p-6 transition-opacity duration-200 ${
        searchOpen ? 'opacity-100 visible flex' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className="max-w-3xl mx-auto w-full flex justify-between items-center mb-10">
        <span className="font-display text-xl font-bold text-primary tracking-widest">
          SEARCH CATALOGUE
        </span>
        <button
          className="material-symbols-outlined text-2xl hover:text-primary transition-colors"
          onClick={handleClose}
        >
          close
        </button>
      </div>

      <div className="max-w-3xl mx-auto w-full flex-1 overflow-y-auto">
        <form onSubmit={handleSearchSubmit}>
          <input
            className="w-full bg-transparent border-b-2 border-outline py-3 text-xl md:text-2xl focus:outline-none focus:border-primary transition-colors font-display"
            placeholder="Search by piece, stone, metal, or occasion..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={searchOpen}
          />
        </form>

        {query.trim() === '' ? (
          <div className="mt-8">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-widest mb-4">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Oxidized',
                'Solitaire',
                'Kundan',
                'Emerald',
                'Jhumka',
                'Rose Gold',
                'Platinum',
                'Daily Wear',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="px-4 py-2 bg-surface-container rounded-full text-xs cursor-pointer hover:bg-secondary-container transition-colors font-semibold text-on-surface"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-widest mb-4">
              Matching Pieces ({matchingProducts.length})
            </p>
            {matchingProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleProductClick(p.id)}
                    className="flex gap-3.5 p-2.5 border border-outline-variant/40 hover:border-primary/50 bg-surface-container-low rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-14 h-16 object-cover rounded bg-surface-container"
                    />
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="font-bold text-xs uppercase tracking-wider text-on-surface truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-on-surface-variant uppercase tracking-widest">
                        {p.category}
                      </p>
                      <p className="text-xs font-bold text-primary mt-1">
                        ₹{Number(p.price || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm">
                No pieces matched &ldquo;{query}&rdquo;.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
