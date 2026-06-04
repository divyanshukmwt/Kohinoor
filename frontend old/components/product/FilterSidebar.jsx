'use client';

import { CATEGORIES, PRICE_RANGES, MATERIALS } from '@/data/products';

/**
 * FilterSidebar
 * Shop page filter controls for category, price, material.
 */
export default function FilterSidebar({ filters, onChange }) {
  const handleCategory = (id) => onChange({ ...filters, category: id });

  const handlePrice = (range) => {
    const isSame = filters.priceMin === range.min && filters.priceMax === range.max;
    if (isSame) {
      onChange({ ...filters, priceMin: undefined, priceMax: undefined, priceRangeId: undefined });
    } else {
      onChange({ ...filters, priceMin: range.min, priceMax: range.max, priceRangeId: range.id });
    }
  };

  const handleMaterial = (id) => {
    const current = filters.materials || [];
    const updated = current.includes(id) ? current.filter((m) => m !== id) : [...current, id];
    onChange({ ...filters, materials: updated });
  };

  const clearAll = () => onChange({ category: 'all' });
  const hasActiveFilters =
    (filters.category && filters.category !== 'all') ||
    filters.priceRangeId ||
    (filters.materials && filters.materials.length > 0);

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-3 border-b border-champagne-gold/15">
        <h3 className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline">
          Refine
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="font-inter text-[10px] uppercase tracking-[0.08em] text-primary hover:opacity-70 transition-opacity"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-10">
        <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline/50 mb-4">
          Category
        </p>
        <ul className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => handleCategory(cat.id)}
                className={`w-full text-left font-inter text-[14px] transition-colors duration-300 flex justify-between items-center group ${
                  filters.category === cat.id
                    ? 'text-primary font-medium'
                    : 'text-on-surface-variant hover:text-on-background'
                }`}
              >
                <span>{cat.label}</span>
                {filters.category === cat.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range Filter */}
      <div className="mb-10">
        <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline/50 mb-4">
          Price
        </p>
        <ul className="space-y-2.5">
          {PRICE_RANGES.map((range) => (
            <li key={range.id}>
              <button
                onClick={() => handlePrice(range)}
                className={`w-full text-left font-inter text-[14px] transition-colors duration-300 flex items-center gap-3 ${
                  filters.priceRangeId === range.id
                    ? 'text-primary font-medium'
                    : 'text-on-surface-variant hover:text-on-background'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                    filters.priceRangeId === range.id
                      ? 'border-primary bg-primary'
                      : 'border-outline/30'
                  }`}
                >
                  {filters.priceRangeId === range.id && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Material Filter */}
      <div className="mb-10">
        <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline/50 mb-4">
          Material
        </p>
        <ul className="space-y-2.5">
          {MATERIALS.map((mat) => {
            const active = (filters.materials || []).includes(mat.id);
            return (
              <li key={mat.id}>
                <button
                  onClick={() => handleMaterial(mat.id)}
                  className={`w-full text-left font-inter text-[14px] transition-colors duration-300 flex items-center gap-3 ${
                    active ? 'text-primary font-medium' : 'text-on-surface-variant hover:text-on-background'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                      active ? 'border-primary bg-primary' : 'border-outline/30'
                    }`}
                  >
                    {active && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  {mat.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Gold divider */}
      <div className="gold-line" />
    </aside>
  );
}
