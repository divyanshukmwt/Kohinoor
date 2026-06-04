'use client';

import { useRef, useEffect } from 'react';
import ProductCard from './ProductCard';

/**
 * ProductGrid
 * Renders a responsive grid of ProductCards.
 * Supports scroll-triggered reveal animations.
 */
export default function ProductGrid({ products, columns = 3, className = '' }) {
  const gridRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!gridRef.current) return;

      const cards = gridRef.current.querySelectorAll('article');

      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
    setup();
  }, [products]);

  const colClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-bodoni text-[24px] italic text-outline">No pieces found</p>
        <p className="font-inter text-[13px] text-outline/60 mt-3">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className={`grid ${colClass} gap-8 ${className}`}
    >
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
