import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductModal from '../components/ProductModal';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Image component with better error handling
const ProductImage = ({ src, alt, className, onError }) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = (e) => {
    console.error('Image failed to load:', src);
    setHasError(true);
    setIsLoading(false);
    setImgSrc('/placeholder.svg');
    if (onError) onError(e);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
};

const Home = ({ addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const navigate = useNavigate();
  const mobileOffersRef = useRef(null);
  const autoScrollInterval = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchOffers();
    fetchCategories();
  }, []);

  // Auto-scroll for mobile offers
  useEffect(() => {
    const scrollContainer = mobileOffersRef.current;
    if (!scrollContainer) return;

    let isUserInteracting = false;
    let scrollTimeout;

    const startAutoScroll = () => {
      if (autoScrollInterval.current) return;
      
      autoScrollInterval.current = setInterval(() => {
        if (!isUserInteracting && scrollContainer) {
          const cardWidth = scrollContainer.children[0]?.offsetWidth || 0;
          const gap = 16; // 4 * 4px (gap-4)
          const scrollAmount = cardWidth + gap;
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          
          if (scrollContainer.scrollLeft >= maxScroll - 10) {
            // Reset to start
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll to next card
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 3000); // Auto-scroll every 3 seconds
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
        autoScrollInterval.current = null;
      }
    };

    const handleTouchStart = () => {
      isUserInteracting = true;
      stopAutoScroll();
    };

    const handleTouchEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isUserInteracting = false;
        startAutoScroll();
      }, 2000); // Resume auto-scroll 2 seconds after user stops interacting
    };

    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchend', handleTouchEnd);
    scrollContainer.addEventListener('mousedown', handleTouchStart);
    scrollContainer.addEventListener('mouseup', handleTouchEnd);

    startAutoScroll();

    return () => {
      stopAutoScroll();
      clearTimeout(scrollTimeout);
      if (scrollContainer) {
        scrollContainer.removeEventListener('touchstart', handleTouchStart);
        scrollContainer.removeEventListener('touchend', handleTouchEnd);
        scrollContainer.removeEventListener('mousedown', handleTouchStart);
        scrollContainer.removeEventListener('mouseup', handleTouchEnd);
      }
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Add cache-busting parameter to ensure fresh data
      const timestamp = new Date().getTime();
      const response = await axios.get(`${API_URL}/products?is_active=true&_t=${timestamp}`, {
        timeout: 30000 // 30 second timeout
      });
      if (response.data.success) {
        // Transform database products to match the expected format
        const transformedProducts = response.data.data.map(product => {
          // Ensure images array exists and has valid URLs
          const validImages = (product.images || [])
            .filter(img => img && img.image_url)
            .map(img => img.image_url)
            .filter(url => url && url.trim() !== '');
          
          return {
            id: product.product_id,
            name: product.product_name,
            category: product.category,
            price: parseFloat(product.base_price),
            images: validImages.length > 0 ? validImages : ['/placeholder.svg'],
            description: product.description,
            variants: product.variants
          };
        });
        
        // DEBUG: Log products with their variants
        console.log('=== PRODUCTS LOADED ===');
        console.log('Total products:', transformedProducts.length);
        transformedProducts.forEach(p => {
          console.log(`Product: ${p.name}, Variants: ${p.variants?.length || 0}`);
          if (p.variants && p.variants.length > 0) {
            p.variants.forEach(v => {
              console.log(`  - ${v.color} ${v.size}: Stock ${v.stock_quantity}, Available: ${v.is_available}`);
            });
          }
        });
        
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out - please check your internet connection');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      setOffersLoading(true);
      const response = await axios.get(`${API_URL}/offers?is_active=true`, {
        timeout: 30000 // 30 second timeout
      });
      if (response.data.success) {
        // Transform database offers to match the expected format
        const transformedOffers = response.data.data.map(offer => {
          // Get primary image or first image
          let primaryImage = '/placeholder.svg';
          if (offer.images && offer.images.length > 0) {
            const primary = offer.images.find(img => img.is_primary);
            primaryImage = primary ? primary.image_url : offer.images[0].image_url;
          }
          
          // Get all valid image URLs
          const validImages = (offer.images || [])
            .filter(img => img && img.image_url)
            .map(img => img.image_url)
            .filter(url => url && url.trim() !== '');
          
          return {
            id: offer.offer_id,
            name: offer.offer_name,
            description: offer.description,
            originalPrice: parseFloat(offer.original_price),
            offerPrice: parseFloat(offer.offer_price),
            discount: parseFloat(offer.discount_percentage || 0),
            stock: offer.stock_quantity,
            image: primaryImage,
            images: validImages.length > 0 ? validImages : [primaryImage],
            category: offer.category || 'Special Offers',
            variants: offer.variants || []
          };
        });
        setOffers(transformedOffers);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out - please check your internet connection');
      }
      // Fallback to empty array if API fails
      setOffers([]);
    } finally {
      setOffersLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories?is_active=true`);
      if (response.data.success) {
        // Extract category names from the response
        const categoryNames = response.data.data.map(cat => cat.category_name);
        setCategories(categoryNames);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        'T-Shirts', 'Shirts', 'Cargo', 'Shorts', 'Track pants', 'Coats',
        'Wallets', 'Jackets', 'Trousers', 'Night wear', 'Hoodies',
        'Gym wear', 'Sleepwear sets', 'Sweatshirts', 'Jeans'
      ]);
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleOfferClick = (offer) => {
    // Transform offer to product format for ProductModal
    const offerAsProduct = {
      id: `offer-${offer.id}`,
      name: offer.name,
      category: offer.category,
      price: offer.offerPrice,
      originalPrice: offer.originalPrice,
      description: offer.description,
      image: offer.image,
      images: offer.images && offer.images.length > 0 ? offer.images : [offer.image],
      variants: offer.variants || [],
      isOffer: true,
      discount: offer.discount
    };
    setSelectedOffer(offerAsProduct);
  };

  const handleOfferAddToCart = (offerProduct) => {
    addToCart(offerProduct);
    setSelectedOffer(null);
  };

  const handleOfferBuyNow = (offerProduct) => {
    addToCart(offerProduct);
    setSelectedOffer(null);
    navigate('/cart');
    setTimeout(() => {
      const paymentSection = document.getElementById('payment-section');
      if (paymentSection) {
        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden bg-gray-900">
        {/* Full screen image container */}
        <div className="absolute inset-0">
          <img
            src="/desktop.jpg"
            alt="Fashion Store"
            className="hidden md:block absolute inset-0 w-full h-full object-cover object-center animate-zoom-in"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <img
            src="/mobile.jpeg"
            alt="Fashion Store"
            className="block md:hidden absolute inset-0 w-full h-full object-cover object-center animate-zoom-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-in stagger-3 z-10 animate-bounce-slow">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-5xl font-bold text-accent text-center mb-4 animate-fade-in-up">
            Special Offers
          </h2>
          <p className="text-center text-gray-600 text-lg animate-fade-in-up stagger-1">
            Don't miss out on our exclusive deals!
          </p>
        </div>

        {offersLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent"></div>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No offers available at the moment</p>
          </div>
        ) : (
          <>
            {/* Desktop: Auto-scrolling marquee */}
            <div className="relative overflow-hidden hidden md:block w-full">
              <div className="flex gap-6 animate-marquee">
                {[...Array(4)].map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {offers.map((offer, offerIndex) => (
                      <div 
                        key={`${setIndex}-${offerIndex}`} 
                        onClick={() => handleOfferClick(offer)}
                        className="flex-shrink-0 w-80 rounded-3xl overflow-hidden shadow-2xl hover-lift group relative cursor-pointer"
                      >
                        <ProductImage
                          src={offer.image}
                          alt={offer.name}
                          className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">{offer.name}</p>
                            <p className="text-lg line-through text-red-400 mb-1">₹{offer.originalPrice.toFixed(0)}</p>
                            <p className="text-3xl font-bold">₹{offer.offerPrice.toFixed(0)}</p>
                            <p className="text-sm bg-red-500 inline-block px-3 py-1 rounded-full mt-2">
                              {Math.round(offer.discount)}% OFF
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <p className="text-xs text-white/80">Click to view details & select size/color</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Mobile: Touch-scrollable horizontal scroll with auto-scroll */}
            <div className="md:hidden px-6 w-full">
              <div 
                ref={mobileOffersRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {offers.map((offer, offerIndex) => (
                  <div 
                    key={offerIndex} 
                    onClick={() => handleOfferClick(offer)}
                    className="flex-shrink-0 w-[85vw] rounded-3xl overflow-hidden shadow-2xl group relative snap-center cursor-pointer"
                  >
                    <ProductImage
                      src={offer.image}
                      alt={offer.name}
                      className="w-full h-96 object-cover transition-transform duration-700 active:scale-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">{offer.name}</p>
                        <p className="text-lg line-through text-red-400 mb-1">₹{offer.originalPrice.toFixed(0)}</p>
                        <p className="text-3xl font-bold">₹{offer.offerPrice.toFixed(0)}</p>
                        <p className="text-sm bg-red-500 inline-block px-3 py-1 rounded-full mt-2">
                          {Math.round(offer.discount)}% OFF
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/80">Tap to view details & select size/color</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">← Swipe to see more offers →</p>
            </div>
          </>
        )}
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 w-full">
        <h2 className="text-4xl font-bold text-accent text-center mb-12 animate-fade-in-up">
          Explore Our Collection
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:flex md:flex-wrap gap-2 md:gap-3 justify-center mb-16 animate-fade-in-up stagger-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-3xl text-xs md:text-base font-medium transition-all duration-500 transform ${
              selectedCategory === 'All'
                ? 'bg-accent text-white shadow-xl scale-105 md:scale-110 ring-2 md:ring-4 ring-accent/20'
                : 'bg-card text-gray-700 hover:bg-gray-200 hover:shadow-lg hover:scale-105 hover:-translate-y-1'
            }`}
          >
            All
          </button>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-3xl text-xs md:text-base font-medium transition-all duration-500 transform ${
                selectedCategory === category
                  ? 'bg-accent text-white shadow-xl scale-105 md:scale-110 ring-2 md:ring-4 ring-accent/20'
                  : 'bg-card text-gray-700 hover:bg-gray-200 hover:shadow-lg hover:scale-105 hover:-translate-y-1'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No products available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-card rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 group hover-lift animate-fade-in-up hover-shine cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
                  <ProductImage
                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Preview Icon - Always visible, static */}
                  <div className="absolute top-2 right-2 md:top-3 md:right-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Multiple Images Indicator Badge */}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{product.images.length}</span>
                    </div>
                  )}
                </div>

                {/* Product Info - Only Image and Price */}
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-1 mb-1 md:mb-2">{product.name}</h3>
                  {product.price > 0 && (
                    <p className="text-lg md:text-xl font-bold text-accent">₹{product.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(productWithOptions) => {
            addToCart(productWithOptions);
            setSelectedProduct(null);
          }}
          onBuyNow={(productWithOptions) => {
            addToCart(productWithOptions);
            setSelectedProduct(null);
            navigate('/cart');
            setTimeout(() => {
              const paymentSection = document.getElementById('payment-section');
              if (paymentSection) {
                paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          }}
        />
      )}

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <ProductModal
          product={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onAddToCart={handleOfferAddToCart}
          onBuyNow={handleOfferBuyNow}
        />
      )}
    </div>
  );
};

export default Home;
