// shared/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full text-center text-sm py-4 text-gray-500 border-t bg-white mt-auto">
      &copy; {new Date().getFullYear()} Jiseti Platform. All rights reserved.
    </footer>
  );
};

export default Footer;