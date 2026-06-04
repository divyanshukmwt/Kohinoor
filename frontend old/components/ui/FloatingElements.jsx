'use client';

import { useEffect, useRef } from 'react';

/**
 * FloatingCard
 * Glass-panel floating stat/feature card with hover lift.
 */
export function FloatingCard({ icon, title, body, className = '' }) {
  return (
    <div className={`glass-panel p-7 hover-lift shadow-glass ${className}`}>
      {icon && (
        <div className="w-11 h-11 rounded-full border border-champagne-gold/40 flex items-center justify-center mb-5 text-tertiary">
          {icon}
        </div>
      )}
      <h4 className="font-inter text-[11px] uppercase tracking-[0.1em] text-on-background mb-2">
        {title}
      </h4>
      <p className="font-inter text-[13px] leading-6 text-on-surface-variant">
        {body}
      </p>
    </div>
  );
}

/**
 * FloatingStat
 * Oversized number stat with label, used in hero/editorial overlays.
 */
export function FloatingStat({ number, label, className = '' }) {
  return (
    <div className={`glass-panel px-8 py-6 ${className}`}>
      <p className="font-bodoni text-[42px] text-on-background leading-none">
        {number}
      </p>
      <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mt-1.5">
        {label}
      </p>
    </div>
  );
}

/**
 * FloatingElements
 * Animated parallax floating decorative shapes.
 */
export function FloatingElements({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');

      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll('[data-float]');
      elements.forEach((el, i) => {
        const yRange = parseFloat(el.dataset.float) || 20;
        gsap.to(el, {
          y: `${yRange}px`,
          duration: 3 + i * 0.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.5,
        });
      });
    }
    setup();
  }, []);

  return (
    <div ref={containerRef} className={`pointer-events-none ${className}`}>
      {/* Orbiting circle */}
      <div
        data-float="-18"
        className="absolute top-1/4 right-1/4 w-20 h-20 rounded-full border border-champagne-gold/15"
      />
      {/* Small dot */}
      <div
        data-float="12"
        className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-champagne-gold/20"
      />
      {/* Large circle */}
      <div
        data-float="-10"
        className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full border border-champagne-gold/8"
      />
    </div>
  );
}
