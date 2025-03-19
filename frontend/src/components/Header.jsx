import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center py-5 px-8 bg-white shadow-md">

      <div className="flex items-center">

        <div className="mr-4">

          <img
            src="/src/assets/HOME TRACK LOGO.png"
            alt="Home Track Logo"
            width="100"
            height="100"
          />

        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="flex space-x-20">
          <li className="font-medium hover:text-blue-500 cursor-pointer transition-colors">INVENTORY</li>
          <li className="font-medium hover:text-blue-500 cursor-pointer transition-colors">TASK MASTER</li>
          <li className="font-medium hover:text-blue-500 cursor-pointer transition-colors">EXPENSES TRACKER</li>
          <li className="font-medium hover:text-blue-500 cursor-pointer transition-colors">SHOPPING LIST</li>
        </ul>
      </nav>

      {/* Login Button */}
      <button className="bg-blue-500 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-500 transition-colors">
        LOGIN
      </button>
    </header>
  );
};

export default Header;