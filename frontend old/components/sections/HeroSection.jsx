'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    async function animate() {
      const { gsap } = await import('gsap');

      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 60, skewY: 1 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.6, ease: 'expo.out' }
      )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
          '-=1.0'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          '-=0.8'
        );
    }

    animate();
  }, []);

  return (
    <header
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-matte-black">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiVfzwSl3dQsEoy05Mpggcx41gvqQkXvWxEv8-ii573O6nX9K6lndSE06NOZ5163yDTmHhYJfZIzCUwcDBkgkxpSwpQIO3igNgiqeIKO_Cu0YboQhfhRGVkVbfN8VeKxcnMqv5X40zsQj75EonLjpwfuYpx0jR5A7-wBILN69J0bmhdoW0F5Hdqso1Rz0gVD3JqHtsifA5t5jH0IAu5GXVDvTHzePXff07pASzX0uuCzQDhU7PqIdRabYx70MTBZG5H8dxqsyOGcRm"
          alt="Aurelia Lore hero — luxury jewellery editorial"
          fill
          className="object-cover object-center opacity-75"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-matte-black/30 via-transparent to-ivory-base/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-[80px] pt-24 max-w-4xl mx-auto">
        <p className="font-inter text-[11px] uppercase tracking-[0.2em] text-champagne-gold/80 mb-8">
          Geneva Atelier · Est. 2008
        </p>

        <h1
          ref={headlineRef}
          className="font-bodoni text-[clamp(40px,8vw,88px)] leading-[1.08] tracking-tight text-ivory-base mb-8"
          style={{ opacity: 0 }}
        >
          <em className="italic font-light">True</em> to Elegance,
          <br />
          Crafted for{' '}
          <em className="italic font-light">Eternity</em>
        </h1>

        <p
          ref={subtextRef}
          className="font-inter text-[17px] leading-8 text-ivory-base/75 mb-14 max-w-lg"
          style={{ opacity: 0 }}
        >
          Uncompromising artisanal excellence. We craft heirlooms that capture
          light and transcend generations.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-5 items-center"
          style={{ opacity: 0 }}
        >
          <Link href="/shop" className="btn-primary">
            <span>Explore Collection</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href="/philosophy"
            className="font-inter text-[12px] uppercase tracking-[0.1em] text-ivory-base/70 hover:text-ivory-base transition-colors duration-300"
          >
            Our Philosophy →
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-champagne-gold/50 animate-pulse" />
        <p className="font-inter text-[10px] uppercase tracking-[0.15em] text-champagne-gold/50">
          Scroll
        </p>
      </div>
    </header>
  );
}
