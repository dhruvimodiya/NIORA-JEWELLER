import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard/ProductCard';

const Wishlist = () => {
  const navigate = useNavigate();
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <Heart className="w-32 h-32 mx-auto text-mutedGray mb-6" strokeWidth={1} />
          <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4">
            Your Wishlist is Empty
          </h2>
          <p className="text-mutedGray mb-8">
            Save your favorite items here to view them later.
          </p>
          <button onClick={() => navigate('/search')} className="btn-primary">
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-playfair font-bold text-charcoal mb-2">My Wishlist</h1>
        <p className="text-mutedGray">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  );
};

export default Wishlist;
