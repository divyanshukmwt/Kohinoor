import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer id="care-guide" className="bg-tertiary text-surface py-section-v px-margin-mobile md:px-gutter-desktop grid grid-cols-1 md:grid-cols-3 gap-12 w-full mt-auto">
      <div className="space-y-6">
        <span className="font-display-lg text-headline-md text-surface-bright tracking-widest block">
          KOHINOOR
        </span>
        <p className="text-surface-variant max-w-sm opacity-80 font-body-md leading-relaxed text-sm">
          Bridging the gap between ancient Indian heritage and contemporary luxury. Our jewelry is designed for the modern woman who values tradition and effortless style.
        </p>
        <div className="flex gap-4">
          <a 
            href="#share" 
            className="w-10 h-10 rounded-full border border-surface-variant/30 flex items-center justify-center hover:bg-surface-variant/10 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">share</span>
          </a>
          <a 
            href="#instagram" 
            className="w-10 h-10 rounded-full border border-surface-variant/30 flex items-center justify-center hover:bg-surface-variant/10 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-label-md text-label-md text-secondary-fixed font-bold uppercase tracking-widest">
            Collections
          </h4>
          <ul className="space-y-2 text-surface-variant font-body-md text-sm">
            <li>
              <Link to="/collections" className="hover:text-secondary-fixed transition-colors">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/collections?category=NECKLACES" className="hover:text-secondary-fixed transition-colors">
                Necklaces
              </Link>
            </li>
            <li>
              <Link to="/collections?category=EARRINGS" className="hover:text-secondary-fixed transition-colors">
                Earrings
              </Link>
            </li>
            <li>
              <Link to="/collections?category=RINGS" className="hover:text-secondary-fixed transition-colors">
                Rings
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-label-md text-label-md text-secondary-fixed font-bold uppercase tracking-widest">
            Customer Care
          </h4>
          <ul className="space-y-2 text-surface-variant font-body-md text-sm">
            <li>
              <a href="#shipping" className="hover:text-secondary-fixed transition-colors">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#returns" className="hover:text-secondary-fixed transition-colors">
                Returns &amp; Refunds
              </a>
            </li>
            <li>
              <a href="#care" className="hover:text-secondary-fixed transition-colors">
                Care Guide
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-secondary-fixed transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="font-label-md text-label-md text-secondary-fixed font-bold uppercase tracking-widest">
          Visit Our Studio
        </h4>
        <p className="text-surface-variant font-body-md text-sm leading-relaxed">
          A-12, Heritage Plaza, <br/>Udaipur, Rajasthan 313001
        </p>
        <p className="text-surface-variant font-body-md text-sm">
          support@kohinoorjewelry.com<br/>+91 98765 43210
        </p>
        <div className="pt-6 border-t border-surface-variant/20">
          <p className="text-xs text-surface-variant/60 font-label-md tracking-widest uppercase">
            © {new Date().getFullYear()} KOHINOOR JEWELRY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};
