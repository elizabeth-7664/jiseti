import React from 'react';

const Header = () => {
  return (
    <header className="w-full p-4 bg-white border-b flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-bold text-primary">Jiseti</h1>
      <div>
        {/* Add user avatar or logout link here */}
      </div>
    </header>
  );
};

export default Header;