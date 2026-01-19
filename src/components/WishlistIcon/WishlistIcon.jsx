import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const WishlistIcon = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={() => toggleWishlist(product)}
      className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className="w-5 h-5"
        fill={inWishlist ? '#D50032' : 'none'}
        stroke={inWishlist ? '#D50032' : '#111111'}
        strokeWidth={2}
      />
    </motion.button>
  );
};

export default WishlistIcon;
