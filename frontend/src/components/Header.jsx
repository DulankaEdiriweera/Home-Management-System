import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
            <Link to="/inventoryHome" className="font-medium hover:text-blue-500 cursor-pointer transition-colors">
              INVENTORY
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="font-medium hover:text-blue-500 cursor-pointer transition-colors">
              TASK MASTER
            </Link>
          </li>
          <li>
            <Link to="/expensesAdd" className="font-medium hover:text-blue-500 cursor-pointer transition-colors">
              EXPENSES TRACKER
            </Link>
          </li>
          <li>
            <Link to="/shoppingList" className="font-medium hover:text-blue-500 cursor-pointer transition-colors">
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
