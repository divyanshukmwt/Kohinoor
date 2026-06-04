'use client';

import { useState, useRef, useEffect } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const sectionRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      gsap.fromTo(
        sectionRef.current.querySelectorAll('.nl-reveal'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }
    setup();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    // TODO: Replace with real API call → POST /api/newsletter
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('success');
    setEmail('');
  };

  return (
    <section
      ref={sectionRef}
      className="bg-matte-black py-28 px-6 md:px-[80px] relative overflow-hidden"
    >
      {/* Background decorative text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <p className="font-bodoni text-[20vw] text-white/[0.02] uppercase tracking-tighter leading-none">
          ATELIER
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
          <div>
            <p className="nl-reveal font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-6">
              The Inner Circle
            </p>
            <h2 className="nl-reveal font-bodoni text-[clamp(32px,4vw,56px)] text-ivory-base leading-tight mb-6">
              First access to rare{' '}
              <em className="italic font-light text-champagne-gold">pieces</em> &{' '}
              <em className="italic font-light text-champagne-gold">stories</em>
            </h2>
            <p className="nl-reveal font-inter text-[15px] leading-7 text-ivory-base/55 max-w-sm">
              Private previews. Craft journals. Invitations to atelier events.
              Curated for those who understand that true luxury is a relationship,
              not a transaction.
            </p>
          </div>

          <div className="nl-reveal">
            {status === 'success' ? (
              <div className="py-12">
                <div className="w-12 h-12 rounded-full border border-champagne-gold flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2C9A1" strokeWidth="1.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="font-bodoni text-[22px] italic text-ivory-base mb-2">Welcome to the atelier.</p>
                <p className="font-inter text-[14px] text-ivory-base/50">
                  You will hear from us soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label className="font-inter text-[11px] uppercase tracking-[0.1em] text-ivory-base/40">
                    Your email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-transparent border-b border-ivory-base/20 py-3 font-inter text-[16px] text-ivory-base placeholder:text-ivory-base/25 outline-none focus:border-champagne-gold/60 transition-colors duration-300"
                    placeholder="your@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary border-champagne-gold/30 text-ivory-base w-full justify-center relative overflow-hidden before:bg-champagne-gold hover:text-matte-black"
                >
                  <span>{status === 'loading' ? 'Joining...' : 'Join the Atelier'}</span>
                  {status !== 'loading' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </button>
                <p className="font-inter text-[11px] text-ivory-base/25 leading-5">
                  No spam, ever. Unsubscribe at any time. View our privacy policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
