'use client';

import { useEffect, useRef } from 'react';

/**
 * useGSAP — Safe GSAP hook for Next.js (client-side only)
 *
 * Registers and cleans up GSAP animations.
 * ScrollTrigger instances are automatically killed on unmount.
 *
 * @param {Function} callback - Animation setup function, receives { gsap, ScrollTrigger }
 * @param {Array} deps - Dependency array (like useEffect)
 * @param {Object} options
 * @param {string|Element} options.scope - Scoping container (optional)
 */
export function useGSAP(callback, deps = [], options = {}) {
  const scopeRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!isMounted) return;

      // Run the callback with gsap and ScrollTrigger
      const cleanup = callback({ gsap, ScrollTrigger });
      cleanupRef.current = cleanup;
    }

    setup();

    return () => {
      isMounted = false;

      // Run user-provided cleanup
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }

      // Kill ScrollTriggers associated with the scope
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((st) => {
          if (options.scope && scopeRef.current) {
            const trigger = st.trigger;
            if (trigger && scopeRef.current.contains(trigger)) {
              st.kill();
            }
          }
        });
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}

/**
 * useRevealOnScroll — Batch reveal animation for a list of elements
 *
 * @param {React.RefObject} containerRef - Container that holds the elements
 * @param {string} selector - CSS selector for elements to animate
 * @param {Object} config
 */
export function useRevealOnScroll(containerRef, selector = '.reveal', config = {}) {
  useEffect(() => {
    let ctx;

    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      ctx = gsap.context(() => {
        const elements = containerRef.current.querySelectorAll(selector);

        gsap.fromTo(
          elements,
          { opacity: 0, y: config.y ?? 50 },
          {
            opacity: 1,
            y: 0,
            duration: config.duration ?? 1,
            ease: config.ease ?? 'power3.out',
            stagger: config.stagger ?? 0.12,
            scrollTrigger: {
              trigger: containerRef.current,
              start: config.start ?? 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }, containerRef);
    }

    setup();

    return () => ctx?.revert();
  }, [containerRef, selector]);
}

/**
 * useParallax — Simple scroll parallax on an element
 *
 * @param {React.RefObject} elementRef
 * @param {number} yPercent - How far to move (negative = up on scroll)
 */
export function useParallax(elementRef, yPercent = -15) {
  useEffect(() => {
    let ctx;

    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!elementRef.current) return;

      ctx = gsap.context(() => {
        gsap.to(elementRef.current, {
          yPercent,
          ease: 'none',
          scrollTrigger: {
            trigger: elementRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }, elementRef);
    }

    setup();
    return () => ctx?.revert();
  }, [elementRef, yPercent]);
}
