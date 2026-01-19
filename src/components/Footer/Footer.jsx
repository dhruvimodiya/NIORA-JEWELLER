import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Loader2, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubscribed(true);
    toast.success('Thank you for subscribing! Check your inbox for exclusive offers.');
    setEmail('');
    
    // Reset success state after 5 seconds
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <footer className="bg-white mt-20">
      {/* Newsletter Section */}
      <div className="bg-[#f5f5f5] py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-sm font-light text-charcoal uppercase tracking-[0.3em] mb-6">
            BECOME A MEMBER AND GET EXCLUSIVE DEALS
          </h3>
          <p className="text-xs text-mutedGray mb-6">Subscribe to our newsletter to stay in the loop.</p>
          
          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center gap-2 text-successGreen"
              >
                <Check className="w-6 h-6" />
                <span className="font-medium">You're subscribed! Check your inbox.</span>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleNewsletterSubmit} 
                className="flex max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email here."
                  className="flex-1 px-4 py-3 bg-white text-charcoal text-sm border border-gray-300 rounded-l-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  aria-label="Email for newsletter"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-secondary px-6 py-3 rounded-r-full transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Social */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-playfair text-charcoal mb-1">NIORA</h2>
            <p className="text-xs text-mutedGray mb-4 italic">Grown with love, worn with pride</p>
            <div className="flex space-x-2 justify-center md:justify-start">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-secondary transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-secondary transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-secondary transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-secondary transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold mb-4 text-charcoal uppercase tracking-wider">COMPANY</h4>
            <ul className="space-y-2 text-sm text-mutedGray">
              <li><a href="#" className="hover:text-primary transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Why we are different</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Lab grown diamonds</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Why us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Our purpose</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Story Glimpse</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold mb-4 text-charcoal uppercase tracking-wider">SUPPORT</h4>
            <ul className="space-y-2 text-sm text-mutedGray">
              <li><a href="#" className="hover:text-primary transition-colors">Chat Now</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Free Resizing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track your Order</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Education</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Review</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold mb-4 text-charcoal uppercase tracking-wider">SERVICES</h4>
            <ul className="space-y-2 text-sm text-mutedGray">
              <li><a href="#" className="hover:text-primary transition-colors">Free Shipping</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Lifetime Warranty</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Order Status</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cancellation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Certifications</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Buyback</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-mutedGray gap-4">
          {/* Payment Methods */}
          <div className="flex items-center space-x-3">
            <span className="text-charcoal font-medium text-xs">RuPay</span>
            <span className="text-charcoal font-medium text-xs">UPI</span>
            <span className="text-blue-800 font-bold text-sm">VISA</span>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              <div className="w-5 h-5 bg-yellow-400 rounded-full -ml-2"></div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p>© 2025 — Copyright All Right Reserved.</p>
          </div>

          {/* Privacy Policy */}
          <div className="text-center md:text-right">
            <a href="#" className="text-mutedGray hover:text-primary transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
