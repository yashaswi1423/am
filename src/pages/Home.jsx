import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ProductModal from '../components/ProductModal';

const categories = [
  'T-Shirts', 'Shirts', 'Cargo', 'Shorts', 'Track pants', 'Coats',
  'Wallets', 'Jackets', 'Trousers', 'Night wear', 'Hoodies',
  'Gym wear', 'Sleepwear sets', 'Sweatshirts', 'Jeans'
];

const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const colors = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Blue', value: '#3B82F6' }
];

const Home = ({ addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product) => {
    const size = selectedSizes[product.id] || 'M';
    const color = selectedColors[product.id] || colors[0].name;
    const image = product.images ? product.images[currentImageIndex[product.id] || 0] : product.image;
    addToCart({ ...product, image, size, color });
  };

  const handleBuyNow = (product) => {
    const size = selectedSizes[product.id] || 'M';
    const color = selectedColors[product.id] || colors[0].name;
    const image = product.images ? product.images[currentImageIndex[product.id] || 0] : product.image;
    addToCart({ ...product, image, size, color });
    navigate('/cart');
    setTimeout(() => {
      const paymentSection = document.getElementById('payment-section');
      if (paymentSection) {
        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleNextImage = (productId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (productId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const offerImages = [
    "/WhatsApp Image 2026-02-04 at 8.58.32 AM.jpeg",
    "/WhatsApp Image 2026-02-04 at 8.58.32 AM (1).jpeg",
    "/WhatsApp Image 2026-02-04 at 8.58.33 AM.jpeg",
    "/WhatsApp Image 2026-02-04 at 8.58.33 AM (1).jpeg",
    "/WhatsApp Image 2026-02-04 at 8.58.33 AM (2).jpeg",
    "/WhatsApp Image 2026-02-04 at 8.58.33 AM (3).jpeg",
    "/WhatsApp Image 2026-02-04 at 8.58.34 AM (1).jpeg"
  ];

  const handleOfferAddToCart = (index) => {
    const offerProduct = {
      id: `offer-${index}`,
      name: `Special Offer ${index + 1}`,
      category: 'Special Offers',
      price: 999,
      image: offerImages[index],
      size: 'M',
      color: 'Black'
    };
    addToCart(offerProduct);
  };

  const handleOfferBuyNow = (index) => {
    const offerProduct = {
      id: `offer-${index}`,
      name: `Special Offer ${index + 1}`,
      category: 'Special Offers',
      price: 999,
      image: offerImages[index],
      size: 'M',
      color: 'Black'
    };
    addToCart(offerProduct);
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
        {/* Navbar spacer - smaller height */}
        <div className="h-14"></div>
        
        {/* Full screen image container */}
        <div className="absolute inset-0 top-0">
          <img
            src="/desktop.jpeg"
            alt="Fashion Store"
            className="hidden md:block w-full h-full object-cover object-[center_40%] animate-zoom-in"
          />
          <img
            src="/mobile.jpeg"
            alt="Fashion Store"
            className="block md:hidden w-full h-full object-cover object-center animate-zoom-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
        </div>
        
        {/* Content overlay - positioned to avoid navbar */}
        <div className="relative z-10 flex items-center justify-center h-[calc(100vh-3.5rem)] mt-14">
          <h1 className="text-white text-4xl sm:text-5xl md:text-8xl font-bold tracking-wider drop-shadow-2xl animate-fade-in-up animate-float px-4 text-center leading-tight">
            AM_fashions
          </h1>
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

        {/* Desktop: Auto-scrolling marquee */}
        <div className="relative overflow-hidden hidden md:block w-full">
          <div className="flex gap-6 animate-marquee">
            {[...Array(4)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                {offerImages.map((image, imgIndex) => (
                  <div key={`${setIndex}-${imgIndex}`} className="flex-shrink-0 w-80 rounded-3xl overflow-hidden shadow-2xl hover-lift group relative">
                    <img
                      src={image}
                      alt={`Offer ${imgIndex + 1}`}
                      className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-3">
                      <div>
                        <p className="text-lg line-through text-red-400 mb-1">₹1600</p>
                        <p className="text-3xl font-bold">₹999</p>
                        <p className="text-sm bg-red-500 inline-block px-3 py-1 rounded-full mt-2">Special Offer</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <button
                          onClick={() => handleOfferAddToCart(imgIndex)}
                          className="flex-1 bg-white text-accent py-2 px-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-300 active:scale-95"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleOfferBuyNow(imgIndex)}
                          className="flex-1 bg-accent text-white py-2 px-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-300 active:scale-95"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile: Touch-scrollable horizontal scroll */}
        <div className="md:hidden px-6 w-full">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {offerImages.map((image, imgIndex) => (
              <div key={imgIndex} className="flex-shrink-0 w-[85vw] rounded-3xl overflow-hidden shadow-2xl group relative snap-center">
                <img
                  src={image}
                  alt={`Offer ${imgIndex + 1}`}
                  className="w-full h-96 object-cover transition-transform duration-700 active:scale-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-3">
                  <div>
                    <p className="text-lg line-through text-red-400 mb-1">₹1600</p>
                    <p className="text-3xl font-bold">₹999</p>
                    <p className="text-sm bg-red-500 inline-block px-3 py-1 rounded-full mt-2">Special Offer</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOfferAddToCart(imgIndex)}
                      className="flex-1 bg-white text-accent py-2 px-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-300 active:scale-95"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleOfferBuyNow(imgIndex)}
                      className="flex-1 bg-accent text-white py-2 px-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-300 active:scale-95"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">← Swipe to see more offers →</p>
        </div>
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
                <img
                  src={product.images ? product.images[currentImageIndex[product.id] || 0] : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image Navigation Arrows - Desktop Only */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage(product.id, product.images.length);
                      }}
                      className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all duration-300 z-10 shadow-lg"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage(product.id, product.images.length);
                      }}
                      className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all duration-300 z-10 shadow-lg"
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {product.images.map((_, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => ({ ...prev, [product.id]: imgIndex }));
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            (currentImageIndex[product.id] || 0) === imgIndex
                              ? 'bg-white w-6'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`View image ${imgIndex + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Product Info - Only Image and Price */}
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-1 mb-1 md:mb-2">{product.name}</h3>
                <p className="text-lg md:text-xl font-bold text-accent">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
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
    </div>
  );
};

export default Home;
