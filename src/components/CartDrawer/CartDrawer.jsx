import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, cartTotal, isDrawerOpen, closeDrawer } = useCart();
  const { convert, format } = useCurrency();

  const handleCheckout = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-lightGray">
              <h2 className="text-2xl font-playfair font-semibold">Shopping Cart ({items.length})</h2>
              <button
                onClick={closeDrawer}
                className="text-charcoal hover:text-primary transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-20 h-20 mx-auto text-mutedGray mb-4" strokeWidth={1.5} />
                  <p className="text-mutedGray mb-4">Your cart is empty</p>
                  <button
                    onClick={() => {
                      closeDrawer();
                      navigate('/search');
                    }}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div 
                      key={item.cartId} 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 border-b border-lightGray pb-4"
                    >
                      <Link to={`/product/${item.id}`} onClick={closeDrawer}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link 
                          to={`/product/${item.id}`} 
                          onClick={closeDrawer}
                          className="font-semibold text-charcoal hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-mutedGray">{item.metal}</p>
                        {item.attributes?.size && (
                          <p className="text-xs text-mutedGray">Size: {item.attributes.size}</p>
                        )}
                        <p className="text-primary font-semibold mt-1">
                          {format(convert(item.price * item.quantity))}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="w-6 h-6 border border-lightGray rounded flex items-center justify-center hover:bg-lightGray transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="w-6 h-6 border border-lightGray rounded flex items-center justify-center hover:bg-lightGray transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-mutedGray hover:text-errorRed transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-lightGray p-6">
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold">Subtotal:</span>
                  <span className="text-xl font-bold text-primary">
                    {format(convert(cartTotal))}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
