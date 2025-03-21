import React from 'react'
import LoginImg from '../assets/Login.jpg'
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login and save user state
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
    window.location.reload(); // Refresh to update header state
  };

  return (
    <div className="flex p-5">
      {/* Left side - Image */}
      <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
        <img
          src={LoginImg}
          alt="Login"
          className="w-full h-full rounded-2xl"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Login to Your Account</h2>
        <form className="p-10" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>

          <p className="text-center p-3">
            Don't have an account?{' '}
            <a href="/signUp" className="text-blue-600">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
