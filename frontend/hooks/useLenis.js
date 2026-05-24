'use client';

import { useEffect } from 'react';

/**
 * useLenis — Initialize Lenis smooth scrolling
 * Call once at the root level (e.g. RootLayout or Providers)
 */
export function useLenis() {
  useEffect(() => {
    let lenis;
    let rafId;

    async function init() {
      const { default: Lenis } = await import('lenis');

      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      });

      // Integrate with GSAP ScrollTrigger if available
      try {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        lenis.on('scroll', ScrollTrigger.update);
      } catch {
        // ScrollTrigger not registered yet — that's fine
      }

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }

    init();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);
}
