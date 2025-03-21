import React from 'react'
import SignUpImg from "../assets/SignUp.jpg"
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    // Simulate signup process
    navigate('/login');
  };

  return (
    <div className="flex p-5">
      {/* Left side - Image */}
      <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
        <img
          src={SignUpImg}
          alt="Signup"
          className="w-full h-full"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
        <h2 className="text-3xl font-bold mb-6">Create Your Account Here</h2>
        <form className='p-10' onSubmit={{handleSignUp}}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="cnpassword"
              name="cnpassword"
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
          onClick={handleSignUp}
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
          <p className='text-center p-3'>
            Already have an Account?
            <a href='/login' className='text-blue-600'>Login</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
