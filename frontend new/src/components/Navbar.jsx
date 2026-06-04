import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const Navbar = () => {
  const { toggleDrawer, toggleSearch, toggleCart, getCartCount } = useContext(AppContext);
  const location = useLocation();

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Announcement Bar */}
      <section className="bg-primary-container text-white py-2 px-margin-mobile text-center">
        <p className="font-label-md text-label-md tracking-widest uppercase">
          FREE SHIPPING ON ALL ORDERS ABOVE ₹799
        </p>
      </section>

      {/* TopAppBar & Sticky Nav */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-margin-mobile md:px-gutter-desktop h-16 w-full bg-surface border-b border-outline-variant shadow-[0_40px_40px_rgba(43,27,23,0.05)] transition-all duration-300">
        <div className="flex items-center gap-4">
          <button 
            className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform" 
            onClick={toggleDrawer}
          >
            menu
          </button>
          <Link to="/" className="font-display-lg text-headline-md text-primary tracking-widest">
            KOHINOOR
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/collections" 
            className={`font-label-md text-label-md transition-colors duration-300 ${
              isLinkActive('/collections') 
                ? 'text-primary border-b-2 border-outline' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            New Arrivals
          </Link>
          <Link 
            to="/collections?category=NECKLACES" 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300"
          >
            Necklaces
          </Link>
          <Link 
            to="/collections?category=EARRINGS" 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300"
          >
            Earrings
          </Link>
          <Link 
            to="/collections?category=RINGS" 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300"
          >
            Rings
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform" 
            onClick={toggleSearch}
          >
            search
          </button>
          
          <button 
            className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform relative" 
            onClick={toggleCart}
          >
            shopping_bag
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
