import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  FileText, 
  Zap, 
  DollarSign, 
  Shield,
  Heart
} from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import { products } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import herosection from '../assets/herosection.jpg';
import photo1 from '../assets/photo1.jpg';
import photo2 from '../assets/photo2.jpg';
import s5 from '../assets/5.jpg';
import s12 from '../assets/12.jpg'
import s3 from '../assets/3.png'
import s4 from '../assets/4.jpg'
import s1 from '../assets/1.png';
import d1 from '../assets/d1.png';
import d2 from '../assets/d2.png';
import d3 from '../assets/d3.png';
import d4 from '../assets/d4.png';
import d5 from '../assets/d5.png';
import diamond from '../assets/diamond.mp4';
import makeyourwown from '../assets/makeyourwown.jpg';

const Home = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { convert, format } = useCurrency();
  const [activeTab, setActiveTab] = useState('new-arrival');
  const featuredProducts = products.filter(p => p.featured);
  const carouselRef = useRef(null);
  const videoRefs = useRef([]);

  // Products for different tabs
  const newArrivals = products.slice(0, 6);
  const bestSellers = [...products].sort((a, b) => b.price - a.price).slice(0, 6);
  const trending = products.filter(p => p.featured).slice(0, 6);

  // Category data
  const categories = [
    { id: 1, name: 'EARRINGS', image: s1, gridArea: 'left-top', aspectRatio: 'aspect-[4/3]' },
    { id: 2, name: 'RINGS', image: s12, gridArea: 'left-bottom', aspectRatio: 'aspect-[4/3]' },
    { id: 3, name: 'EARRINGS', image: s3, gridArea: 'center', aspectRatio: '' },
    { id: 4, name: 'BRACELET', image: s4, gridArea: 'right-top', aspectRatio: 'aspect-[4/3]' },
    { id: 5, name: 'WEDDING', image: s5, gridArea: 'right-bottom', aspectRatio: 'aspect-[4/3]' }
  ];

  // Testimonial videos data
  const testimonialVideos = [
    {
      id: 1,
      url: "https://www.pexels.com/download/video/6263489/",
    },
    {
      id: 2,
      url: "https://www.pexels.com/download/video/6263489/",

    },
    {
      id: 3,
      url: "https://www.pexels.com/download/video/6263489/",
    },
    {
      id: 4,
      url: "https://www.pexels.com/download/video/6263489/",
    },
    {
      id: 5,
      url: "https://www.pexels.com/download/video/6263489/",
    }
  ];

  

  // State to track centered video
  const [centeredVideoIndex, setCenteredVideoIndex] = useState(0);

  // Check which video is in center and play it
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;

      const carousel = carouselRef.current;
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      videoRefs.current.forEach((video, index) => {
        if (!video) return;

        const videoRect = video.getBoundingClientRect();
        const videoCenter = videoRect.left + videoRect.width / 2;
        const distance = Math.abs(carouselCenter - videoCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      // Update centered video index
      setCenteredVideoIndex(closestIndex);

      // Play only the centered video, pause all others
      videoRefs.current.forEach((video, index) => {
        if (!video) return;
        
        if (index === closestIndex) {
          video.play().catch(err => console.log('Play error:', err));
        } else {
          video.pause();
          video.currentTime = 0; // Reset to beginning
        }
      });
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      // Initial check
      setTimeout(handleScroll, 100);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Handle video end - auto advance to next video
  useEffect(() => {
    const handleVideoEnd = (index) => {
      if (index === centeredVideoIndex && carouselRef.current) {
        const nextIndex = (index + 1) % testimonialVideos.length;
        const videoWidth = window.innerWidth < 640 ? 180 : window.innerWidth < 768 ? 200 : 230;
        const gap = window.innerWidth < 768 ? 12 : 16;
        const scrollAmount = videoWidth + gap;
        
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    videoRefs.current.forEach((video, index) => {
      if (video) {
        const handler = () => handleVideoEnd(index);
        video.addEventListener('ended', handler);
        return () => video.removeEventListener('ended', handler);
      }
    });
  }, [centeredVideoIndex, testimonialVideos.length]);

  const getTabProducts = () => {
    switch (activeTab) {
      case 'best-seller': return bestSellers;
      case 'trending': return trending;
      default: return newArrivals;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Full height with header overlay */}
      <section className="relative h-screen w-full overflow-hidden max-w-[100vw]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={herosection}
            alt="Luxury jewelry model"
            className="w-full h-full object-cover object-right"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full w-full container mx-auto px-4 sm:px-6 flex items-end">
          <div className="max-w-xl pb-20 sm:pb-20 md:pb-5 w-full">

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="
          font-playfair font-bold text-charcoal tracking-widest
          text-4xl sm:text-5xl md:text-6xl lg:text-7xl
          mb-2 sm:mb-6
        "
            >
              GIFT THE GLOW
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="
          text-charcoal font-medium
          text-sm sm:text-base md:text-lg
          mb-6 sm:mb-8
        "
            >
              FRESH DESIGNS THAT SPARKLE AS <br/>
              BRIGHT AS YOU DO.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-row gap-2"
            >
              <button
                onClick={() => navigate('/search')}
                className="
            bg-primary text-white
            px-5 sm:px-10 py-3 sm:py-4 
            rounded font-semibold text-xs sm:text-sm tracking-wider
            hover:bg-secondary transition-all duration-300
          "
              >
                SHOP NOW
              </button>

              <button
                className="
            border-2 border-primary text-primary
            px-5 sm:px-10 py-3 sm:py-4
            rounded font-semibold text-xs sm:text-sm tracking-wider
            hover:bg-primary hover:text-white transition-all duration-300
          "
              >
                CUSTOMIZE
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-12 sm:py-16 bg-ivory">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-playfair font-normal text-charcoal mb-3 sm:mb-4 tracking-wider">
              SHOP BY CATEGORY
            </h2>
            <p className="text-mutedGray text-xs sm:text-sm md:text-base tracking-wide px-4">
              Discover Jewelry Designed for Every Mood and Moment
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1 max-w-7xl mx-auto">
            {/* Left Column - 2 images stacked */}
            <div className="grid grid-rows-2 gap-0.5 sm:gap-1">
              {categories.slice(0, 2).map((category) => (
                <motion.div
                  key={category.id}
                  className={`relative overflow-hidden cursor-pointer group ${category.aspectRatio}`}
                  onClick={() => navigate('/search')}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xs sm:text-sm md:text-lg lg:text-xl font-light tracking-widest uppercase">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center Column - Single tall image */}
            {categories.slice(2, 3).map((category) => (
              <motion.div
                key={category.id}
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => navigate('/search')}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-sm sm:text-base md:text-xl lg:text-2xl font-light tracking-widest uppercase">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            ))}

            {/* Right Column - 2 images stacked */}
            <div className="grid grid-rows-2 gap-0.5 sm:gap-1">
              {categories.slice(3, 5).map((category) => (
                <motion.div
                  key={category.id}
                  className={`relative overflow-hidden cursor-pointer group ${category.aspectRatio}`}
                  onClick={() => navigate('/search')}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xs sm:text-sm md:text-lg lg:text-xl font-light tracking-widest uppercase">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Shape Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-playfair font-normal text-charcoal mb-3 sm:mb-4 tracking-wider">
              SHOP BY SHAPE
            </h2>
            <p className="text-mutedGray text-xs sm:text-sm md:text-base tracking-wide px-4">
              Every Diamond Tells a Story So Find Yours
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Left Arrow - Hidden on mobile */}
            <button
              onClick={() => {
                const container = document.getElementById('shape-carousel');
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110"
              aria-label="Previous shapes"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
            </button>

            {/* Carousel */}
            <div
              id="shape-carousel"
              className="flex overflow-x-auto gap-4 sm:gap-6 md:gap-8 px-4 sm:px-8 md:px-12 py-6 sm:py-8 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { name: 'ROUND', img: d1 },
                { name: 'HEART', img: d2 },
                { name: 'RADIANT', img: d3 },
                { name: 'PRINCESS', img: d4 },
                { name: 'PEAR', img: d5 },
                { name: 'OVAL', img: d5 },
                { name: 'MARQUISE', img: d2 },
                { name: 'CUSHION', img: d1 }
              ].map((shape) => (
                <motion.div
                  key={shape.name}
                  className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
                  onClick={() => navigate('/search')}
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 sm:mb-4 flex items-center justify-center transition-all duration-300">
                    <img
                      src={shape.img}
                      alt={`${shape.name} Diamond`}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain filter brightness-110"
                    />
                  </div>
                  <h3 className="text-mutedGray text-xs sm:text-sm uppercase tracking-widest font-light group-hover:text-charcoal transition-colors">
                    {shape.name}
                  </h3>
                </motion.div>
              ))}
            </div>

            {/* Right Arrow - Hidden on mobile */}
            <button
              onClick={() => {
                const container = document.getElementById('shape-carousel');
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110"
              aria-label="Next shapes"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
            </button>
          </div>

          {/* Mobile Scroll Hint */}
          <p className="sm:hidden text-center text-xs text-mutedGray mt-4">
            ← Swipe to explore more →
          </p>
        </div>
      </section>

      {/* Make Your Own Section */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={makeyourwown}
            alt="Custom Jewelry"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl text-white pt-20 sm:pt-32 md:pt-40 lg:pt-60"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair font-normal mb-4 sm:mb-5 md:mb-6 tracking-wide sm:tracking-wider">
              MAKE YOUR OWN
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-7 md:mb-8 leading-relaxed font-light tracking-wide max-w-xl">
              DESIGN A PIECE THAT'S TRULY YOURS. PERSONALIZED, ENGRAVED, AND CRAFTED TO REFLECT YOUR UNIQUE STYLE.
            </p>
            <button className="border-2 border-white text-white px-6 sm:px-8 md:px-10 py-2 sm:py-2.5 md:py-3 hover:bg-white hover:text-charcoal transition-all duration-300 font-light text-xs sm:text-sm tracking-widest uppercase">
              CUSTOMIZE
            </button>
          </motion.div>
        </div>
      </section>

      {/* Tabbed Product Section */}
      <section className="py-12 sm:py-16 bg-ivory">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 border-b border-lightGray overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('new-arrival')}
              className={`pb-3 sm:pb-4 text-xs sm:text-sm md:text-base uppercase tracking-widest font-light transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${activeTab === 'new-arrival'
                ? 'text-charcoal border-primary'
                : 'text-mutedGray hover:text-charcoal border-transparent'
                }`}
            >
              NEW ARRIVAL
            </button>
            <button
              onClick={() => setActiveTab('best-seller')}
              className={`pb-3 sm:pb-4 text-xs sm:text-sm md:text-base uppercase tracking-widest font-light transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${activeTab === 'best-seller'
                ? 'text-charcoal border-primary'
                : 'text-mutedGray hover:text-charcoal border-transparent'
                }`}
            >
              BEST SELLER
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`pb-3 sm:pb-4 text-xs sm:text-sm md:text-base uppercase tracking-widest font-light transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${activeTab === 'trending'
                ? 'text-charcoal border-primary'
                : 'text-mutedGray hover:text-charcoal border-transparent'
                }`}
            >
              TRENDING
            </button>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto mb-6 sm:mb-8">
              {getTabProducts().map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white rounded-lg overflow-hidden card-shadow cursor-pointer aspect-square"
                >
                  {/* Wishlist Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-white transition-all"
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                        isInWishlist(product.id) ? 'text-primary fill-primary' : 'text-mutedGray hover:text-primary'
                      }`}
                      fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* Product Image with Hover Effect */}
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="absolute inset-0 overflow-hidden bg-lightGray/20">
                      {/* Default Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-110"
                      />
                      {/* Hover Image */}
                      <img
                        src={product.hoverImage}
                        alt={`${product.name} alternate view`}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                      />
                    </div>

                    {/* Product Info - Overlaid on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 ">
                      <p className="text-primary text-base sm:text-lg font-thin mb-1">
                        {format(convert(product.price))}
                      </p>
                      <h3 className="text-mutedGray text-xs sm:text-sm uppercase tracking-wide font-light line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Continue Button */}
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => navigate('/search')}
                className="border-2 border-secondary text-secondary px-10 sm:px-12 md:px-16 py-2.5 sm:py-3 hover:bg-secondary hover:text-white transition-all duration-300 font-light text-xs sm:text-sm tracking-widest uppercase"
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brilliance of Lab Grown Diamonds */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">

            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-full flex justify-center order-2 md:order-1"
            >
              <div className="w-full max-w-[580px] aspect-[3/2] overflow-hidden rounded-lg shadow-lg">
                <video
                  src={diamond}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center text-center order-1 md:order-2"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-normal text-charcoal tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-4 sm:mb-5 md:mb-6">
                Brilliance of Lab<br />Grown Diamonds
              </h2>

              <p className="text-mutedGray text-xs sm:text-sm md:text-base text-center leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-md px-4">
                Design jewelry that tells your story. From gemstone choices to
                engravings, make it yours crafted with care, just for you.
              </p>

              <button
                onClick={() => navigate("/search")}
                className="border border-secondary rounded-sm px-8 sm:px-10 md:px-12 py-2.5 sm:py-3 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] uppercase text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
              >
                Customize
              </button>
            </motion.div>

          </div>
        </div>
      </section>


      {/* What Our Customers Say */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-charcoal text-center mb-8 sm:mb-10 md:mb-12 tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            What Our Customers Say
          </h2>

          {/* Carousel Container */}
          <div className="relative max-w-4xl mx-auto flex items-center justify-center">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = carouselRef.current;
                if (!container) return;
                
                const videoWidth = window.innerWidth < 640 ? 180 : window.innerWidth < 768 ? 200 : 230;
                const gap = window.innerWidth < 768 ? 12 : 16;
                const scrollAmount = videoWidth + gap;
                
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
              }}
              className="hidden sm:flex flex-shrink-0 mr-3 md:mr-4 text-charcoal hover:text-primary transition-colors z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>

            {/* Testimonial Videos - Scrollable */}
            <div className="flex-1 overflow-hidden max-w-3xl">
              <div
                ref={carouselRef}
                className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  scrollSnapType: 'x mandatory',
                  // Add padding so first and last videos can center
                  paddingLeft: 'calc(50% - 120px)',
                  paddingRight: 'calc(50% - 120px)'
                }}
              >
                {testimonialVideos.map((testimonial, index) => {
                  const isCentered = centeredVideoIndex === index;
                  
                  return (
                    <div 
                      key={testimonial.id} 
                      className={`flex-shrink-0 transition-all duration-500 ease-out ${
                        isCentered 
                          ? 'w-[200px] sm:w-[220px] md:w-[260px]' 
                          : 'w-[160px] sm:w-[180px] md:w-[200px]'
                      } ${isCentered ? 'opacity-100' : 'opacity-60'}`}
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      <div className={`relative bg-gray-100 rounded-2xl overflow-hidden aspect-[9/16] transition-all duration-500 ${
                        isCentered ? 'shadow-2xl ring-2 ring-primary/20' : 'shadow-lg'
                      }`}>
                        {/* Video */}
                        <video
                          ref={(el) => (videoRefs.current[index] = el)}
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          <source src={testimonial.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>

                        {/* Gradient Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

                        {/* Dimmed overlay for non-centered videos */}
                        {!isCentered && (
                          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = carouselRef.current;
                if (!container) return;
                
                const videoWidth = window.innerWidth < 640 ? 180 : window.innerWidth < 768 ? 200 : 230;
                const gap = window.innerWidth < 768 ? 12 : 16;
                const scrollAmount = videoWidth + gap;
                
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
              }}
              className="hidden sm:flex flex-shrink-0 ml-3 md:ml-4 text-charcoal hover:text-primary transition-colors z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile Scroll Hint */}
          <p className="sm:hidden text-center text-xs text-mutedGray mt-6">
            ← Swipe to explore more →
          </p>

          {/* Video Progress Indicator */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {testimonialVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const container = carouselRef.current;
                  if (!container) return;
                  
                  const videoWidth = window.innerWidth < 640 ? 180 : window.innerWidth < 768 ? 200 : 230;
                  const gap = window.innerWidth < 768 ? 12 : 16;
                  
                  const targetScroll = index * (videoWidth + gap);
                  
                  container.scrollTo({ left: targetScroll, behavior: 'smooth' });
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  centeredVideoIndex === index 
                    ? 'w-8 bg-primary' 
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blogs */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Heading */}
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] uppercase text-charcoal mb-8 sm:mb-10 md:mb-12">
            Recent Blogs
          </h2>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">

            {/* Blog 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="cursor-pointer group"
              onClick={() => navigate("/search")}
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={photo1}
                  alt="Know Our Story"
                  className="w-full object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="mt-4 sm:mt-5 md:mt-6 text-center">
                <p className="text-[10px] sm:text-[11px] tracking-widest uppercase text-mutedGray mb-2">
                  07 Jun,2025
                </p>
                <h3 className="text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase text-charcoal group-hover:text-primary transition-colors">
                  Know Our Story
                </h3>
              </div>
            </motion.div>

            {/* Blog 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
              className="cursor-pointer group"
              onClick={() => navigate("/search")}
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={photo2}
                  alt="Behind The Designs"
                  className="w-full object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="mt-4 sm:mt-5 md:mt-6 text-center">
                <p className="text-[10px] sm:text-[11px] tracking-widest uppercase text-mutedGray mb-2">
                  12 Jun,2025
                </p>
                <h3 className="text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase text-charcoal group-hover:text-primary transition-colors">
                  Behind The Designs
                </h3>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="bg-white py-8 sm:py-10 md:py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Global Delivery */}
            <div className="text-center">
              <div className="flex justify-center mb-2 sm:mb-3">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-charcoal" strokeWidth={1.5} />
              </div>
              <h3 className="text-[10px] sm:text-xs font-medium text-charcoal uppercase tracking-wider mb-1">Global Delivery</h3>
            </div>

            {/* Free Shipping */}
            <div className="text-center">
              <div className="flex justify-center mb-2 sm:mb-3">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-charcoal" strokeWidth={1.5} />
              </div>
              <h3 className="text-[10px] sm:text-xs font-medium text-charcoal uppercase tracking-wider mb-1">Free 2-Day</h3>
              <p className="text-[9px] sm:text-xs text-mutedGray">Worldwide Shipping</p>
            </div>

            {/* Customer Experience */}
            <div className="text-center">
              <div className="flex justify-center mb-2 sm:mb-3">
                <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-charcoal" strokeWidth={1.5} />
              </div>
              <h3 className="text-[10px] sm:text-xs font-medium text-charcoal uppercase tracking-wider mb-1">Exclusive Customer</h3>
              <p className="text-[9px] sm:text-xs text-mutedGray">Experience</p>
            </div>

            {/* Lifetime Warranty */}
            <div className="text-center">
              <div className="flex justify-center mb-2 sm:mb-3">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-charcoal" strokeWidth={1.5} />
              </div>
              <h3 className="text-[10px] sm:text-xs font-medium text-charcoal uppercase tracking-wider mb-1">Lifetime Warranty</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
