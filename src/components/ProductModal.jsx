import React, { useState, useRef, useEffect, useCallback } from 'react';

const ProductModal = ({ product, onClose, onAddToCart, onBuyNow }) => {
  // Get available colors and sizes from product variants
  const availableVariants = product.variants || [];
  const availableColors = [...new Set(availableVariants.map(v => v.color))];
  const availableSizes = [...new Set(availableVariants.map(v => v.size))];
  
  // Set initial selections to first available option
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || 'Black');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageRef = useRef(null);

  // Color mapping for display
  const colorMap = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Blue': '#3B82F6',
    'Red': '#EF4444',
    'Green': '#10B981',
    'Yellow': '#F59E0B',
    'Pink': '#EC4899',
    'Grey': '#6B7280',
    'Gray': '#6B7280',
    'Navy': '#1E3A8A',
    'Brown': '#92400E'
  };

  // Get available sizes for selected color
  const sizesForColor = availableVariants
    .filter(v => v.color === selectedColor && v.is_available && v.stock_quantity > 0)
    .map(v => v.size);

  // Get available colors for selected size
  const colorsForSize = availableVariants
    .filter(v => v.size === selectedSize && v.is_available && v.stock_quantity > 0)
    .map(v => v.color);

  // Get current variant
  const currentVariant = availableVariants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  // Calculate final price with variant adjustment
  const finalPrice = currentVariant 
    ? product.price + (currentVariant.price_adjustment || 0)
    : product.price;

  // Sample reviews
  const reviews = [
    { name: 'Rahul S.', rating: 5, comment: 'Excellent quality! Fits perfectly.', date: '2 days ago' },
    { name: 'Priya M.', rating: 4, comment: 'Good product, fast delivery.', date: '1 week ago' },
    { name: 'Amit K.', rating: 5, comment: 'Amazing! Will buy again.', date: '2 weeks ago' }
  ];

  const images = product.images || [product.image];

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Swipe handlers for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      handleNext();
    }
    if (isRightSwipe && images.length > 1) {
      handlePrev();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  const handleAddToCart = () => {
    onAddToCart({ ...product, size: selectedSize, color: selectedColor, image: images[currentImageIndex] });
  };

  const handleBuyNow = () => {
    onBuyNow({ ...product, size: selectedSize, color: selectedColor, image: images[currentImageIndex] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl md:rounded-3xl max-w-6xl w-full h-[95vh] md:h-[90vh] overflow-hidden shadow-2xl animate-scale-in relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:rotate-90 transition-all duration-300 shadow-lg"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-3 md:gap-6 p-3 md:p-6 h-full overflow-y-auto">
          {/* Left: Image Gallery */}
          <div className="space-y-2 md:space-y-3 flex flex-col h-full">
            <div 
              ref={imageRef}
              className="relative flex-1 bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover select-none"
                draggable="false"
              />
              
              {images.length > 1 && (
                <>
                  {/* Left Arrow Button */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 w-7 h-7 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg z-10"
                    aria-label="Previous image"
                  >
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Right Arrow Button */}
                  <button
                    onClick={handleNext}
                    className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 w-7 h-7 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg z-10"
                    aria-label="Next image"
                  >
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Swipe Indicator for Mobile - Shows briefly */}
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 md:hidden pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                      </svg>
                      <span>Swipe</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx ? 'border-accent scale-105' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details - Compact Single Screen */}
          <div className="flex flex-col h-full space-y-2 md:space-y-3 overflow-y-auto">
            {/* Header */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{product.name}</h2>
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-gray-500">{product.category}</p>
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">(24)</span>
                </div>
              </div>
            </div>

            <div className="text-2xl md:text-3xl font-bold text-accent">₹{finalPrice}</div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-1.5">Color:</p>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((colorName) => (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColor(colorName)}
                      disabled={!colorsForSize.includes(colorName)}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                        selectedColor === colorName 
                          ? 'border-accent scale-110 ring-2 md:ring-3 ring-accent/30' 
                          : colorsForSize.includes(colorName)
                          ? 'border-gray-300 hover:border-gray-400'
                          : 'border-gray-200 opacity-40 cursor-not-allowed'
                      }`}
                      style={{ backgroundColor: colorMap[colorName] || '#999999' }}
                      title={colorName}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-1.5">Size:</p>
                <div className="flex gap-1.5 md:gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!sizesForColor.includes(size)}
                      className={`w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl text-sm md:text-base font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-accent text-white scale-105 ring-2 md:ring-3 ring-accent/30'
                          : sizesForColor.includes(size)
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {currentVariant && (
                  <p className="text-xs text-gray-600 mt-1">
                    {currentVariant.stock_quantity > 0 
                      ? `${currentVariant.stock_quantity} in stock` 
                      : 'Out of stock'}
                  </p>
                )}
              </div>
            )}

            {/* Product Description */}
            <div className="pt-2 border-t">
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1">Details</h3>
              <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                Premium quality {product.category.toLowerCase()} made with finest materials. Perfect fit and comfortable wear.
              </p>
            </div>

            {/* Reviews - Compact */}
            <div className="pt-2 border-t flex-1">
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-2">Reviews</h3>
              <div className="space-y-2">
                {reviews.slice(0, 2).map((review, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-2 md:p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs md:text-sm font-semibold text-gray-900">{review.name}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons - Sticky at bottom */}
            <div className="flex gap-2 md:gap-3 pt-2 sticky bottom-0 bg-white">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-accent text-accent py-2.5 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-base font-semibold hover:bg-accent hover:text-white transition-all duration-300 active:scale-95"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-accent text-white py-2.5 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-base font-semibold hover:bg-gray-800 transition-all duration-300 active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
