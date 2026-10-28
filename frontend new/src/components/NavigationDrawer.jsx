import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const NavigationDrawer = () => {
  const { drawerOpen, toggleDrawer, setConciergeOpen } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    toggleDrawer();
    navigate(path);
  };

  const handleOpenConcierge = () => {
    toggleDrawer();
    setConciergeOpen(true);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/35 z-[55] transition-opacity duration-200 ${
          drawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={toggleDrawer}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex flex-col h-full w-72 bg-surface shadow-xl transition-transform duration-200 ease-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-outline-variant/60 flex justify-between items-center">
          <span className="font-display text-xl font-bold text-primary tracking-widest">
            KOHINOOR
          </span>
          <button
            className="material-symbols-outlined hover:text-primary transition-colors"
            onClick={toggleDrawer}
          >
            close
          </button>
        </div>

        <div className="flex flex-col py-4 overflow-y-auto space-y-1">
          <button
            onClick={handleOpenConcierge}
            className="flex items-center gap-3.5 text-primary font-semibold mx-2 px-4 py-3 bg-surface-container rounded-lg text-left transition-colors"
          >
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <span className="font-body text-sm uppercase tracking-wider">AI Jewellery Stylist</span>
          </button>

          <button
            onClick={() => handleLinkClick('/collections')}
            className="flex items-center gap-3.5 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-container rounded-lg text-left transition-colors"
          >
            <span className="material-symbols-outlined text-primary">grid_view</span>
            <span className="font-body text-sm">All Collections</span>
          </button>

          <button
            onClick={() => handleLinkClick('/collections?category=NECKLACES')}
            className="flex items-center gap-3.5 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-container rounded-lg text-left transition-colors"
          >
            <span className="material-symbols-outlined">diamond</span>
            <span className="font-body text-sm">Necklaces</span>
          </button>

          <button
            onClick={() => handleLinkClick('/collections?category=EARRINGS')}
            className="flex items-center gap-3.5 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-container rounded-lg text-left transition-colors"
          >
            <span className="material-symbols-outlined">auto_fix_high</span>
            <span className="font-body text-sm">Earrings</span>
          </button>

          <button
            onClick={() => handleLinkClick('/collections?category=RINGS')}
            className="flex items-center gap-3.5 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-container rounded-lg text-left transition-colors"
          >
            <span className="material-symbols-outlined">adjust</span>
            <span className="font-body text-sm">Rings</span>
          </button>

          <button
            onClick={() => handleLinkClick('/collections?category=BRACELETS')}
            className="flex items-center gap-3.5 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-container rounded-lg text-left transition-colors"
          >
            <span className="material-symbols-outlined">circle</span>
            <span className="font-body text-sm">Bracelets</span>
          </button>

          <a
            href="#care-guide"
            onClick={toggleDrawer}
            className="flex items-center gap-3.5 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-container rounded-lg text-left transition-colors"
          >
            <span className="material-symbols-outlined">verified</span>
            <span className="font-body text-sm">Care Guide</span>
          </a>
        </div>
      </aside>
    </>
  );
};
