import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const NavigationDrawer = () => {
  const { drawerOpen, toggleDrawer } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    toggleDrawer();
    navigate(path);
  };

  return (
    <>
      {/* Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[55] transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`} 
        onClick={toggleDrawer}
      ></div>

      {/* Navigation Drawer Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[60] flex flex-col h-full w-80 bg-surface shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <span className="font-display-lg text-headline-md text-primary">KOHINOOR</span>
          <button 
            className="material-symbols-outlined hover:text-primary transition-colors" 
            onClick={toggleDrawer}
          >
            close
          </button>
        </div>

        <div className="flex flex-col py-4 overflow-y-auto space-y-1">
          <button 
            onClick={() => handleLinkClick('/collections')}
            className="flex items-center gap-4 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-variant rounded-full text-left transition-all"
          >
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <span className="font-body-lg text-body-lg">New Arrivals</span>
          </button>
          
          <button 
            onClick={() => handleLinkClick('/collections?category=NECKLACES')}
            className="flex items-center gap-4 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-variant rounded-full text-left transition-all"
          >
            <span className="material-symbols-outlined">diamond</span>
            <span className="font-body-lg text-body-lg">Necklaces</span>
          </button>
          
          <button 
            onClick={() => handleLinkClick('/collections?category=EARRINGS')}
            className="flex items-center gap-4 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-variant rounded-full text-left transition-all"
          >
            <span className="material-symbols-outlined">auto_fix_high</span>
            <span className="font-body-lg text-body-lg">Earrings</span>
          </button>
          
          <button 
            onClick={() => handleLinkClick('/collections?category=RINGS')}
            className="flex items-center gap-4 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-variant rounded-full text-left transition-all"
          >
            <span className="material-symbols-outlined">adjust</span>
            <span className="font-body-lg text-body-lg">Rings</span>
          </button>
          
          <button 
            onClick={() => handleLinkClick('/collections?category=BRACELETS')}
            className="flex items-center gap-4 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-variant rounded-full text-left transition-all"
          >
            <span className="material-symbols-outlined">circle</span>
            <span className="font-body-lg text-body-lg">Bracelets</span>
          </button>

          <a 
            href="#care-guide"
            onClick={toggleDrawer}
            className="flex items-center gap-4 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-variant rounded-full text-left transition-all"
          >
            <span className="material-symbols-outlined">verified</span>
            <span className="font-body-lg text-body-lg">Care Guide</span>
          </a>
        </div>
      </aside>
    </>
  );
};
