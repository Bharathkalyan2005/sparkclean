import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatIndianCurrency } from '../data/services';

const CartSidebar: React.FC = () => {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen, clearCart } = useCart();
  const navigate = useNavigate();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/book');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[8887]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="cart-sidebar glass-dark flex flex-col"
            style={{ zIndex: 8888 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="font-syne font-bold text-xl text-white">Your Cart</h2>
                <p className="text-white/40 text-sm font-dm">{items.length} service{items.length !== 1 ? 's' : ''} selected</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🧹</div>
                  <p className="text-white/40 font-dm">Your cart is empty</p>
                  <p className="text-white/20 font-dm text-sm mt-1">Add services to get started</p>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass rounded-xl p-4 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 glass-teal rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-dm font-medium text-white text-sm">{item.name}</p>
                      <p className="text-teal-400 text-sm font-semibold">
                        {item.id === 'svc-9' ? `₹${item.quantity}` : formatIndianCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - (item.id === 'svc-9' ? 5 : 1))}
                        className="w-7 h-7 glass rounded-md flex items-center justify-center text-white/60 hover:text-teal-400 text-sm"
                      >
                        −
                      </button>
                      <span className="text-white font-dm text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + (item.id === 'svc-9' ? 5 : 1))}
                        className="w-7 h-7 glass rounded-md flex items-center justify-center text-white/60 hover:text-teal-400 text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-1 w-7 h-7 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-dm">Total Amount</span>
                  <span className="font-syne font-bold text-2xl text-teal-400">{formatIndianCurrency(total)}</span>
                </div>

                <button onClick={handleCheckout} className="btn-teal w-full py-3.5 flex items-center justify-center gap-2 text-base">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Proceed to Book
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2.5 text-white/30 hover:text-red-400 text-sm font-dm transition-colors"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
