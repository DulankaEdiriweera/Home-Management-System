import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  // Get current location from React Router
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="flex justify-between items-center py-5 px-8 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <div className="mr-4">
          <Link to="/">
            <img
              src="/src/assets/HOME TRACK LOGO.png"
              alt="Home Track Logo"
              width="100"
              height="100"
              className="cursor-pointer"
            />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="flex space-x-20">
          <li>
            <Link
              to="/inventoryHome"
              className={`font-medium hover:text-blue-500 cursor-pointer transition-colors pb-1 ${currentPath === '/inventoryHome' ? 'border-b-2 border-blue-500 text-blue-500' : ''
                }`}
            >
              INVENTORY
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className={`font-medium hover:text-blue-500 cursor-pointer transition-colors pb-1 ${currentPath === '/tasks' ? 'border-b-2 border-blue-500 text-blue-500' : ''
                }`}
            >
              TASK MASTER
            </Link>
          </li>
          <li>
            <Link
              to="/expenses"
              className={`font-medium hover:text-blue-500 cursor-pointer transition-colors pb-1 ${currentPath === '/expenses' ? 'border-b-2 border-blue-500 text-blue-500' : ''
                }`}
            >
              EXPENSES TRACKER
            </Link>
          </li>
          <li>
            <Link
              to="/shopping-list"
              className={`font-medium hover:text-blue-500 cursor-pointer transition-colors pb-1 ${currentPath === '/shopping-list' ? 'border-b-2 border-blue-500 text-blue-500' : ''
                }`}
            >
              SHOPPING LIST
            </Link>
          </li>
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