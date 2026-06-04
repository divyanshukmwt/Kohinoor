'use client';

import Link from 'next/link';
import { FOOTER_LINKS, SITE_CONFIG } from '@/constants/navigation';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-matte-black text-ivory-base/80">
      {/* Top Editorial Strip */}
      <div className="border-b border-champagne-gold/10 px-6 md:px-[80px] py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link
              href="/"
              className="font-bodoni text-[28px] text-ivory-base uppercase tracking-tighter block mb-6"
            >
              AURELIA LORE
            </Link>
            <p className="font-inter text-[14px] leading-7 text-ivory-base/60 max-w-xs mb-8">
              Uncompromising artisanal excellence. Heirlooms crafted in our Geneva atelier,
              destined for generations yet to come.
            </p>
            <div className="flex gap-4">
              <a
                href={SITE_CONFIG.social.instagram}
                className="font-inter text-[11px] uppercase tracking-[0.1em] text-champagne-gold/70 hover:text-champagne-gold transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <span className="text-champagne-gold/20">·</span>
              <a
                href={SITE_CONFIG.social.pinterest}
                className="font-inter text-[11px] uppercase tracking-[0.1em] text-champagne-gold/70 hover:text-champagne-gold transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pinterest
              </a>
            </div>
          </div>

          {/* Link Groups */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="font-inter text-[11px] uppercase tracking-[0.1em] text-champagne-gold/50 mb-6">
              Collections
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.collections.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-[14px] text-ivory-base/60 hover:text-ivory-base transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-inter text-[11px] uppercase tracking-[0.1em] text-champagne-gold/50 mb-6">
              The House
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.house.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-[14px] text-ivory-base/60 hover:text-ivory-base transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-inter text-[11px] uppercase tracking-[0.1em] text-champagne-gold/50 mb-6">
              Client Services
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.client.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-[14px] text-ivory-base/60 hover:text-ivory-base transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-champagne-gold/10 px-6 md:px-[80px] py-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="font-bodoni text-[20px] italic text-ivory-base mb-1">
              Join the Atelier
            </p>
            <p className="font-inter text-[13px] text-ivory-base/50">
              Private collection previews, craft stories, rare finds.
            </p>
          </div>
          <form className="flex gap-0 w-full md:w-auto max-w-sm" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border-b border-champagne-gold/30 px-0 py-3 font-inter text-[13px] text-ivory-base placeholder:text-ivory-base/30 placeholder:uppercase placeholder:tracking-[0.08em] placeholder:text-[11px] outline-none focus:border-champagne-gold/60 transition-colors duration-300"
            />
            <button
              type="submit"
              className="ml-6 font-inter text-[11px] uppercase tracking-[0.1em] text-champagne-gold hover:text-ivory-base transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe →
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-6 md:px-[80px] py-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-inter text-[11px] text-ivory-base/30 uppercase tracking-[0.08em]">
            © {year} Aurelia Lore. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-inter text-[11px] text-ivory-base/30 uppercase tracking-[0.08em] hover:text-ivory-base/60 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="font-inter text-[11px] text-ivory-base/30 uppercase tracking-[0.08em] hover:text-ivory-base/60 transition-colors">
              Terms
            </Link>
            <span className="font-inter text-[11px] text-ivory-base/30 uppercase tracking-[0.08em]">
              Geneva, Switzerland
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
