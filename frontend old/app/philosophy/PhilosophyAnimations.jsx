'use client';

import { useEffect } from 'react';

export default function PhilosophyAnimations() {
  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Hero text reveals
      gsap.fromTo(
        '.philosophy-reveal',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.2,
          delay: 0.3,
        }
      );

      // Pillar cards
      gsap.fromTo(
        '.pillar-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.pillars-grid',
            start: 'top 80%',
          },
        }
      );
    }
    setup();
  }, []);

  return null;
}
