import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const CartDrawer = () => {
  const { 
    cart, 
    cartOpen, 
    toggleCart, 
    updateCartQty, 
    removeFromCart, 
    getCartTotal, 
    getCartCount 
  } = useContext(AppContext);

  const handleQtyChange = (productId, selectedLength, currentQty, delta) => {
    updateCartQty(productId, selectedLength, currentQty + delta);
  };

  const handleCheckout = () => {
    alert("Thank you for your order! Checkout functionality is simulated for this frontend demo.");
  };

  return (
    <>
      {/* Cart Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[70] transition-opacity duration-300 ${
          cartOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`} 
        onClick={toggleCart}
      ></div>

      {/* Cart Sidebar */}
      <aside 
        className={`fixed inset-y-0 right-0 z-[80] w-full md:w-96 bg-surface shadow-2xl transition-transform duration-300 flex flex-col ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface">
          <h3 className="font-headline-md text-headline-md">Your Bag ({getCartCount()})</h3>
          <button 
            className="material-symbols-outlined hover:text-primary transition-colors" 
            onClick={toggleCart}
          >
            close
          </button>
        </div>

        {/* Cart Items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant gap-4">
              <span className="material-symbols-outlined text-5xl">shopping_bag</span>
              <p className="font-body-lg text-body-lg">Your bag is empty</p>
              <button 
                onClick={toggleCart}
                className="text-primary font-bold border-b border-primary pb-0.5"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div 
                key={`${item.product.id}-${item.selectedLength}-${idx}`} 
                className="flex gap-4 border-b border-outline-variant/30 pb-6 last:border-b-0"
              >
                <img 
                  className="w-20 h-24 object-cover rounded-lg bg-surface-container" 
                  src={item.product.images[0]} 
                  alt={item.product.name}
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="font-bold uppercase tracking-wider text-sm">{item.product.name}</p>
                      <button 
                        className="material-symbols-outlined text-on-surface-variant/70 hover:text-primary text-lg"
                        onClick={() => removeFromCart(item.product.id, item.selectedLength)}
                      >
                        delete
                      </button>
                    </div>
                    <p className="text-on-surface-variant text-xs mt-1">
                      Length: {item.selectedLength} / Anti-Tarnish
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-outline-variant rounded bg-surface-container h-8 px-2 justify-between w-24">
                      <button 
                        className="text-primary text-xs" 
                        onClick={() => handleQtyChange(item.product.id, item.selectedLength, item.quantity, -1)}
                      >
                        remove
                      </button>
                      <span className="font-bold text-xs">{item.quantity}</span>
                      <button 
                        className="text-primary text-xs" 
                        onClick={() => handleQtyChange(item.product.id, item.selectedLength, item.quantity, 1)}
                      >
                        add
                      </button>
                    </div>
                    <p className="font-semibold text-primary">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal */}
        {cart.length > 0 && (
          <div className="p-6 bg-surface-container-low border-t border-outline-variant space-y-4 shadow-[0_-10px_30px_rgba(43,27,23,0.02)]">
            <div className="flex justify-between font-bold text-lg text-on-surface">
              <span>Subtotal</span>
              <span className="text-primary">₹{getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-on-surface-variant">Taxes and shipping calculated at checkout.</p>
            <button 
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-4 rounded-[4px] font-button text-button hover:opacity-90 transition-opacity tracking-widest uppercase"
            >
              CHECKOUT NOW
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
