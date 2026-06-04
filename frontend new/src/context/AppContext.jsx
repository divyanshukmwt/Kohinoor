import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kohinoor_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('kohinoor_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kohinoor_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kohinoor_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleCart = () => setCartOpen(prev => !prev);
  const toggleSearch = () => setSearchOpen(prev => !prev);
  const toggleDrawer = () => setDrawerOpen(prev => !prev);

  const addToCart = (product, quantity = 1, selectedLength = "16\"") => {
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.product.id === product.id && item.selectedLength === selectedLength);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: newCart[existingIdx].quantity + quantity
        };
        return newCart;
      }
      return [...prevCart, { product, quantity, selectedLength }];
    });
    setCartOpen(true); // Auto-open cart drawer on item add
  };

  const removeFromCart = (productId, selectedLength) => {
    setCart(prevCart => prevCart.filter(item => !(item.product.id === productId && item.selectedLength === selectedLength)));
  };

  const updateCartQty = (productId, selectedLength, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedLength);
      return;
    }
    setCart(prevCart => prevCart.map(item => 
      (item.product.id === productId && item.selectedLength === selectedLength) 
        ? { ...item, quantity } 
        : item
    ));
  };

  const toggleWishlist = (productId) => {
    setWishlist(prevList => {
      if (prevList.includes(productId)) {
        return prevList.filter(id => id !== productId);
      }
      return [...prevList, productId];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      cartOpen,
      searchOpen,
      drawerOpen,
      setCartOpen,
      setSearchOpen,
      setDrawerOpen,
      toggleCart,
      toggleSearch,
      toggleDrawer,
      addToCart,
      removeFromCart,
      updateCartQty,
      toggleWishlist,
      isInWishlist,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </AppContext.Provider>
  );
};
