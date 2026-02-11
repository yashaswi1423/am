import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  // Check if we're on contact or cart page
  const isContactOrCartPage = location.pathname === '/contact' || location.pathname === '/cart';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className={`transition-all duration-500 ${
        isHomePage 
          ? (scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent backdrop-blur-sm')
          : 'bg-transparent backdrop-blur-sm'
      }`}>
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className={`text-xl font-bold tracking-tight transition-all duration-500 ${
              isContactOrCartPage 
                ? 'text-accent'
                : (isHomePage 
                  ? (scrolled ? 'text-accent' : 'text-white drop-shadow-lg')
                  : 'text-white drop-shadow-lg')
            }`}>
              AM_fashions
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative group">
                <svg className={`w-6 h-6 transition-all duration-500 ${
                  isContactOrCartPage 
                    ? 'text-accent'
                    : (isHomePage 
                      ? (scrolled ? 'text-accent' : 'text-white drop-shadow-lg')
                      : 'text-white drop-shadow-lg')
                } group-hover:scale-125`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex flex-col gap-1.5 w-7 h-7 justify-center items-center group"
                aria-label="Menu"
              >
                <span className={`w-full h-0.5 transition-all duration-300 ${
                  isContactOrCartPage 
                    ? 'bg-accent'
                    : (isHomePage 
                      ? (scrolled ? 'bg-accent' : 'bg-white drop-shadow-lg')
                      : 'bg-white drop-shadow-lg')
                } ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 transition-all duration-300 ${
                  isContactOrCartPage 
                    ? 'bg-accent'
                    : (isHomePage 
                      ? (scrolled ? 'bg-accent' : 'bg-white drop-shadow-lg')
                      : 'bg-white drop-shadow-lg')
                } ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 transition-all duration-300 ${
                  isContactOrCartPage 
                    ? 'bg-accent'
                    : (isHomePage 
                      ? (scrolled ? 'bg-accent' : 'bg-white drop-shadow-lg')
                      : 'bg-white drop-shadow-lg')
                } ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="bg-black/90 backdrop-blur-md shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col gap-6">
              <Link 
                to="/" 
                className="text-lg font-medium text-white hover:text-accent transition-all duration-300 transform hover:translate-x-2 hover:scale-105"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-lg font-medium text-white hover:text-accent transition-all duration-300 transform hover:translate-x-2 hover:scale-105"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-lg font-medium text-white hover:text-accent transition-all duration-300 transform hover:translate-x-2 hover:scale-105"
              >
                Contact
              </Link>
              {/* Admin Login - Always show this option */}
              <div className="border-t border-white/20 pt-4 mt-2">
                {localStorage.getItem('adminAuth') === 'true' ? (
                  <>
                    <a 
                      href="http://localhost:3001" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-white hover:text-accent transition-all duration-300 transform hover:translate-x-2 hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Admin Dashboard
                    </a>
                    <button
                      onClick={() => {
                        localStorage.removeItem('adminAuth');
                        localStorage.removeItem('adminUsername');
                        setIsMenuOpen(false);
                        window.location.reload(); // Refresh to update navbar
                      }}
                      className="mt-3 text-sm text-red-400 hover:text-red-300 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/admin/login" 
                    className="text-lg font-medium text-white hover:text-accent transition-all duration-300 transform hover:translate-x-2 hover:scale-105 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
