import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! 👋 Welcome to AM_fashions. I\'m here to help you with:\n\n• Product information & categories\n• Special offers & deals\n• Order tracking\n• Contact details\n• Store information\n\nHow can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when chatbot is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Knowledge base for the chatbot
  const knowledgeBase = {
    categories: [
      'T-Shirts', 'Shirts', 'Cargo', 'Shorts', 'Track pants', 'Coats',
      'Wallets', 'Jackets', 'Trousers', 'Night wear', 'Hoodies',
      'Gym wear', 'Sleepwear sets', 'Sweatshirts', 'Jeans'
    ],
    offers: {
      current: 'Special Offer: Get premium clothing at ₹999 (Original price: ₹1600)',
      discount: '37% OFF on selected items',
      details: 'Limited time offer on exclusive collections!'
    },
    contact: {
      email: 'contact@amfashions.com',
      whatsapp: '+1234567890',
      location: 'Fashion District, Style Avenue',
      socialMedia: {
        instagram: 'https://instagram.com/am_fashions',
        facebook: 'https://facebook.com/am_fashions'
      }
    },
    founder: {
      name: 'M Miteesh',
      title: 'Founder & Visionary',
      vision: 'To become the most trusted fashion destination where every individual finds their perfect style.',
      mission: 'To deliver exceptional fashion experiences by offering premium quality clothing at affordable prices.'
    },
    about: {
      brand: 'AM_fashions',
      story: 'AM_fashions was born from a passion for style and a vision to make fashion accessible to everyone.',
      values: ['Premium Quality', 'Affordable Prices', 'Fast Delivery', 'Easy Returns'],
      promise: 'We promise to deliver not just clothing, but confidence.'
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Blue'],
    priceRange: {
      min: 2499,
      max: 20849,
      average: 6000
    },
    shipping: {
      standard: '3-5 business days',
      express: '1-2 business days',
      free: 'Free shipping on orders above ₹2000'
    },
    returns: {
      policy: '30-day easy return policy',
      condition: 'Items must be unworn with original tags',
      process: 'Contact us via email or WhatsApp to initiate return'
    },
    payment: {
      methods: ['Credit/Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'],
      secure: 'All payments are 100% secure and encrypted'
    }
  };

  const quickReplies = [
    'Show categories',
    'Current offers',
    'Track order',
    'Contact info',
    'About founder',
    'Return policy',
    'Shipping info'
  ];

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Greetings
    if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return `Hello! 👋 Welcome to AM_fashions. How can I help you today?\n\nYou can ask me about:\n• Products & Categories\n• Special Offers\n• Order Tracking\n• Contact Details\n• Store Information`;
    }

    // Categories
    if (message.includes('categor') || message.includes('product') || message.includes('what do you sell') || message.includes('collection')) {
      return `We offer a wide range of clothing categories:\n\n${knowledgeBase.categories.map((cat, i) => `${i + 1}. ${cat}`).join('\n')}\n\nAll items are available in sizes: ${knowledgeBase.sizes.join(', ')}\nColors: ${knowledgeBase.colors.join(', ')}\n\nWould you like to know more about any specific category?`;
    }

    // Offers
    if (message.includes('offer') || message.includes('deal') || message.includes('discount') || message.includes('sale') || message.includes('promo')) {
      return `🎉 Current Special Offers:\n\n${knowledgeBase.offers.current}\n${knowledgeBase.offers.discount}\n\n${knowledgeBase.offers.details}\n\nVisit our home page to see all special offer items!`;
    }

    // Price
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return `Our products range from ₹${knowledgeBase.priceRange.min} to ₹${knowledgeBase.priceRange.max}.\n\n💰 Price Categories:\n• T-Shirts & Basics: ₹2,499 - ₹3,749\n• Shirts: ₹4,599 - ₹5,399\n• Hoodies & Sweatshirts: ₹4,999 - ₹6,699\n• Jeans & Trousers: ₹6,249 - ₹7,899\n• Jackets & Coats: ₹8,349 - ₹20,849\n\nSpecial offers available at ₹999!`;
    }

    // Contact
    if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('reach') || message.includes('call')) {
      return `📞 Contact Information:\n\n📧 Email: ${knowledgeBase.contact.email}\n📱 WhatsApp: ${knowledgeBase.contact.whatsapp}\n📍 Location: ${knowledgeBase.contact.location}\n\n🌐 Social Media:\n• Instagram: ${knowledgeBase.contact.socialMedia.instagram}\n• Facebook: ${knowledgeBase.contact.socialMedia.facebook}\n\nFeel free to reach out anytime!`;
    }

    // WhatsApp
    if (message.includes('whatsapp') || message.includes('wa') || message.includes('chat')) {
      return `💬 Chat with us on WhatsApp!\n\nNumber: ${knowledgeBase.contact.whatsapp}\n\nClick here to start chatting: https://wa.me/${knowledgeBase.contact.whatsapp.replace(/[^0-9]/g, '')}\n\nWe're available to help you with orders, queries, and support!`;
    }

    // Founder
    if (message.includes('founder') || message.includes('owner') || message.includes('miteesh') || message.includes('who started')) {
      return `👤 Meet Our Founder:\n\n${knowledgeBase.founder.name}\n${knowledgeBase.founder.title}\n\n🎯 Vision:\n${knowledgeBase.founder.vision}\n\n🎯 Mission:\n${knowledgeBase.founder.mission}\n\nLearn more on our About page!`;
    }

    // About
    if (message.includes('about') || message.includes('story') || message.includes('who are you') || message.includes('tell me about')) {
      return `ℹ️ About ${knowledgeBase.about.brand}:\n\n${knowledgeBase.about.story}\n\n✨ Our Values:\n${knowledgeBase.about.values.map((v, i) => `${i + 1}. ${v}`).join('\n')}\n\n💝 Our Promise:\n${knowledgeBase.about.promise}\n\nVisit our About page to learn more!`;
    }

    // Order Tracking
    if (message.includes('track') || message.includes('order status') || message.includes('where is my order') || message.includes('delivery')) {
      return `📦 Order Tracking:\n\nTo track your order, please provide:\n1. Order ID (sent to your email)\n2. Registered email address\n\nYou can:\n• Email us at ${knowledgeBase.contact.email}\n• WhatsApp us at ${knowledgeBase.contact.whatsapp}\n• Check your email for tracking link\n\nWe'll help you track your order immediately!`;
    }

    // Shipping
    if (message.includes('ship') || message.includes('deliver') || message.includes('how long') || message.includes('when will')) {
      return `🚚 Shipping Information:\n\n⏱️ Delivery Time:\n• Standard: ${knowledgeBase.shipping.standard}\n• Express: ${knowledgeBase.shipping.express}\n\n🎁 ${knowledgeBase.shipping.free}\n\nWe ship across India with reliable courier partners!`;
    }

    // Returns
    if (message.includes('return') || message.includes('refund') || message.includes('exchange') || message.includes('cancel')) {
      return `🔄 Return & Refund Policy:\n\n✅ ${knowledgeBase.returns.policy}\n\n📋 Conditions:\n• ${knowledgeBase.returns.condition}\n• Original packaging preferred\n• Return shipping may apply\n\n📞 How to Return:\n${knowledgeBase.returns.process}\n\nWe make returns hassle-free!`;
    }

    // Payment
    if (message.includes('payment') || message.includes('pay') || message.includes('cod') || message.includes('upi')) {
      return `💳 Payment Methods:\n\n${knowledgeBase.payment.methods.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\n🔒 ${knowledgeBase.payment.secure}\n\nChoose your preferred payment method at checkout!`;
    }

    // Sizes
    if (message.includes('size') || message.includes('fit') || message.includes('measurement')) {
      return `📏 Size Information:\n\nAvailable Sizes: ${knowledgeBase.sizes.join(', ')}\n\n📐 Size Guide:\n• XS: Chest 34-36"\n• S: Chest 36-38"\n• M: Chest 38-40"\n• L: Chest 40-42"\n• XL: Chest 42-44"\n\nNeed help choosing? Contact us for personalized size recommendations!`;
    }

    // Colors
    if (message.includes('color') || message.includes('colour') || message.includes('shade')) {
      return `🎨 Available Colors:\n\n${knowledgeBase.colors.join(', ')}\n\nMost products are available in these classic colors. Some items may have additional color options. Check individual product pages for specific color availability!`;
    }

    // Help
    if (message.includes('help') || message.includes('assist') || message.includes('support')) {
      return `🤝 I'm here to help!\n\nI can assist you with:\n\n1. 🛍️ Product Categories & Collections\n2. 🎉 Current Offers & Deals\n3. 📦 Order Tracking & Status\n4. 🚚 Shipping & Delivery Info\n5. 🔄 Returns & Refunds\n6. 💳 Payment Methods\n7. 📞 Contact Information\n8. 👤 About Our Founder\n9. 📏 Size Guide\n10. 🎨 Color Options\n\nWhat would you like to know?`;
    }

    // Thanks
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
      return `You're welcome! 😊\n\nIs there anything else I can help you with?\n\nHappy shopping at AM_fashions! 🛍️`;
    }

    // Goodbye
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you') || message.includes('exit')) {
      return `Thank you for visiting AM_fashions! 👋\n\nFeel free to come back anytime. Happy shopping! 🛍️\n\nFor immediate assistance:\n📱 WhatsApp: ${knowledgeBase.contact.whatsapp}\n📧 Email: ${knowledgeBase.contact.email}`;
    }

    // Default response
    return `I'm not sure I understand that question. 🤔\n\nI can help you with:\n• Product categories & collections\n• Current offers & deals\n• Order tracking\n• Shipping & delivery\n• Returns & refunds\n• Contact information\n• About our founder\n\nTry asking about any of these topics, or contact us directly:\n📱 WhatsApp: ${knowledgeBase.contact.whatsapp}\n📧 Email: ${knowledgeBase.contact.email}`;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: getBotResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (reply) => {
    setInputValue(reply);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Backdrop - Click to close (only on desktop) */}
      {isOpen && (
        <div
          className="hidden sm:block fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
        />
      )}

      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent text-white shadow-2xl hover:shadow-accent/50 transition-all duration-500 flex items-center justify-center group ${
          isOpen ? 'scale-0' : 'scale-100 hover:scale-110'
        }`}
        aria-label="Open chat"
      >
        <svg className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-500 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs animate-pulse">
          1
        </span>
      </button>

      {/* Chatbot Window - Responsive */}
      <div
        className={`fixed z-50 bg-white shadow-2xl transition-all duration-500 flex flex-col overflow-hidden
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          inset-0 sm:inset-auto
          sm:bottom-6 sm:right-6 sm:top-auto
          sm:w-96 sm:h-[min(600px,calc(100vh-80px))] sm:rounded-3xl
          md:w-[420px] md:h-[min(650px,calc(100vh-80px))]
          lg:w-[450px] lg:h-[min(700px,calc(100vh-80px))]
          w-full h-full
          sm:max-h-[calc(100vh-80px)]
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-gray-800 p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">🤖</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm sm:text-base truncate">AM_fashions Bot</h3>
              <p className="text-white/80 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
                <span className="truncate">Online</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-all duration-300 flex-shrink-0 hover:scale-110 active:scale-95 group"
            aria-label="Close chat"
            title="Close chat (ESC)"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-2.5 sm:p-3 ${
                  message.type === 'user'
                    ? 'bg-accent text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-line break-words">{message.text}</p>
                <p className={`text-[10px] sm:text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-white rounded-2xl rounded-bl-none p-2.5 sm:p-3 shadow-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-3 sm:px-4 py-2 bg-white border-t border-gray-200 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="px-2.5 sm:px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-[10px] sm:text-xs font-medium hover:bg-accent hover:text-white transition-all duration-300 whitespace-nowrap flex-shrink-0 active:scale-95"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200 safe-area-bottom">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-accent text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 flex-shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
