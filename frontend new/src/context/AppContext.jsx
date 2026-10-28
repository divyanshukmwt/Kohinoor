import React, { createContext, useState, useEffect, useCallback } from 'react';
import { products as initialProducts } from '../data/products';
import {
  fetchProducts,
  syncCartAdd,
  syncCartClear,
  submitOrder,
} from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kohinoor_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kohinoor_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => {
      setToast((current) => (current === message ? null : current));
    }, 2800);
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingProducts(true);

    fetchProducts()
      .then((serverProducts) => {
        if (active && Array.isArray(serverProducts) && serverProducts.length > 0) {
          setProducts(serverProducts);
        }
      })
      .finally(() => {
        if (active) setLoadingProducts(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('kohinoor_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kohinoor_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleCart = () => setCartOpen((prev) => !prev);
  const toggleSearch = () => setSearchOpen((prev) => !prev);
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const toggleConcierge = () => setConciergeOpen((prev) => !prev);

  const addToCart = (product, quantity = 1, selectedLength = 'Standard', openDrawer = true) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedLength === selectedLength
      );
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: newCart[existingIdx].quantity + quantity,
        };
        return newCart;
      }
      return [...prevCart, { product, quantity, selectedLength }];
    });

    syncCartAdd(product.id, quantity);

    if (openDrawer) {
      setCartOpen(true);
    } else {
      showToast(`Added "${product.name}" to your bag`);
    }
  };

  const removeFromCart = (productId, selectedLength) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedLength === selectedLength)
      )
    );
  };

  const updateCartQty = (productId, selectedLength, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedLength);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedLength === selectedLength
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleWishlist = (productId) => {
    setWishlist((prevList) => {
      const exists = prevList.includes(productId);
      const next = exists ? prevList.filter((id) => id !== productId) : [...prevList, productId];
      showToast(exists ? 'Removed from wishlist' : 'Saved to wishlist');
      return next;
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const clearCart = () => {
    setCart([]);
    syncCartClear();
  };

  const placeOrder = async (customerDetails) => {
    const res = await submitOrder(customerDetails);
    clearCart();
    return res;
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        products,
        loadingProducts,
        cart,
        wishlist,
        cartOpen,
        searchOpen,
        drawerOpen,
        conciergeOpen,
        toast,
        showToast,
        setCartOpen,
        setSearchOpen,
        setDrawerOpen,
        setConciergeOpen,
        toggleCart,
        toggleSearch,
        toggleDrawer,
        toggleConcierge,
        addToCart,
        removeFromCart,
        updateCartQty,
        toggleWishlist,
        isInWishlist,
        clearCart,
        placeOrder,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-primary text-on-primary px-5 py-2.5 rounded-full shadow-md text-xs font-medium tracking-wider uppercase transition-opacity duration-200">
          {toast}
        </div>
      )}
    </AppContext.Provider>
  );
};
