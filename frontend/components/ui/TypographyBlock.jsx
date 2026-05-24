'use client';

import { useEffect, useRef } from 'react';

/**
 * TypographyBlock
 * Oversized editorial text block with animated reveal.
 * Used for section intros and philosophical statements.
 */
export default function TypographyBlock({
  tag,
  line1,
  line2,
  line3,
  body,
  align = 'left',
  size = 'xl',
  dark = false,
  className = '',
}) {
  const blockRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!blockRef.current) return;

      const lines = blockRef.current.querySelectorAll('.type-line');

      gsap.fromTo(
        lines,
        { opacity: 0, y: 50, skewY: 1 },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: blockRef.current,
            start: 'top 80%',
          },
        }
      );

      const bodyEl = blockRef.current.querySelector('.type-body');
      if (bodyEl) {
        gsap.fromTo(
          bodyEl,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.5,
            scrollTrigger: {
              trigger: blockRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }
    setup();
  }, []);

  const fontSizeClass = {
    xl: 'text-[clamp(40px,6vw,88px)]',
    lg: 'text-[clamp(32px,4.5vw,64px)]',
    md: 'text-[clamp(24px,3.5vw,48px)]',
  }[size];

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <div
      ref={blockRef}
      className={`overflow-hidden ${alignClass} ${className}`}
    >
      {tag && (
        <p className="type-line font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-6">
          {tag}
        </p>
      )}
      {line1 && (
        <div className="overflow-hidden">
          <h2
            className={`type-line font-bodoni ${fontSizeClass} leading-[1.05] tracking-tight ${
              dark ? 'text-ivory-base' : 'text-on-background'
            }`}
          >
            {line1}
          </h2>
        </div>
      )}
      {line2 && (
        <div className="overflow-hidden">
          <h2
            className={`type-line font-bodoni italic font-light ${fontSizeClass} leading-[1.05] tracking-tight ${
              dark ? 'text-champagne-gold' : 'text-tertiary'
            }`}
          >
            {line2}
          </h2>
        </div>
      )}
      {line3 && (
        <div className="overflow-hidden">
          <h2
            className={`type-line font-bodoni ${fontSizeClass} leading-[1.05] tracking-tight ${
              dark ? 'text-ivory-base' : 'text-on-background'
            }`}
          >
            {line3}
          </h2>
        </div>
      )}
      {body && (
        <p
          className={`type-body font-inter text-[16px] leading-8 mt-8 max-w-xl ${
            align === 'center' ? 'mx-auto' : ''
          } ${dark ? 'text-ivory-base/65' : 'text-on-surface-variant'}`}
        >
          {body}
        </p>
      )}
    </div>
  );
}
