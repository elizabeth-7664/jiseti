// shared/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent font-display">
            Jiseti
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Empowering community voices.
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Jiseti Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;