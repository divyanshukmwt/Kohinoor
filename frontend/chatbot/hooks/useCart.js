/**
 * useCart Hook — Éclat Platform
 * Unified cart operations usable from chatbot widget and main UI.
 * Combines Zustand optimistic state with backend sync.
 */

import { useCallback } from 'react';
import useChatbotStore from '../store/useChatbotStore';
import { api, getSessionId } from '../utils/apiClient';

export function useCart() {
  const store = useChatbotStore();

  /**
   * Add a product to cart with optimistic update.
   * @param {Object} product - Full product object from recommendations
   */
  const addToCart = useCallback(async (product) => {
    await store.addToCart(product);
  }, [store]);

  /**
   * Remove a product from cart.
   * @param {string} productId
   */
  const removeFromCart = useCallback(async (productId) => {
    store.removeFromCart(productId);

    try {
      // Find item ID from backend (if needed)
      // For now, optimistic only — sync on next GET /cart
    } catch (err) {
      console.warn('[Cart] Remove sync failed:', err.message);
    }
  }, [store]);

  /**
   * Update quantity of a cart item.
   * @param {string} productId
   * @param {number} quantity
   */
  const updateQuantity = useCallback(async (productId, quantity) => {
    store.updateCartQuantity(productId, quantity);
  }, [store]);

  /**
   * Sync local cart with backend (call on cart open or page load).
   */
  const syncWithBackend = useCallback(async () => {
    try {
      const data = await api.get('/api/cart');
      if (data.success && data.cart?.items) {
        // Merge backend cart items into local state
        // The backend cart is the source of truth after sync
        const backendItems = data.cart.items.map((ci) => ({
          ...ci.product,
          cartItemId: ci.id,
          quantity:   ci.quantity,
        }));
        // Only update if meaningful difference
        if (backendItems.length > 0) {
          // Use the cartItems state if already populated optimistically
          // otherwise hydrate from backend
          if (store.cartItems.length === 0) {
            useChatbotStore.setState({ cartItems: backendItems });
          }
        }
      }
    } catch (err) {
      console.warn('[Cart] Sync failed:', err.message);
    }
  }, [store]);

  return {
    items:          store.cartItems,
    itemCount:      store.getCartCount(),
    subtotal:       store.getCartSubtotal(),
    notification:   store.cartNotification,
    isAdding:       store.isAddingToCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    syncWithBackend,
  };
}
