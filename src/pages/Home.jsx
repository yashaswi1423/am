import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductModal from '../components/ProductModal';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const categories = [
  'T-Shirts', 'Shirts', 'Cargo', 'Shorts', 'Track pants', 'Coats',
  'Wallets', 'Jackets', 'Trousers', 'Night wear', 'Hoodies',
  'Gym wear', 'Sleepwear sets', 'Sweatshirts', 'Jeans'
];

const Home = ({ addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products?is_active=true`);
      if (response.data.success) {
        // Transform database products to match the expected format
        const transformedProducts = response.data.data.map(product => ({
          id: product.product_id,
          name: product.product_name,
          category: product.category,
          price: parseFloat(product.base_price),
          images: product.images.map(img => img.image_url),
          description: product.description,
          variants: product.variants
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

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
                  <img
                    src={product.images ? product.images[0] : product.image}
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
                  <p className="text-lg md:text-xl font-bold text-accent">₹{product.price}</p>
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
    </div>
  );
};

export default Home;
