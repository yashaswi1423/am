import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              onLoadComplete();
            }, 400);
          }, 200);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-4">
        {/* Logo Container with Animation */}
        <div className={`relative transition-all duration-700 ${isExiting ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent/30 shadow-2xl animate-float">
            <img
              src="/new.png"
              alt="AM Fashions"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Rotating Ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin"></div>
        </div>

        {/* Brand Name */}
        <div className={`text-center transition-all duration-700 ${isExiting ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider mb-2 animate-fade-in-up">
            AM_fashions
          </h1>
          <p className="text-gray-400 text-sm md:text-base tracking-widest animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            LOADING YOUR STYLE
          </p>
        </div>

        {/* Progress Bar */}
        <div className={`w-64 md:w-80 transition-all duration-700 ${isExiting ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-red-400 to-accent rounded-full transition-all duration-300 ease-out shadow-lg shadow-accent/50"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-accent font-semibold text-lg tabular-nums">
              {Math.floor(Math.min(progress, 100))}%
            </span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className={`flex space-x-2 transition-all duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
