import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaFilePdf, FaEdit, FaTrash, FaShoppingCart, FaList, FaBoxOpen, FaExclamationCircle, FaDollarSign, FaTimes, FaPlus, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import Swal from "sweetalert2";

const ShoppingList = () => {
  const navigate = useNavigate();
  const [shoppingItems, setShoppingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    category: "",
    priority: "",
    estimatedPrice: "",
    store: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchShoppingListItems();
  }, []);

  const fetchShoppingListItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/shoppingList");
      setShoppingItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this item from the shopping list?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745", // Green for Yes
      cancelButtonColor: "#dc3545", // Red for No
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/shoppingList/${id}`);
          setShoppingItems((prevItems) => prevItems.filter((item) => item._id !== id));
          Swal.fire("Deleted!", "The item has been removed from your shopping list.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the item.", "error");
        }
      }
    });
  };  

  const fetchHighPriorityItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/shoppingList/high-priority");
      setShoppingItems(response.data);
    } catch (error) {
      setError("Error fetching high-priority items.");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Shopping List", 14, 15);
  
    const tableColumn = ["Item Name", "Quantity", "Category", "Priority", "Store", "Estimated Price"];
    const tableRows = shoppingItems.map((item) => [
      item.itemName,
      item.quantity,
      item.category,
      item.priority,
      item.store || "N/A",
      item.estimatedPrice ? `LKR ${Number(item.estimatedPrice).toFixed(2)}` : "N/A",
    ]);
  
    autoTable(doc, {  
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "striped",
      styles: { fontSize: 12, cellPadding: 3 },
      headStyles: { fillColor: [22, 101, 216], textColor: [255, 255, 255] },
    });
  
    doc.save("shopping-list.pdf");
  };

  // Open update modal with item data
  const openUpdateModal = (item) => {
    setCurrentItem(item);
    setFormData({
      itemName: item.itemName,
      quantity: item.quantity,
      category: item.category,
      priority: item.priority,
      estimatedPrice: item.estimatedPrice || "",
      store: item.store || ""
    });
    setShowUpdateModal(true);
  };

  // Close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setCurrentItem(null);
    setFormData({
      itemName: "",
      quantity: "",
      category: "",
      priority: "",
      estimatedPrice: "",
      store: ""
    });
    setFormErrors({});
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.itemName) errors.itemName = "Item Name is required";
    if (!formData.quantity) errors.quantity = "Quantity is required";
    else if (formData.quantity < 1) errors.quantity = "Quantity must be at least 1";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.priority) errors.priority = "Priority is required";
    if (!formData.estimatedPrice) errors.estimatedPrice = "Estimated Price is required";
    else if (!/^\d+(\.\d{1,2})?$/.test(formData.estimatedPrice)) {
      errors.estimatedPrice = "Enter a valid price (e.g., 100 or 100.50)";
    }
    else if (parseFloat(formData.estimatedPrice) <= 0) {
      errors.estimatedPrice = "Price must be greater than zero";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await axios.put(`http://localhost:4000/shoppingList/${currentItem._id}`, formData);
      
      // Update the item in the local state
      setShoppingItems(prevItems =>
        prevItems.map(item => 
          item._id === currentItem._id ? { ...item, ...formData } : item
        )
      );
      
      Swal.fire("Updated!", "The item has been updated successfully.", "success");
      closeUpdateModal();
    } catch (error) {
      Swal.fire("Error!", "Failed to update the item.", "error");
    }
  };

  const filteredItems = shoppingItems.filter((item) =>
    [item.itemName, item.category, item.store, item.priority]
      .filter(Boolean) // Removes undefined/null values
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 py-1 px-3 rounded-full font-medium";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full font-medium";
      case "Low":
        return "bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium";
      default:
        return "bg-gray-100 text-gray-800 py-1 px-3 rounded-full font-medium";
    }
  };

  const resetFilter = () => {
    fetchShoppingListItems();
    setSearchTerm("");
  };

  return (
    <div className="flex p-2 bg-gray-50">
      <div className="flex-1 p-6 bg-white shadow-lg min-h-screen rounded-2xl ml-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            <FaShoppingCart className="inline-block mr-2 text-blue-600" />
            SHOPPING LIST
          </h1>
          <p className="text-gray-500 mt-2">Manage your shopping items efficiently</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate("/add-item")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <FaPlus /> Add New Item
          </button>

          <div className="relative flex items-center flex-grow max-w-md mx-2">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <FaSearch className="absolute left-3 text-gray-500" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchHighPriorityItems}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <FaFilter /> High Priority
            </button>

            <button
              onClick={resetFilter}
              className="bg-gray-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-600 shadow-md transition-all duration-200"
            >
              Reset
            </button>

            <button
              onClick={exportToPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-700 shadow-md transition-all duration-200"
            >
              <FaFilePdf /> Export PDF
            </button>
          </div>
        </div>

        <div className="pt-5">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <FaShoppingCart className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No items found in your shopping list</p>
              <p className="text-gray-400 mt-2">Add some items to get started</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-xl shadow-md">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-500">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-white">Item Name</th>
                    <th className="py-3 px-4 text-left font-semibold text-white">Quantity</th>
                    <th className="py-3 px-4 text-left font-semibold text-white">Category</th>
                    <th className="py-3 px-4 text-left font-semibold text-white">Priority</th>
                    <th className="py-3 px-4 text-left font-semibold text-white">Store</th>
                    <th className="py-3 px-4 text-left font-semibold text-white">Estimated Price</th>
                    <th className="py-3 px-4 text-left font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={item._id} className={`border-t border-gray-200 hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="py-3 px-4 font-medium">{item.itemName}</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.store || "N/A"}</td>
                      <td className="py-3 px-4 font-medium">
                        {item.estimatedPrice
                          ? `LKR ${Number(item.estimatedPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openUpdateModal(item)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 flex items-center gap-1 transition-colors duration-150"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 flex items-center gap-1 transition-colors duration-150"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaShoppingCart className="text-3xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Update Item</h2>
              </div>
              <button 
                onClick={closeUpdateModal} 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Item Name</label>
                <div className="relative">
                  <FaShoppingCart className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className="w-full px-10 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
                    placeholder="Enter item name"
                  />
                </div>
                {formErrors.itemName && <p className="text-red-500 text-sm mt-1">{formErrors.itemName}</p>}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Quantity</label>
                <div className="relative">
                  <FaBoxOpen className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-10 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
                    placeholder="Enter quantity"
                  />
                </div>
                {formErrors.quantity && <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Category</label>
                <div className="relative">
                  <FaList className="absolute left-3 top-3 text-gray-500" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-10 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 appearance-none focus:outline-none transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Household">Household</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Priority</label>
                <div className="relative">
                  <FaExclamationCircle className="absolute left-3 top-3 text-gray-500" />
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-10 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 appearance-none focus:outline-none transition-all duration-200"
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                {formErrors.priority && <p className="text-red-500 text-sm mt-1">{formErrors.priority}</p>}
              </div>

              {/* Store (Optional) */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Store (Optional)</label>
                <div className="relative">
                  <FaShoppingCart className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    name="store"
                    value={formData.store}
                    onChange={handleInputChange}
                    className="w-full px-10 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
                    placeholder="Enter store name"
                  />
                </div>
              </div>

              {/* Estimated Price */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Estimated Price</label>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    name="estimatedPrice"
                    value={formData.estimatedPrice}
                    onChange={handleInputChange}
                    className="w-full px-10 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
                    placeholder="Enter estimated price"
                  />
                </div>
                {formErrors.estimatedPrice && <p className="text-red-500 text-sm mt-1">{formErrors.estimatedPrice}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;