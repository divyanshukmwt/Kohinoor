'use client';

import { useEffect, useRef } from 'react';

/**
 * SVGCurves
 * Animated decorative SVG line elements.
 * Used as editorial accents throughout the site.
 */
export function SVGCurve({ className = '' }) {
  const pathRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!pathRef.current) return;

      const length = pathRef.current.getTotalLength?.() ?? 600;
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: pathRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
    setup();
  }, []);

  return (
    <svg
      className={`w-full overflow-visible ${className}`}
      viewBox="0 0 800 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d="M0,100 C100,20 200,180 400,100 C600,20 700,180 800,100"
        stroke="currentColor"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function SVGDiamond({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 2 L58 30 L30 58 L2 30 Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M30 10 L50 30 L30 50 L10 30 Z"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.4"
      />
    </svg>
  );
}

export function SVGOrbit({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <line x1="5" y1="60" x2="115" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="60" y1="5" x2="60" y2="115" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}
