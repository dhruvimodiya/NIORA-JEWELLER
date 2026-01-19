import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import WishlistIcon from '../WishlistIcon/WishlistIcon';

const ProductCard = ({ product, variant = 'default' }) => {
  const { addToCart } = useCart();
  const { isInWishlist } = useWishlist();
  const { convert, format } = useCurrency();

  const convertedPrice = convert(product.price);

  // Search variant - vertical card with full details
  if (variant === 'search') {
    return (
      <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="block relative group">
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">Out of Stock</span>
              </div>
            )}
            {/* Wishlist Icon */}
            <div className="absolute top-3 right-3 z-10">
              <WishlistIcon product={product} />
            </div>
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category Label */}
          <p className="text-xs text-primary uppercase tracking-widest mb-2 font-medium">
            {product.category}
          </p>

          {/* Product Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-playfair text-lg md:text-xl font-semibold text-charcoal mb-2 hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-mutedGray mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Price and Metal */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-lightGray">
            <div>
              <span className="text-2xl font-bold text-charcoal">
                {format(convertedPrice)}
              </span>
            </div>
            <span className="text-sm text-mutedGray bg-ivory px-3 py-1 rounded-full">
              {product.metal}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={!product.inStock}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
              product.inStock
                ? 'bg-primary text-white hover:bg-secondary hover:shadow-lg'
                : 'bg-lightGray text-mutedGray cursor-not-allowed'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    );
  }

  // Default variant - original card design
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg overflow-hidden card-shadow relative group"
    >
      {/* Wishlist Icon */}
      <div className="absolute top-4 right-4 z-10">
        <WishlistIcon product={product} />
      </div>

      {/* Product Image - Clickable */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white/90 backdrop-blur-sm text-charcoal px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </span>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-mutedGray uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-playfair text-lg font-semibold text-charcoal mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-mutedGray mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-semibold text-primary">
            {format(convertedPrice)}
          </span>
          <span className="text-xs text-mutedGray">{product.metal}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          disabled={!product.inStock}
          className={`w-full py-2 rounded transition-all duration-300 ${
            product.inStock
              ? 'bg-primary text-white hover:bg-secondary'
              : 'bg-lightGray text-mutedGray cursor-not-allowed'
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
