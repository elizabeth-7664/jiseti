
// src/components/shared/Header.jsx
import React from 'react';
import Navigations from '../ui/Navigations'; // Import your Navigations component

const Header = () => {
  return (
    // The Navigations component already has its own comprehensive styling
    // including background, shadow, padding, and responsiveness.
    // So, this Header component can be very minimal, or even removed
    // if Navigations is always rendered directly.
    // For now, we'll keep it as a wrapper as requested.
    <header className="w-full">
      <Navigations />

    </header>
  );
};

export default Header;

