/**
 * Cart Store — Éclat Platform
 * 
 * Unified Zustand cart store used by both:
 *   - Main UI (Navbar badge, CartDrawer, cart page)
 *   - Chatbot widget (ProductCardMini "Add to Bag")
 * 
 * Persisted to localStorage. Syncs to backend non-blockingly.
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addToCart as addToCartAPI, removeCartItem, updateCartItem } from '@/services/cart';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      isSyncing: false,

      // ── Drawer ───────────────────────────────────────────────────────────
      openDrawer:  () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

      // ── Add to Cart ──────────────────────────────────────────────────────
      /**
       * Add product to cart with optimistic update + backend sync.
       * Works from both main UI and chatbot widget.
       */
      addToCart: (product) => {
        // Optimistic
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...product, cartItemId: `${product.id}-${Date.now()}`, quantity: 1 },
            ],
          };
        });

        // Sync to backend (non-blocking)
        addToCartAPI(product.id, 1).catch((err) =>
          console.warn('[CartStore] Backend sync failed:', err.message)
        );
      },

      // ── Add full "complete look" ─────────────────────────────────────────
      addLookToCart: (products) => {
        products.forEach((product) => get().addToCart(product));
      },

      // ── Remove ──────────────────────────────────────────────────────────
      removeFromCart: (productId) => {
        const item = get().items.find((i) => i.id === productId);
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
        if (item?.cartItemId) {
          removeCartItem(item.cartItemId).catch(() => {});
        }
      },

      // ── Quantity ─────────────────────────────────────────────────────────
      increaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
        const item = get().items.find((i) => i.id === productId);
        if (item?.cartItemId) {
          updateCartItem(item.cartItemId, item.quantity + 1).catch(() => {});
        }
      },

      decreaseQuantity: (productId) => {
        const item = get().items.find((i) => i.id === productId);
        if (!item) return;
        if (item.quantity <= 1) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
          ),
        }));
        if (item?.cartItemId) {
          updateCartItem(item.cartItemId, item.quantity - 1).catch(() => {});
        }
      },

      // ── Clear ────────────────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ── Derived ─────────────────────────────────────────────────────────
      getItemCount: () => get().items.reduce((t, i) => t + i.quantity, 0),
      getSubtotal:  () => get().items.reduce((t, i) => t + (i.price || 0) * i.quantity, 0),
      isInCart:     (productId) => get().items.some((i) => i.id === productId),
    }),
    {
      name: 'eclat-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
