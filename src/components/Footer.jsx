import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent text-white py-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm md:text-base">
          © {currentYear} AM_fashions. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
