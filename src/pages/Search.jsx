import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Tag, Filter, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import { products, categories, shapes, metals } from '../data/products';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedShape, setSelectedShape] = useState(searchParams.get('shape') || 'All');
  const [selectedMetal, setSelectedMetal] = useState(searchParams.get('metal') || 'All');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('featured');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Generate suggestions
  useEffect(() => {
    if (searchTerm.length > 1) {
      const productSuggestions = products
        .filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.shape.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      
      const categorySuggestions = categories
        .filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(c => ({ type: 'category', name: c }));
      
      const shapeSuggestions = shapes
        .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(s => ({ type: 'shape', name: s }));

      setSuggestions([
        ...categorySuggestions,
        ...shapeSuggestions,
        ...productSuggestions.map(p => ({ type: 'product', ...p }))
      ]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (debouncedSearch) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (selectedShape !== 'All') {
      filtered = filtered.filter((product) => product.shape === selectedShape);
    }

    if (selectedMetal !== 'All') {
      filtered = filtered.filter((product) => product.metal === selectedMetal);
    }

    // Price filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [debouncedSearch, selectedCategory, selectedShape, selectedMetal, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedShape('All');
    setSelectedMetal('All');
    setPriceRange([0, 5000]);
    setSortBy('featured');
    setSearchParams({});
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.name);
      setSearchTerm('');
    } else if (suggestion.type === 'shape') {
      setSelectedShape(suggestion.name);
      setSearchTerm('');
    } else {
      navigate(`/product/${suggestion.id}`);
    }
    setShowSuggestions(false);
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    selectedShape !== 'All',
    selectedMetal !== 'All',
    priceRange[0] > 0 || priceRange[1] < 5000
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Search Section */}
      <div className="bg-white py-12 border-b border-lightGray">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-playfair font-normal text-charcoal text-center mb-8 tracking-wider">
            DISCOVER OUR COLLECTION
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                placeholder="Search by name, category, or style..."
                className="w-full px-6 py-4 pl-14 bg-ivory border border-lightGray rounded-full text-charcoal focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base"
                aria-label="Search products"
              />
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-mutedGray" />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-mutedGray hover:text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-lightGray overflow-hidden z-50"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-6 py-3 text-left hover:bg-ivory flex items-center gap-4 transition-colors"
                    >
                      {suggestion.type === 'product' ? (
                        <>
                          <img 
                            src={suggestion.image} 
                            alt={suggestion.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-charcoal">{suggestion.name}</p>
                            <p className="text-sm text-mutedGray">{suggestion.category}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                            <Tag className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-charcoal">{suggestion.name}</p>
                            <p className="text-sm text-mutedGray capitalize">Shop by {suggestion.type}</p>
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-charcoal">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-charcoal mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'All'}
                      onChange={() => setSelectedCategory('All')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-mutedGray">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-mutedGray">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shape Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-charcoal mb-3">Shape</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shape"
                      checked={selectedShape === 'All'}
                      onChange={() => setSelectedShape('All')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-mutedGray">All Shapes</span>
                  </label>
                  {shapes.map((shape) => (
                    <label key={shape} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="shape"
                        checked={selectedShape === shape}
                        onChange={() => setSelectedShape(shape)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-mutedGray">{shape}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metal Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-charcoal mb-3">Metal</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="metal"
                      checked={selectedMetal === 'All'}
                      onChange={() => setSelectedMetal('All')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-mutedGray">All Metals</span>
                  </label>
                  {metals.map((metal) => (
                    <label key={metal} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="metal"
                        checked={selectedMetal === metal}
                        onChange={() => setSelectedMetal(metal)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-mutedGray">{metal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-charcoal mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <div className="flex items-center justify-between text-sm text-mutedGray">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters Button */}
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-sm mb-4"
          >
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <p className="text-mutedGray">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
              
              <div className="flex items-center gap-4">
                <label className="text-sm text-mutedGray">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-lightGray rounded-lg focus:outline-none focus:border-primary bg-white text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <ProductCard product={product} variant="search" />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white rounded-lg"
              >
                <Heart className="w-24 h-24 mx-auto text-mutedGray mb-4" strokeWidth={1} />
                <h3 className="text-2xl font-playfair font-semibold text-charcoal mb-2">
                  No Products Found
                </h3>
                <p className="text-mutedGray mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-full max-w-sm bg-white z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-charcoal">Filters</h2>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="p-2 hover:bg-lightGray rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Same filter content as desktop */}
                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <h3 className="text-sm font-medium text-charcoal mb-3">Category</h3>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-lightGray rounded-lg"
                    >
                      <option value="All">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Shape */}
                  <div>
                    <h3 className="text-sm font-medium text-charcoal mb-3">Shape</h3>
                    <select
                      value={selectedShape}
                      onChange={(e) => setSelectedShape(e.target.value)}
                      className="w-full px-4 py-3 border border-lightGray rounded-lg"
                    >
                      <option value="All">All Shapes</option>
                      {shapes.map((shape) => (
                        <option key={shape} value={shape}>{shape}</option>
                      ))}
                    </select>
                  </div>

                  {/* Metal */}
                  <div>
                    <h3 className="text-sm font-medium text-charcoal mb-3">Metal</h3>
                    <select
                      value={selectedMetal}
                      onChange={(e) => setSelectedMetal(e.target.value)}
                      className="w-full px-4 py-3 border border-lightGray rounded-lg"
                    >
                      <option value="All">All Metals</option>
                      {metals.map((metal) => (
                        <option key={metal} value={metal}>{metal}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={clearFilters}
                    className="flex-1 btn-outline"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="flex-1 btn-primary"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
