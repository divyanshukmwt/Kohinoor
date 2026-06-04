'use client';

import { useState } from 'react';

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'materials', label: 'Materials & Care' },
  { id: 'delivery', label: 'Delivery & Returns' },
];

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="mt-12 border-t border-champagne-gold/20">
      {/* Tab Headers */}
      <div className="flex gap-0 border-b border-champagne-gold/20">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative py-4 pr-8 font-inter text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${
              activeTab === tab.id
                ? 'text-on-background'
                : 'text-outline hover:text-on-background'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-8 h-px bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === 'description' && (
          <div className="space-y-4 max-w-lg">
            <p className="font-inter text-[15px] leading-7 text-on-surface-variant">
              {product.description}
            </p>
            {product.dimensions && (
              <div className="mt-6 pt-6 border-t border-champagne-gold/10">
                <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mb-2">
                  Dimensions
                </p>
                <p className="font-inter text-[14px] text-on-surface-variant">
                  {product.dimensions}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6 max-w-lg">
            <div>
              <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mb-3">
                Materials
              </p>
              <ul className="space-y-2">
                {product.materials?.map((mat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-champagne-gold mt-2 flex-shrink-0" />
                    <span className="font-inter text-[14px] text-on-surface-variant">{mat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-champagne-gold/10">
              <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mb-3">
                Care Instructions
              </p>
              <p className="font-inter text-[14px] text-on-surface-variant leading-7">
                Store each piece individually in the provided pouch. Clean with a soft, lint-free cloth.
                Avoid exposure to chemicals, perfumes, and extreme temperatures. Professional
                cleaning recommended annually.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-6 max-w-lg">
            {[
              { label: 'Complimentary Delivery', value: 'All orders ship free, fully insured, via secure courier.' },
              { label: 'Delivery Time', value: '3–5 business days. Bespoke pieces: 8–14 weeks.' },
              { label: 'Returns', value: 'Unworn pieces may be returned within 30 days in original packaging.' },
              { label: 'Certificate of Authenticity', value: 'Each piece ships with a certificate of authenticity and provenance documentation.' },
            ].map((item) => (
              <div key={item.label} className="flex gap-6 py-5 border-b border-champagne-gold/10">
                <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline w-40 flex-shrink-0">
                  {item.label}
                </p>
                <p className="font-inter text-[14px] text-on-surface-variant leading-6">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
