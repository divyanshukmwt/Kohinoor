'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { formatPrice } from '@/utils/helpers';

export default function CartDrawer() {
  const drawerRef  = useRef(null);
  const overlayRef = useRef(null);

  const {
    isDrawerOpen, closeDrawer,
    items, increaseQuantity, decreaseQuantity, removeFromCart,
    getSubtotal, getItemCount,
  } = useCartStore();

  const subtotal  = getSubtotal();
  const itemCount = getItemCount();

  // GSAP open/close animation
  useEffect(() => {
    async function animate() {
      const { gsap } = await import('gsap');
      if (!drawerRef.current || !overlayRef.current) return;

      if (isDrawerOpen) {
        document.body.style.overflow = 'hidden';
        gsap.set(overlayRef.current, { display: 'block' });
        gsap.set(drawerRef.current, { display: 'flex' });
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        gsap.fromTo(drawerRef.current, { x: '100%' }, { x: '0%', duration: 0.7, ease: 'power3.out' });
      } else {
        document.body.style.overflow = '';
        gsap.to(overlayRef.current, {
          opacity: 0, duration: 0.3, ease: 'power2.in',
          onComplete: () => { if (overlayRef.current) overlayRef.current.style.display = 'none'; },
        });
        gsap.to(drawerRef.current, {
          x: '100%', duration: 0.5, ease: 'power2.in',
          onComplete: () => { if (drawerRef.current) drawerRef.current.style.display = 'none'; },
        });
      }
    }
    animate();
  }, [isDrawerOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[60] drawer-overlay hidden cursor-pointer"
        onClick={closeDrawer}
        aria-hidden="true"
        style={{ background: 'rgba(18,18,18,0.4)', backdropFilter: 'blur(4px)' }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-ivory-base z-[70] flex-col hidden shadow-deep"
        style={{ transform: 'translateX(100%)' }}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-7 border-b border-champagne-gold/15">
          <div>
            <h2 className="font-bodoni text-[22px] text-on-background">Your Bag</h2>
            <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mt-0.5">
              {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
            </p>
          </div>
          <button onClick={closeDrawer} className="w-9 h-9 flex items-center justify-center text-on-background/50 hover:text-on-background transition-colors" aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full border border-champagne-gold/30 flex items-center justify-center mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-outline">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="font-bodoni text-[18px] italic text-on-background mb-2">Your bag is empty</p>
              <p className="font-inter text-[13px] text-outline mb-8">Begin your collection</p>
              <button onClick={closeDrawer} className="font-inter text-[11px] uppercase tracking-[0.1em] text-primary border-b border-primary pb-0.5">
                Explore Collections →
              </button>
            </div>
          ) : (
            <ul className="space-y-8">
              {items.map((item) => {
                const imgSrc = item.images?.[0]?.url || item.images?.[0] || '/images/placeholder.jpg';
                return (
                  <li key={item.cartItemId || item.id} className="flex gap-5">
                    <div className="relative w-20 h-24 flex-shrink-0 bg-soft-beige overflow-hidden">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-inter text-[14px] font-medium text-on-background truncate">{item.name}</h3>
                          <p className="font-inter text-[11px] uppercase tracking-[0.08em] text-outline mt-0.5">{item.category}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-outline/50 hover:text-error transition-colors flex-shrink-0" aria-label={`Remove ${item.name}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4 border border-champagne-gold/20">
                          <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center text-on-background/50 hover:text-on-background transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="font-inter text-[13px] w-4 text-center">{item.quantity}</span>
                          <button onClick={() => increaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center text-on-background/50 hover:text-on-background transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                        <p className="font-inter text-[14px] font-medium text-on-background">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-8 border-t border-champagne-gold/15">
            <div className="gold-line mb-6" />
            <div className="flex justify-between items-center mb-2">
              <span className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline">Subtotal</span>
              <span className="font-bodoni text-[22px] text-on-background">{formatPrice(subtotal)}</span>
            </div>
            <p className="font-inter text-[11px] text-outline/60 mb-8">Shipping and duties calculated at checkout</p>
            <Link href="/cart" onClick={closeDrawer} className="btn-primary w-full justify-center block text-center py-4">
              <span>View Bag & Checkout</span>
            </Link>
            <button onClick={closeDrawer} className="w-full mt-4 font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-on-background transition-colors text-center">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
