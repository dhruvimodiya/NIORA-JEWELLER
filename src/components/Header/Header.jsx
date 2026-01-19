import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Search, 
  Heart, 
  User, 
  ShoppingBag, 
  Menu 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { currency, changeCurrency, currencies } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic styles based on scroll and page
  const headerBg = isHomePage && !isScrolled 
    ? 'bg-transparent' 
    : 'bg-white shadow-md';
  const textColor = isHomePage && !isScrolled ? 'text-white' : 'text-charcoal';
  const logoColor = isHomePage && !isScrolled ? 'text-white drop-shadow-lg' : 'text-charcoal';

  return (
    <header
  className={`${isHomePage ? 'absolute' : 'sticky'} top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
>
  {/* ================= TOP BANNER ================= */}
  <div className="bg-primary/95 text-white py-2 backdrop-blur-sm">
    <div className="container mx-auto px-4 flex items-center justify-between">
      {/* Social Icons */}
      <div className="hidden md:flex items-center space-x-3">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
          <Instagram className="w-4 h-4" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
          <Facebook className="w-4 h-4" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Twitter">
          <Twitter className="w-4 h-4" />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
          <Youtube className="w-4 h-4" />
        </a>
      </div>

      {/* Banner Text */}
      <p className="text-[10px] md:text-sm font-medium tracking-wider mx-auto">
        SIGNUP AND GET 10% OFF
      </p>

      {/* Country */}
      <span className="hidden md:block text-xs font-medium">
        {currencies[currency]?.country?.slice(0, 3).toUpperCase() || 'USA'}
      </span>
    </div>
  </div>

  {/* ================= MAIN HEADER ================= */}
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between py-4 md:py-6">

      {/* LEFT SIDE - Mobile Menu + Contact */}
      <div className="flex items-center gap-3">
        {/* MOBILE MENU */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden ${textColor} hover:opacity-80 transition-opacity`}
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* CONTACT - Hidden on mobile, visible on md+ */}
        <a
          href="mailto:contact@niora.com"
          className={`hidden md:flex items-center gap-2 ${textColor} hover:opacity-80 transition-opacity`}
          aria-label="Contact us"
        >
          <Mail className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-xs uppercase tracking-widest font-light">Contact</span>
        </a>
      </div>

      {/* LOGO */}
      <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
        <h1
          className={`text-2xl md:text-5xl font-playfair ${logoColor} tracking-widest transition-colors duration-300`}
          style={{ letterSpacing: '0.25em' }}
        >
          NIORA
        </h1>
      </Link>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-3 md:gap-5">

        {/* Currency (Desktop only) */}
        <select
          value={currency}
          onChange={(e) => changeCurrency(e.target.value)}
          className={`hidden md:block text-xs bg-transparent border ${isHomePage && !isScrolled ? 'border-white/30 text-white' : 'border-charcoal/30 text-charcoal'} rounded px-2 py-1 focus:outline-none focus:border-primary`}
          aria-label="Select currency"
        >
          {Object.keys(currencies).map((curr) => (
            <option key={curr} value={curr} className="bg-white text-charcoal">
              {curr}
            </option>
          ))}
        </select>

        {/* Wishlist */}
        <Link to="/wishlist" className={`relative ${textColor} hover:opacity-80 transition-opacity`} aria-label="Wishlist">
          <Heart className="w-5 h-5" strokeWidth={1.5} />
          {wishlistCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-light"
            >
              {wishlistCount}
            </motion.span>
          )}
        </Link>

        {/* Cart */}
        <button onClick={openDrawer} className={`relative ${textColor} hover:opacity-80 transition-opacity`} aria-label="Shopping cart">
          <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-light"
            >
              {cartCount}
            </motion.span>
          )}
        </button>

        {/* User */}
        {isAuthenticated ? (
          <div className="relative group">
            <button className={`${textColor} hover:opacity-80 transition-opacity`} aria-label="Account">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>
            {/* Invisible bridge to keep dropdown open */}
            <div className="absolute right-0 top-full h-2 w-full hidden group-hover:block" />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <p className="px-4 py-2 text-sm text-mutedGray border-b border-lightGray">Hello, {user?.name}</p>
              <Link 
                to="/wishlist" 
                className="block w-full text-left px-4 py-2 text-sm hover:bg-lightGray text-charcoal transition-colors"
              >
                My Wishlist
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-lightGray text-errorRed transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className={`${textColor} hover:opacity-80 transition-opacity`} aria-label="Login">
            <User className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        )}
      </div>
    </div>

    {/* ================= DESKTOP NAV ================= */}
    <nav className="hidden lg:flex justify-center space-x-10 pb-6">
      <Link
        to="/"
        className={`text-xs ${textColor} uppercase tracking-widest font-light hover:opacity-80 transition-opacity`}
      >
        New Arrival
      </Link>
      <Link
        to="/search"
        className={`text-xs ${textColor} uppercase tracking-widest font-light hover:opacity-80 transition-opacity`}
      >
        Custom Jewellery
      </Link>
      <a
        href="#try-home"
        className={`text-xs ${textColor} uppercase tracking-widest font-light hover:opacity-80 transition-opacity`}
      >
        Try at Home
      </a>
      <a
        href="#education"
        className={`text-xs ${textColor} uppercase tracking-widest font-light hover:opacity-80 transition-opacity`}
      >
        Education Hub
      </a>
      <a
        href="#about"
        className={`text-xs ${textColor} uppercase tracking-widest font-light hover:opacity-80 transition-opacity`}
      >
        About Us
      </a>
    </nav>

    {/* ================= MOBILE MENU ================= */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <motion.nav
            className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-lightGray">
              <h2 className="text-xl font-playfair text-charcoal tracking-wider">MENU</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal hover:text-primary transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contact Link - Mobile Only */}
            <div className="px-6 py-4 border-b border-lightGray">
              <a
                href="mailto:contact@niora.com"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-charcoal hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium">Contact Us</p>
                  <p className="text-xs text-mutedGray">contact@niora.com</p>
                </div>
              </a>
            </div>

            {/* Navigation Links */}
            <div className="px-6 py-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-sm text-charcoal uppercase tracking-widest font-light hover:text-primary transition-colors border-b border-lightGray/50"
              >
                New Arrival
              </Link>
              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-sm text-charcoal uppercase tracking-widest font-light hover:text-primary transition-colors border-b border-lightGray/50"
              >
                Custom Jewellery
              </Link>
              <a
                href="#try-home"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-sm text-charcoal uppercase tracking-widest font-light hover:text-primary transition-colors border-b border-lightGray/50"
              >
                Try at Home
              </a>
              <a
                href="#education"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-sm text-charcoal uppercase tracking-widest font-light hover:text-primary transition-colors border-b border-lightGray/50"
              >
                Education Hub
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-sm text-charcoal uppercase tracking-widest font-light hover:text-primary transition-colors"
              >
                About Us
              </a>
            </div>

            {/* User Section - Mobile */}
            {isAuthenticated && (
              <div className="px-6 py-4 border-t border-lightGray">
                <p className="text-sm text-mutedGray mb-3">Hello, {user?.name}</p>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-charcoal hover:text-primary transition-colors"
                >
                  My Wishlist
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-sm text-errorRed hover:opacity-80 transition-opacity"
                >
                  Logout
                </button>
              </div>
            )}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</header>

  );
};

export default Header;
