import React from 'react';
import { Wrench, Clock, Mail } from 'lucide-react';

const Maintenance = ({ message }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-full">
              <Wrench className="w-16 h-16 text-white animate-bounce" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
          We'll Be Right Back!
        </h1>

        {/* Message */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up">
          {message || 'We are currently updating our inventory. Please check back soon!'}
        </p>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 animate-fade-in-up stagger-1">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Estimated Time</h3>
            <p className="text-gray-300">We'll be back shortly</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 animate-fade-in-up stagger-2">
            <Mail className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-gray-300">Contact us for urgent matters</p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-sm">
          Thank you for your patience!
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
