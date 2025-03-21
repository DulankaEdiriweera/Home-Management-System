import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  // Get current location from React Router
  const location = useLocation();
  const currentPath = location.pathname;

  // Login
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/');
    window.location.reload();
  };

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
              className={`font-medium hover:text-blue-500 cursor-pointer transition-colors pb-1 ${
                currentPath === "/inventoryHome"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : ""
              }`}
            >
              INVENTORY
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className={`font-medium hover:text-blue-500 cursor-pointer transition-colors pb-1 ${
                currentPath === "/tasks"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : ""
              }`}
            >
              TASK MASTER
            </Link>
          </li>
          <li>
            <Link
              to="/expensesAdd"
              className={`font-medium hover:text-blue-500 cursor-pointer transition-colors pb-1 ${
                currentPath === "/expensesAdd"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : ""
              }`}
            >
              EXPENSES TRACKER
            </Link>
          </li>
          <li>
            <Link
              to="/shoppingList"
              className={`font-medium hover:text-blue-500 cursor-pointer transition-colors pb-1 ${
                currentPath === "/shoppingList"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : ""
              }`}
            >
              SHOPPING LIST
            </Link>
          </li>
        </ul>
      </nav>

      {/* Authentication Buttons */}
      <div className="flex space-x-4">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-6 rounded-full font-medium hover:bg-red-600">
            LOGOUT
          </button>
        ) : (
          <>
            <button onClick={() => navigate('/signUp')} className="bg-blue-500 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-600">
              SIGNUP
            </button>
            <button onClick={() => navigate('/login')} className="bg-blue-500 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-600">
              LOGIN
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
