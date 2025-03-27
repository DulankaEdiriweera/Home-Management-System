import React, { useState } from "react";
import axios from "axios";
import LoginImg from "../assets/Login.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/user/login",
        formData
      );

      // Store authentication token or user info (depends on backend)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.user.fullName);
      localStorage.setItem("isAuthenticated", "true");

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "You have successfully logged in.",
        timer: 2000,
      });
      // Delay navigation to ensure SweetAlert shows up before redirecting
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Refresh to update header state
      }, 3000); // Wait 3 seconds before navigating
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="flex p-5">
      {/* Left side - Image */}
      <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
        <img src={LoginImg} alt="Login" className="w-full h-full rounded-2xl" />
      </div>

      {/* Right side - Form */}
      <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Login to Your Account
        </h2>
        <form className="p-10" onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
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
            Don't have an account?{" "}
            <a href="/signUp" className="text-blue-600">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
