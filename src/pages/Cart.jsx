import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { convert, format } = useCurrency();
  const { isAuthenticated } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleCheckout = () => {
    // Check if user is logged in first
    if (!isAuthenticated) {
      toast.error('Please login first to proceed with checkout');
      setTimeout(() => {
        navigate('/login', { state: { from: '/cart' } });
      }, 1000);
      return;
    }

    // Then check if terms are agreed
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions to proceed');
      return;
    }
    
    // Proceed with checkout
    toast.success('Proceeding to checkout...');
    // Add your checkout logic here
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-32 h-32 mx-auto text-mutedGray mb-6" strokeWidth={1} />
          <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-mutedGray mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button onClick={() => navigate('/search')} className="btn-primary">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-playfair font-bold text-charcoal mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {items.map((item) => (
              <motion.div
                key={item.cartId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-6 border-b border-lightGray pb-6 mb-6 last:border-b-0 last:mb-0 last:pb-0"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-playfair font-semibold text-charcoal mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-mutedGray mb-1">{item.category}</p>
                  <p className="text-sm text-mutedGray mb-3">{item.metal}</p>
                  
                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="w-8 h-8 border border-lightGray rounded flex items-center justify-center hover:bg-lightGray transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="w-8 h-8 border border-lightGray rounded flex items-center justify-center hover:bg-lightGray transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-errorRed hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-xl font-semibold text-primary mb-2">
                    {format(convert(item.price * item.quantity))}
                  </p>
                  <p className="text-sm text-mutedGray">
                    {format(convert(item.price))} each
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-errorRed hover:underline text-sm mt-4"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-playfair font-semibold text-charcoal mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-mutedGray">Subtotal</span>
                <span className="font-semibold">{format(convert(cartTotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedGray">Shipping</span>
                <span className="font-semibold text-successGreen">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedGray">Tax</span>
                <span className="font-semibold">{format(convert(cartTotal * 0.1))}</span>
              </div>
              <div className="border-t border-lightGray pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {format(convert(cartTotal * 1.1))}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-mutedGray group-hover:text-charcoal transition-colors">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">
                    terms and conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    privacy policy
                  </a>
                </span>
              </label>
            </div>

            <button 
              onClick={handleCheckout}
              className={`w-full btn-primary mb-4 ${!agreedToTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => navigate('/search')}
              className="w-full btn-outline"
            >
              Continue Shopping
            </button>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-lightGray">
              <div className="space-y-3 text-sm text-mutedGray">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-successGreen" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-successGreen" />
                  <span>Free Shipping Over $500</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-successGreen" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
