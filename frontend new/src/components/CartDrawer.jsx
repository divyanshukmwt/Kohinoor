import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export const CartDrawer = () => {
  const {
    cart,
    cartOpen,
    toggleCart,
    updateCartQty,
    removeFromCart,
    getCartTotal,
    getCartCount,
    placeOrder,
    showToast,
  } = useContext(AppContext);

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'form' | 'confirmed'
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleQtyChange = (productId, selectedLength, currentQty, delta) => {
    updateCartQty(productId, selectedLength, currentQty + delta);
  };

  const handleClose = () => {
    toggleCart();
    setTimeout(() => {
      if (checkoutStep === 'confirmed') {
        setCheckoutStep('cart');
        setConfirmedOrder(null);
      }
    }, 200);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const totalSnapshot = getCartTotal();
      const res = await placeOrder({
        customerName,
        customerEmail,
        shippingAddress,
      });
      setConfirmedOrder({
        id: res?.order?.id || 'ord_confirmed',
        total: res?.order?.total || totalSnapshot,
        customerName,
      });
      setCheckoutStep('confirmed');
      showToast('Order placed successfully');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Cart Overlay */}
      <div
        className={`fixed inset-0 bg-black/35 z-[70] transition-opacity duration-200 ${
          cartOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Cart Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-[80] w-full md:w-96 bg-surface shadow-xl transition-transform duration-200 ease-out flex flex-col ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-outline-variant/60 flex justify-between items-center bg-surface">
          <h3 className="font-display text-lg font-semibold text-on-surface">
            {checkoutStep === 'form'
              ? 'Shipping Details'
              : checkoutStep === 'confirmed'
              ? 'Order Confirmed'
              : `Your Bag (${getCartCount()})`}
          </h3>
          <button
            className="material-symbols-outlined hover:text-primary transition-colors"
            onClick={handleClose}
          >
            close
          </button>
        </div>

        {/* Step 1: Cart Items list */}
        {checkoutStep === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-surface">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant gap-3">
                  <span className="material-symbols-outlined text-4xl text-outline">
                    shopping_bag
                  </span>
                  <p className="font-body text-base">Your bag is currently empty</p>
                  <button
                    onClick={handleClose}
                    className="text-primary text-xs font-bold uppercase tracking-wider border-b border-primary pb-0.5"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedLength}-${idx}`}
                    className="flex gap-3.5 border-b border-outline-variant/30 pb-5 last:border-b-0"
                  >
                    <img
                      className="w-20 h-24 object-cover rounded bg-surface-container flex-shrink-0"
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-bold text-xs uppercase tracking-wider truncate">
                            {item.product.name}
                          </p>
                          <button
                            className="material-symbols-outlined text-on-surface-variant/70 hover:text-primary text-base"
                            onClick={() => removeFromCart(item.product.id, item.selectedLength)}
                          >
                            delete
                          </button>
                        </div>
                        <p className="text-on-surface-variant text-xs mt-1">
                          Size: {item.selectedLength} · Anti-Tarnish
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-outline-variant rounded bg-surface-container h-7 px-2 justify-between w-24">
                          <button
                            className="text-primary text-xs font-bold px-1"
                            onClick={() =>
                              handleQtyChange(
                                item.product.id,
                                item.selectedLength,
                                item.quantity,
                                -1
                              )
                            }
                          >
                            −
                          </button>
                          <span className="font-bold text-xs">{item.quantity}</span>
                          <button
                            className="text-primary text-xs font-bold px-1"
                            onClick={() =>
                              handleQtyChange(
                                item.product.id,
                                item.selectedLength,
                                item.quantity,
                                1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-sm text-primary">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 bg-surface-container-low border-t border-outline-variant/60 space-y-3">
                <div className="flex justify-between font-bold text-base text-on-surface">
                  <span>Subtotal</span>
                  <span className="text-primary">₹{getCartTotal().toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Complimentary insured shipping included.
                </p>
                <button
                  onClick={() => setCheckoutStep('form')}
                  className="w-full bg-primary text-white py-3.5 rounded font-button text-xs font-bold hover:bg-primary/90 transition-colors tracking-widest uppercase"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 2: Checkout Details Form */}
        {checkoutStep === 'form' && (
          <form onSubmit={handleOrderSubmit} className="flex-1 flex flex-col justify-between p-5">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
              >
                ← Back to Bag
              </button>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-sm focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="aarav@example.com"
                  className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-sm focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows={3}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House/Flat No., Street, City, PIN Code"
                  className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-sm focus:border-primary outline-none"
                />
              </div>

              <div className="p-3.5 rounded bg-surface-container text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Order Total</span>
                  <span className="font-bold text-primary">
                    ₹{getCartTotal().toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="font-semibold text-on-surface">FREE</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-3.5 rounded font-button text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors tracking-widest uppercase"
            >
              {submitting ? 'CONFIRMING ORDER...' : 'CONFIRM ORDER'}
            </button>
          </form>
        )}

        {/* Step 3: Order Confirmed */}
        {checkoutStep === 'confirmed' && confirmedOrder && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <span className="material-symbols-outlined text-4xl text-primary">verified</span>
            <h4 className="font-display text-xl font-bold text-primary">
              Thank You, {confirmedOrder.customerName || 'Valued Guest'}
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your order <span className="font-semibold text-on-surface">#{confirmedOrder.id}</span>{' '}
              for{' '}
              <span className="font-semibold text-primary">
                ₹{Number(confirmedOrder.total || 0).toLocaleString('en-IN')}
              </span>{' '}
              has been confirmed and is being prepared at our atelier.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-3 bg-primary text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
