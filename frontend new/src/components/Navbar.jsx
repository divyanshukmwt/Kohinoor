import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const Navbar = () => {
  const { toggleDrawer, toggleSearch, toggleCart, toggleConcierge, getCartCount } =
    useContext(AppContext);
  const location = useLocation();

  const isLinkActive = (path) => location.pathname === path;

  return (
    <>
      {/* Announcement Bar */}
      <section className="bg-primary-container text-white py-2 px-margin-mobile text-center">
        <p className="font-label-md text-[11px] tracking-widest uppercase">
          FREE INSURED SHIPPING ON ALL ORDERS ABOVE ₹799 · ANTI-TARNISH GUARANTEE
        </p>
      </section>

      {/* TopAppBar & Sticky Nav */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-margin-mobile md:px-gutter-desktop h-16 w-full bg-surface/95 backdrop-blur-sm border-b border-outline-variant/60 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <button
            className="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleDrawer}
            aria-label="Open menu"
          >
            menu
          </button>
          <Link to="/" className="font-display text-xl md:text-2xl font-bold text-primary tracking-widest">
            KOHINOOR
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/collections"
            className={`font-label-md text-xs uppercase tracking-widest transition-colors duration-200 py-1 ${
              isLinkActive('/collections') && !location.search
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            All Collections
          </Link>
          <Link
            to="/collections?category=NECKLACES"
            className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Necklaces
          </Link>
          <Link
            to="/collections?category=EARRINGS"
            className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Earrings
          </Link>
          <Link
            to="/collections?category=RINGS"
            className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Rings
          </Link>
          <Link
            to="/collections?category=BRACELETS"
            className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Bracelets
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={toggleConcierge}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/80 text-primary hover:bg-secondary-container/60 transition-colors duration-200 text-xs font-semibold tracking-wider uppercase"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>AI Stylist</span>
          </button>

          <button
            className="material-symbols-outlined text-primary cursor-pointer hover:opacity-75 transition-opacity p-1"
            onClick={toggleSearch}
            aria-label="Search jewellery"
          >
            search
          </button>

          <button
            className="material-symbols-outlined text-primary cursor-pointer hover:opacity-75 transition-opacity relative p-1"
            onClick={toggleCart}
            aria-label="Open shopping bag"
          >
            shopping_bag
            {getCartCount() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body font-bold">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
