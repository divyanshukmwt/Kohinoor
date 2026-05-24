'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { NAV_LINKS } from '@/constants/navigation';

export default function Navbar() {
  const navRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openDrawer, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handleScroll = () => {
      if (window.scrollY > 80) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav ref={navRef} className="fixed top-0 w-full z-50 bg-transparent border-b border-champagne-gold/10 transition-all duration-700">
        <div className="flex justify-between items-center px-6 md:px-[80px] py-6 w-full max-w-[1440px] mx-auto">
          {/* Left links */}
          <div className="hidden md:flex gap-8 items-center">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <Link key={link.href} href={link.href} className="font-inter text-[12px] font-semibold uppercase tracking-[0.1em] text-on-background opacity-75 hover:opacity-100 hover:text-primary transition-all duration-500">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link href="/" className="font-bodoni text-[20px] tracking-tighter text-on-background uppercase absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 flex-shrink-0">
            AURELIA LORE
          </Link>

          {/* Right */}
          <div className="flex items-center gap-6 md:gap-8">
            <div className="hidden md:flex gap-8">
              {NAV_LINKS.slice(2).map((link) => (
                <Link key={link.href} href={link.href} className="font-inter text-[12px] font-semibold uppercase tracking-[0.1em] text-on-background opacity-75 hover:opacity-100 hover:text-primary transition-all duration-500">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Cart */}
            <button onClick={openDrawer} className="relative flex items-center justify-center w-8 h-8 text-on-background hover:text-primary transition-colors duration-500" aria-label={`Shopping bag — ${itemCount} items`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-on-primary text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu btn */}
            <button className="md:hidden flex flex-col gap-1.5 items-end" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              <span className={`block h-px bg-on-background transition-all duration-300 ${mobileMenuOpen ? 'w-5 rotate-45 translate-y-[7px]' : 'w-5'}`} />
              <span className={`block h-px bg-on-background transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 w-0' : 'w-3.5'}`} />
              <span className={`block h-px bg-on-background transition-all duration-300 ${mobileMenuOpen ? 'w-5 -rotate-45 -translate-y-[7px]' : 'w-5'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 bg-ivory-base flex flex-col justify-center px-8 transition-all duration-700 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col gap-8">
          {NAV_LINKS.map((link, i) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
              className="font-bodoni text-[40px] text-on-background hover:text-primary transition-colors duration-500"
              style={{ transitionDelay: mobileMenuOpen ? `${i * 60}ms` : '0ms' }}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-16 font-inter text-[12px] uppercase tracking-[0.1em] text-outline">
          atelier@aurelialore.com
        </div>
      </div>
    </>
  );
}
