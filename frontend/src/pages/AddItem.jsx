import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaShoppingCart, FaStore, FaMoneyBillWave, FaList, 
  FaBoxOpen, FaExclamationCircle, FaArrowLeft, FaRuler
} from "react-icons/fa";

const AddItem = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // Initialize react-hook-form with validation
  const { 
    register,         // Function to register input with form validation
    handleSubmit,     // Function to handle form submission
    reset,            // Function to reset form values
    formState: { errors } // Object containing validation errors
  } = useForm();
  
  // Component state
  const [loading, setLoading] = useState(false);         // Tracks form submission status
  const [errorMessage, setErrorMessage] = useState("");  // Stores error messages
  const [successMessage, setSuccessMessage] = useState(""); // Stores success messages
  const token = localStorage.getItem("token");

  /**
   * Handle form submission
   * 
   * @param {Object} data - The form data object from react-hook-form
   */
  const onSubmit = async (data) => {
    // Set loading state and clear previous messages
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Send POST request to backend API
      const response = await axios.post("http://localhost:4000/shoppingList", {
        itemName: data.itemName,
        quantity: Number(data.quantity),
        unit: data.unit,
        category: data.category,
        priority: data.priority,
        store: data.store,
        estimatedPrice: parseFloat(data.estimatedPrice),
      },{
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });

      // Show success message and reset form
      setSuccessMessage("Item added successfully!");
      reset();

      // Redirect to shopping list page after a short delay
      setTimeout(() => navigate("/shoppingList"), 1500);
    } catch (error) {
      // Handle error case
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Error adding item. Please try again.");
      } else {
        setErrorMessage("Error adding item. Please try again.");
      }
    }

    // Reset loading state
    setLoading(false);
  };

  return (
    // Main container with gradient background
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Form card container */}
      <div className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-xl border border-blue-100">
        
        {/* Back Button - Returns to shopping list */}
        <button 
          onClick={() => navigate("/shoppingList")}
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Shopping List
        </button>
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Icon Container */}
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <FaShoppingCart className="text-4xl text-blue-600" />
          </div>
          {/* Title and Description */}
          <h2 className="text-3xl font-bold text-gray-800">Add New Item</h2>
          <p className="text-center text-gray-600 mt-2">Fill in the details to add an item to your shopping list.</p>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <p className="text-red-700 flex items-center">
              <FaExclamationCircle className="mr-2" /> {errorMessage}
            </p>
          </div>
        )}
        
        {/* Success Message Alert */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <p className="text-green-700 flex items-center">
              <FaShoppingCart className="mr-2" /> {successMessage}
            </p>
          </div>
        )}

        {/* Form Element */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Item Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Item Name</label>
            <div className="relative">
              {/* Icon */}
              <FaShoppingCart className="absolute left-3 top-3 text-gray-500 text-lg" />
              {/* Input with validation */}
              <input
                {...register("itemName", { required: "Item Name is required" })}
                type="text"
                placeholder="Enter item name"
                className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm text-gray-900"
              />
            </div>
            {/* Error message display */}
            {errors.itemName && <p className="text-red-500 text-sm">{errors.itemName.message}</p>}
          </div>

          {/* Two column layout for Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quantity Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="relative">
                <FaBoxOpen className="absolute left-3 top-3 text-gray-500 text-lg" />
                <input
                  {...register("quantity", { 
                    required: "Required", 
                    min: { value: 1, message: "Quantity must be at least 1" } 
                  })}
                  type="number"
                  placeholder="Qty"
                  className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm text-gray-900"
                />
              </div>
              {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
            </div>

            {/* Unit Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <div className="relative">
                <FaRuler className="absolute left-3 top-3 text-gray-500 text-lg" />
                <select
                  {...register("unit", { required: "Unit is required" })}
                  className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm text-gray-900 appearance-none"
                >
                  <option value="">Select</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                  <option value="pieces">pieces</option>
                </select>
              </div>
              {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
            </div>
          </div>

          {/* Category Field - Moved below Quantity and Unit */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <div className="relative">
              <FaList className="absolute left-3 top-3 text-gray-500 text-lg" />
              <select
                {...register("category", { required: "Required" })}
                className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm text-gray-900 appearance-none"
              >
                <option value="">Select</option>
                <option value="Groceries">Groceries</option>
                <option value="Household">Household</option>
                <option value="Electronics">Electronics</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          {/* Priority Field - Radio Button Group */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <div className="flex space-x-4">
              {/* Low Priority Option */}
              <label className="flex items-center">
                <input
                  {...register("priority", { required: "Priority is required" })}
                  type="radio"
                  value="Low"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Low</span>
              </label>
              {/* Medium Priority Option */}
              <label className="flex items-center">
                <input
                  {...register("priority")}
                  type="radio"
                  value="Medium"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Medium</span>
              </label>
              {/* High Priority Option */}
              <label className="flex items-center">
                <input
                  {...register("priority")}
                  type="radio"
                  value="High"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">High</span>
              </label>
            </div>
            {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
          </div>

          {/* Store Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Store</label>
            <div className="relative">
              <FaStore className="absolute left-3 top-3 text-gray-500 text-lg" />
              <input
                {...register("store", { required: "Store is required" })}
                type="text"
                placeholder="Where to buy"
                className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm text-gray-900"
              />
            </div>
            {errors.store && <p className="text-red-500 text-sm">{errors.store.message}</p>}
          </div>

          {/* Estimated Price Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Estimated Price</label>
            <div className="relative">
              <FaMoneyBillWave className="absolute left-3 top-3 text-gray-500 text-lg" />
              <input
                {...register("estimatedPrice", { 
                  required: "Price is required", 
                  min: { value: 0.01, message: "Price must be greater than 0" } 
                })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm text-gray-900 pr-16"
              />
              {/* Currency indicator */}
              <span className="absolute right-4 top-3 text-gray-700 font-medium">LKR</span>
            </div>
            {errors.estimatedPrice && <p className="text-red-500 text-sm">{errors.estimatedPrice.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            {/* Reset Button */}
            <button
              type="button"
              onClick={() => reset()}
              className="w-1/3 py-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 font-medium transition duration-300"
              disabled={loading}
            >
              Reset
            </button>
            {/* Submit Button with loading state */}
            <button
              type="submit"
              className="w-2/3 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 font-medium shadow-md transition duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  {/* Loading spinner SVG */}
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add to Shopping List"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;