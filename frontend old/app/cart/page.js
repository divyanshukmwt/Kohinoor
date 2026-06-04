'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import useCartStore from '@/store/cartStore';
import { formatPrice } from '@/utils/helpers';
import { createOrder } from '@/services/orders';

export default function CartPage() {
  const {
    items, increaseQuantity, decreaseQuantity,
    removeFromCart, getSubtotal, clearCart,
  } = useCartStore();
  const subtotal  = getSubtotal();
  const [placing, setPlacing] = useState(false);
  const [orderDone, setOrderDone] = useState(null);

  const handleCheckout = async () => {
    setPlacing(true);
    try {
      const result = await createOrder({});
      if (result.success) {
        clearCart();
        setOrderDone(result.order);
      }
    } catch (err) {
      console.error('[CartPage] checkout error:', err);
    } finally {
      setPlacing(false);
    }
  };

  if (orderDone) {
    return (
      <div className="min-h-screen bg-ivory-base flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="w-20 h-20 rounded-full border border-champagne-gold/30 flex items-center justify-center mx-auto mb-8">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E2C9A1" strokeWidth="1.2"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <p className="font-bodoni text-[32px] text-on-background mb-3">Order Placed</p>
          <p className="font-inter text-[14px] text-outline mb-2">Order ID: {orderDone.id}</p>
          <p className="font-inter text-[14px] text-outline mb-10">We will be in touch shortly.</p>
          <Link href="/shop" className="btn-primary inline-flex justify-center"><span>Continue Shopping</span></Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory-base pt-28 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-bodoni text-[28px] text-on-background mb-3">Your bag is empty</p>
          <p className="font-inter text-[15px] text-outline mb-10">Explore our collection to find your heirloom.</p>
          <Link href="/shop" className="btn-primary inline-flex"><span>Explore Collection</span></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-base pt-28">
      <div className="px-6 md:px-[80px] pt-12 pb-32 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-14">
          <div>
            <h1 className="font-bodoni text-[clamp(36px,5vw,72px)] text-on-background leading-tight">Your Bag</h1>
            <p className="font-inter text-[13px] text-outline mt-1">{items.length} {items.length === 1 ? 'piece' : 'pieces'}</p>
          </div>
          <button onClick={clearCart} className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-error transition-colors duration-300">
            Clear Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Items */}
          <div className="lg:col-span-7">
            <div className="border-t border-champagne-gold/15">
              {items.map((item) => {
                const imgSrc = item.images?.[0]?.url || item.images?.[0] || '/images/placeholder.jpg';
                return (
                  <div key={item.cartItemId || item.id} className="flex gap-6 py-8 border-b border-champagne-gold/10">
                    <div className="relative w-24 h-28 flex-shrink-0 bg-soft-beige overflow-hidden">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mb-1">{item.category}</p>
                          <h3 className="font-inter text-[16px] font-medium text-on-background">{item.name}</h3>
                        </div>
                        <p className="font-bodoni text-[20px] text-on-background flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center border border-champagne-gold/20">
                          <button onClick={() => decreaseQuantity(item.id)} className="w-9 h-9 flex items-center justify-center text-outline hover:text-on-background transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="w-8 text-center font-inter text-[14px]">{item.quantity}</span>
                          <button onClick={() => increaseQuantity(item.id)} className="w-9 h-9 flex items-center justify-center text-outline hover:text-on-background transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="font-inter text-[11px] uppercase tracking-[0.08em] text-outline/50 hover:text-error transition-colors duration-300">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="bg-surface-container-low/30 p-8">
              <h2 className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mb-8">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between"><span className="font-inter text-[14px] text-on-surface-variant">Subtotal</span><span className="font-inter text-[14px] text-on-background">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="font-inter text-[14px] text-on-surface-variant">Shipping</span><span className="font-inter text-[14px] text-primary">Complimentary</span></div>
              </div>
              <div className="gold-line mb-6" />
              <div className="flex justify-between items-baseline mb-8">
                <span className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline">Total</span>
                <span className="font-bodoni text-[28px] text-on-background">{formatPrice(subtotal)}</span>
              </div>
              <button onClick={handleCheckout} disabled={placing} className="btn-primary w-full justify-center disabled:opacity-50">
                <span>{placing ? 'Placing Order...' : 'Proceed to Checkout'}</span>
              </button>
              <Link href="/shop" className="block text-center font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-on-background transition-colors duration-300 mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
