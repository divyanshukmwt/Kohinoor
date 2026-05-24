'use client';

import { useEffect } from 'react';

export default function Providers({ children }) {
  useEffect(() => {
    async function init() {
      // Initialize GSAP plugins
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Initialize Lenis smooth scrolling
      const { default: Lenis } = await import('lenis');

      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.5,
      });

      // Sync Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      // Cleanup
      return () => {
        lenis.destroy();
      };
    }

    const cleanup = init();
    return () => {
      cleanup.then((fn) => fn?.());
    };
  }, []);

  return <>{children}</>;
}
