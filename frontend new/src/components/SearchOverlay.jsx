import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { products } from '../data/products';

export const SearchOverlay = () => {
  const { searchOpen, toggleSearch } = useContext(AppContext);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    setQuery("");
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

  // Filter matching products
  const matchingProducts = query.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div 
      className={`fixed inset-0 bg-surface/98 z-[90] flex-col p-6 transition-all duration-300 ${
        searchOpen ? 'opacity-100 visible flex' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className="flex justify-between items-center mb-12">
        <span className="font-display-lg text-headline-md text-primary tracking-widest">SEARCH</span>
        <button 
          className="material-symbols-outlined text-3xl hover:text-primary transition-colors" 
          onClick={handleClose}
        >
          close
        </button>
      </div>

      <div className="max-w-2xl mx-auto w-full flex-1">
        <form onSubmit={handleSearchSubmit}>
          <input 
            className="w-full bg-transparent border-b-2 border-outline py-4 text-2xl focus:outline-none focus:border-primary transition-colors font-display" 
            placeholder="Search for collections, stones, or styles..." 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={searchOpen}
          />
        </form>

        {query.trim() === "" ? (
          <div className="mt-8">
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-4">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {["Oxidized", "Gold Plated", "Boho", "Ring", "Jhumka", "Necklace"].map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="px-4 py-2 bg-surface-container rounded-full text-sm cursor-pointer hover:bg-secondary-container transition-colors font-medium text-on-surface"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-4">
              Matching Products
            </p>
            {matchingProducts.length > 0 ? (
              <div className="space-y-4">
                {matchingProducts.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => handleProductClick(p.id)}
                    className="flex gap-4 p-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors"
                  >
                    <img 
                      src={p.images[0]} 
                      alt={p.name}
                      className="w-12 h-16 object-cover rounded bg-surface-container"
                    />
                    <div className="flex flex-col justify-center">
                      <p className="font-bold text-sm uppercase tracking-wider text-on-surface">{p.name}</p>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest">{p.category}</p>
                      <p className="text-sm font-semibold text-primary mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant italic">No products matched your search term.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
