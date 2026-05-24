'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * EditorialSection
 * Full-width asymmetric editorial layout.
 * Optionally reverses the image/text layout.
 */
export default function EditorialSection({
  tag,
  headline,
  subHeadline,
  body,
  ctaText,
  ctaHref,
  imageSrc,
  imageAlt,
  reverse = false,
  dark = false,
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      const textEls = sectionRef.current.querySelectorAll('.editorial-text-reveal');
      const imgEl = sectionRef.current.querySelector('.editorial-img-reveal');

      gsap.fromTo(
        textEls,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      if (imgEl) {
        gsap.fromTo(
          imgEl,
          { opacity: 0, scale: 1.05 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }
    setup();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-28 md:py-40 px-6 md:px-[80px] relative overflow-hidden ${
        dark ? 'bg-matte-black text-ivory-base' : 'bg-ivory-base text-on-background'
      }`}
    >
      {/* Decorative SVG */}
      <svg
        className="absolute top-20 -right-20 w-64 h-64 opacity-5 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="80" stroke={dark ? '#E2C9A1' : '#735c00'} strokeWidth="0.5" />
        <circle cx="100" cy="100" r="50" stroke={dark ? '#E2C9A1' : '#735c00'} strokeWidth="0.5" />
        <line x1="20" y1="100" x2="180" y2="100" stroke={dark ? '#E2C9A1' : '#735c00'} strokeWidth="0.5" />
        <line x1="100" y1="20" x2="100" y2="180" stroke={dark ? '#E2C9A1' : '#735c00'} strokeWidth="0.5" />
      </svg>

      <div className="max-w-[1440px] mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center ${
            reverse ? 'lg:grid-flow-col-dense' : ''
          }`}
        >
          {/* Text Block */}
          <div className={`lg:col-span-5 ${reverse ? 'lg:col-start-8' : ''}`}>
            {tag && (
              <p className="editorial-text-reveal font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-6">
                {tag}
              </p>
            )}
            {headline && (
              <h2 className="editorial-text-reveal font-bodoni text-[clamp(28px,4vw,52px)] leading-tight mb-6">
                {headline}
              </h2>
            )}
            {subHeadline && (
              <p className="editorial-text-reveal font-bodoni italic text-[clamp(18px,2.5vw,28px)] text-tertiary mb-6 leading-snug">
                {subHeadline}
              </p>
            )}
            {body && (
              <p className={`editorial-text-reveal font-inter text-[16px] leading-8 max-w-md mb-10 ${dark ? 'text-ivory-base/70' : 'text-on-surface-variant'}`}>
                {body}
              </p>
            )}
            {ctaText && ctaHref && (
              <div className="editorial-text-reveal">
                <Link href={ctaHref} className="btn-ghost">
                  <span>{ctaText}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Image Block */}
          <div className={`lg:col-span-7 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            <div className="editorial-img-reveal relative aspect-[4/5] overflow-hidden clip-asymmetric">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
