import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2, Frown, Check, X } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { convert, format } = useCurrency();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMetal, setSelectedMetal] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Available sizes and metals
  const sizes = ['5', '6', '7', '8', '9', '10'];
  const metals = ['Gold', 'White Gold', 'Rose Gold', 'Platinum'];

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const foundProduct = products.find(p => p.id === parseInt(id));
    
    setTimeout(() => {
      setProduct(foundProduct);
      if (foundProduct) {
        setSelectedMetal(foundProduct.metal);
      }
      setIsLoading(false);
    }, 300);
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize && product?.category === 'Rings') {
      alert('Please select a size');
      return;
    }

    addToCart(product, {
      size: selectedSize,
      metal: selectedMetal,
      quantity: quantity
    });
  };

  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  // Generate mock images for gallery
  const productImages = product ? [
    product.image,
    `${product.image}&angle=2`,
    `${product.image}&angle=3`,
    `${product.image}&angle=4`
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Frown className="w-24 h-24 mx-auto text-mutedGray mb-4" />
        <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4">Product Not Found</h2>
        <p className="text-mutedGray mb-6">The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/search')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  const convertedPrice = convert(product.price);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-mutedGray mb-8">
        <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/search')} className="hover:text-primary transition-colors">Shop</button>
        <span>/</span>
        <button onClick={() => navigate(`/search?category=${product.category}`)} className="hover:text-primary transition-colors">
          {product.category}
        </button>
        <span>/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square overflow-hidden rounded-lg bg-lightGray"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all"
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isInWishlist(product.id) ? 'text-primary fill-primary' : 'text-mutedGray'
                }`}
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                strokeWidth={1.5}
              />
            </button>

            {/* Stock Badge */}
            {!product.inStock && (
              <div className="absolute top-4 left-4 bg-errorRed text-white px-3 py-1 text-sm font-medium rounded">
                Out of Stock
              </div>
            )}
          </motion.div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={product.image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-primary uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-3">
              {product.name}
            </h1>
            <p className="text-mutedGray">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-primary">
              {format(convertedPrice)}
            </span>
            <span className="text-lg text-mutedGray line-through">
              {format(convertedPrice * 1.2)}
            </span>
            <span className="bg-primary/10 text-primary px-2 py-1 text-sm font-medium rounded">
              20% OFF
            </span>
          </div>

          {/* Shape & Metal Info */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-mutedGray">Shape:</span>
              <span className="ml-2 text-charcoal font-medium">{product.shape}</span>
            </div>
            <div>
              <span className="text-mutedGray">Metal:</span>
              <span className="ml-2 text-charcoal font-medium">{product.metal}</span>
            </div>
          </div>

          {/* Metal Selection */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-3">
              Select Metal Type
            </label>
            <div className="flex flex-wrap gap-3">
              {metals.map((metal) => (
                <button
                  key={metal}
                  onClick={() => setSelectedMetal(metal)}
                  className={`px-4 py-2 rounded border-2 text-sm font-medium transition-all ${
                    selectedMetal === metal
                      ? 'border-primary bg-primary text-white'
                      : 'border-lightGray hover:border-primary text-charcoal'
                  }`}
                >
                  {metal}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection (for Rings) */}
          {product.category === 'Rings' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-charcoal">
                  Select Size
                </label>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full border-2 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-lightGray hover:border-primary text-charcoal'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-lightGray rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-lightGray transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-lightGray font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-lightGray transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-4 rounded font-semibold text-sm tracking-wider transition-all ${
                product.inStock
                  ? 'bg-primary text-white hover:bg-secondary'
                  : 'bg-lightGray text-mutedGray cursor-not-allowed'
              }`}
            >
              {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                handleAddToCart();
                navigate('/cart');
              }}
              disabled={!product.inStock}
              className="flex-1 py-4 rounded border-2 border-primary text-primary font-semibold text-sm tracking-wider hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              BUY NOW
            </motion.button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-lightGray">
            <div className="flex items-center gap-3 text-sm text-mutedGray">
              <Check className="w-5 h-5 text-successGreen" />
              Free Shipping
            </div>
            <div className="flex items-center gap-3 text-sm text-mutedGray">
              <Check className="w-5 h-5 text-successGreen" />
              Lifetime Warranty
            </div>
            <div className="flex items-center gap-3 text-sm text-mutedGray">
              <Check className="w-5 h-5 text-successGreen" />
              30-Day Returns
            </div>
            <div className="flex items-center gap-3 text-sm text-mutedGray">
              <Check className="w-5 h-5 text-successGreen" />
              Certified Diamond
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl font-playfair font-bold text-charcoal mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-playfair font-bold text-charcoal">Ring Size Guide</h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-mutedGray hover:text-charcoal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-lightGray">
                    <th className="py-2 text-left text-mutedGray">US Size</th>
                    <th className="py-2 text-left text-mutedGray">Diameter (mm)</th>
                    <th className="py-2 text-left text-mutedGray">Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: '5', diameter: '15.7', circumference: '49.3' },
                    { size: '6', diameter: '16.5', circumference: '51.9' },
                    { size: '7', diameter: '17.3', circumference: '54.4' },
                    { size: '8', diameter: '18.1', circumference: '56.9' },
                    { size: '9', diameter: '18.9', circumference: '59.5' },
                    { size: '10', diameter: '19.8', circumference: '62.1' },
                  ].map((row) => (
                    <tr key={row.size} className="border-b border-lightGray">
                      <td className="py-3 font-medium">{row.size}</td>
                      <td className="py-3">{row.diameter}</td>
                      <td className="py-3">{row.circumference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-mutedGray mt-4">
                Tip: Use a piece of string to measure around your finger, then measure the string length.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
