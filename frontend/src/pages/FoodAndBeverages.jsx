import React, { useEffect, useState } from "react";
import axios from "axios";
import ReusableTable from "../components/ReusableTable";
import { FaSearch, FaFilePdf, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SideBarInventory from "../components/SideBarInventory";
import ReusablePopUp from "../components/ReusablePopUp";
import ReusableForm from "../components/ReusableForm";

const FoodAndBeverages = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]); // State to store fetched items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isLowStock, setIsLowStock] = useState(false);
  const [closeToExpiryItems, setCloseToExpiryItems] = useState([]);
  const [isCloseToExpiry, setIsCloseToExpiry] = useState(false);

  // Define table columns
  const columns = [
    { header: "Item Name", accessor: "itemName" },
    { header: "Category", accessor: "category" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Weight/Volume", accessor: "weightVolume" },
    { header: "Unit of Measure", accessor: "unitOfMeasure" },
    { header: "Expiry Date", accessor: "expiryDate" },
    { header: "Storage Type / Location", accessor: "storageTypeLocation" },
    { header: "Minimum Level", accessor: "minimumLevel" },
    { header: "View", accessor: "viewAction" },
    { header: "Edit", accessor: "editAction" },
    { header: "Delete", accessor: "deleteAction" },
  ];

  // Fetch food and beverages from backend using Axios
  useEffect(() => {
    const fetchFoodAndBeverages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/inventory/foodAndBeverages"
        ); // Adjust API URL if needed

        // Transform data: Extract only the date part
        const formattedData = response.data.map((item) => ({
          ...item,
          expiryDate: new Date(item.expiryDate).toISOString().split("T")[0], // Extract YYYY-MM-DD
        }));

        setFoodItems(formattedData); // Set state with fetched data
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodAndBeverages();
  }, []);

  const [viewItem, setViewItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewClick = async (itemId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/inventory/foodAndBeverages/${itemId}`
      );
      setViewItem(response.data);
      setIsViewModalOpen(true);
    } catch (err) {
      alert("Error fetching item details");
    }
  };

  const [editItem, setEditItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = async (itemId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/inventory/foodAndBeverages/${itemId}`
      );
      setEditItem(response.data); // Set the item details for editing
      setIsEditModalOpen(true); // Open the modal for editing
    } catch (err) {
      alert("Error fetching item details for editing");
    }
  };

  const handleDeleteClick = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(
          `http://localhost:4000/inventory/foodAndBeverages/${itemId}`
        );
        setFoodItems(foodItems.filter((item) => item._id !== itemId)); // Update the UI to reflect deletion
        alert("Item deleted successfully.");
      } catch (err) {
        setError("Error deleting item");
      }
    }
  };

  // Fetch low stock items
  const fetchLowStockItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/inventory/foodAndBeverages/low-stock"
      );

      // Transform data: Extract only the date part
      const formattedData = response.data.map((item) => ({
        ...item,
        expiryDate: new Date(item.expiryDate).toISOString().split("T")[0], // Extract YYYY-MM-DD
      }));

      setLowStockItems(formattedData); // Set state with low stock items
      setIsLowStock(true); // Toggle to show low stock items
      setIsCloseToExpiry(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching low stock items");
    }
  };

  // Fetch items close to expiry (within 3 days)
  const fetchCloseToExpiryItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/inventory/foodAndBeverages/close-to-expiry"
      );
      const formattedData = response.data.map((item) => ({
        ...item,
        expiryDate: new Date(item.expiryDate).toISOString().split("T")[0],
      }));
      setCloseToExpiryItems(formattedData);
      setIsCloseToExpiry(true);
      setIsLowStock(false); // Reset low stock state
    } catch (err) {
      setError(
        err.response?.data?.message || "Error fetching items close to expiry"
      );
    }
  };

  // Handle row click
  const handleRowClick = (row) => {
    alert(`Clicked on: ${row.itemName}`);
  };

  const filteredItems = (
    isLowStock
      ? lowStockItems
      : isCloseToExpiry
      ? closeToExpiryItems
      : foodItems
  ).filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add New Item
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formFields = [
    {
      name: "itemName",
      label: "Item Name ",
      type: "text",
      placeholder: "Enter the Item Name",
    },
    {
      name: "category",
      label: "Category ",
      type: "select",
      options: [
        "Dairy Products",
        "Beverages",
        "Snacks & Sweets",
        "Spices",
        "Vegetables",
        "Fruits",
        "Grains",
      ],
    },
    {
      name: "quantity",
      label: "Quantity ",
      type: "number",
      placeholder: "Enter the Quantity",
    },
    {
      name: "weightVolume",
      label: "Weight / Volume ",
      type: "number",
      placeholder: "Enter the Weight or Volume",
    },
    {
      name: "unitOfMeasure",
      label: "Unit of Measure",
      type: "select",
      options: ["kg", "l", "g", "ml", "Pieces"],
    },
    {
      name: "expiryDate",
      label: "Expiry Date ",
      type: "date",
      placeholder: "",
    },
    {
      name: "storageTypeLocation",
      label: "Storage Type / Location",
      type: "text",
      placeholder: "Enter the Storage Type / Location",
    },
    {
      name: "minimumLevel",
      label: "Minimum Level ",
      type: "number",
      placeholder: "Enter the Minimum Level",
    },
  ];

  const handleSubmit = async (data) => {
    try {
      let response;

      if (editItem) {
        // If editing an item, make a PUT request to update the item
        response = await axios.put(
          `http://localhost:4000/inventory/foodAndBeverages/${editItem._id}`,
          data
        );
      } else {
        // If adding a new item, make a POST request
        response = await axios.post(
          "http://localhost:4000/inventory/foodAndBeverages",
          data
        );
      }

      // Check if the response status is success before showing success message
      if (response.status >= 200 && response.status < 300) {
        alert(response.data.message); // Success message
        setIsModalOpen(false); // Close modal
        window.location.reload(); // Reload the page to fetch updated data
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error details:", error);
      alert(error.response?.data?.message || "Error saving item");
      setIsModalOpen(false);
    }
  };


  return (
    <div className="flex p-2">
      {/* Sidebar */}
      <SideBarInventory />
      {/* Main Content */}

      <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-4">
        <h1 className="text-3xl font-bold text-gray-900 pl-5">
          FOOD & BEVERAGES
        </h1>
        {/* Action Buttons and Search Box */}
        <div className="flex items-center justify-between p-5">
          {/* Left: Add New Item */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-600 shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Item
          </button>
          <ReusablePopUp
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Add New Food & Beverages"
          >
            <ReusableForm
              fields={formFields}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </ReusablePopUp>

          {/* Middle: Search Box */}
          <div className="relative flex items-center w-1/3">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
            />
            <FaSearch className="absolute right-3 text-gray-500" />
          </div>

          {/* Right: Other Buttons */}
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-600 shadow-md"
              onClick={() => {
                setIsLowStock(false); // Reset to show all items
                setIsCloseToExpiry(false);
                navigate("/foodAndBeverages"); // Fetch all items again
              }}
            >
              All Items
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-yellow-600 shadow-md"
              onClick={fetchLowStockItems}
            >
              Low Stocks
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 shadow-md"
              onClick={fetchCloseToExpiryItems}
            >
              Items Close to Expire
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-700 shadow-md">
              <FaFilePdf /> Export PDF
            </button>
          </div>
        </div>

        <div className="pt-5">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-600">No items found</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <ReusableTable
                columns={columns}
                data={filteredItems.map((item) => ({
                  ...item,
                  viewAction: (
                    <button
                      onClick={() => handleViewClick(item._id)}
                      className="text-green-700 hover:underline flex items-center"
                    >
                      <FaEye size={25} />
                    </button>
                  ),
                  editAction: (
                    <button
                      onClick={() => handleEditClick(item._id)}
                      className="text-blue-700 hover:underline flex items-center"
                    >
                      <FaEdit size={25} />
                    </button>
                  ),
                  deleteAction: (
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="text-red-700 hover:underline flex items-center"
                    >
                      <FaTrash size={25} />
                    </button>
                  ),
                }))}
              />
            </div>
          )}
        </div>
      </div>

      <ReusablePopUp
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="View Food & Beverage Details"
      >
        {viewItem && (
          <ReusableForm
            fields={[
              {
                name: "itemName",
                label: "Item Name",
                type: "text",
                value: viewItem.itemName,
              },
              {
                name: "category",
                label: "Category",
                type: "text",
                value: viewItem.category,
              },
              {
                name: "quantity",
                label: "Quantity",
                type: "number",
                value: viewItem.quantity,
              },
              {
                name: "weightVolume",
                label: "Weight / Volume",
                type: "text",
                value: viewItem.weightVolume,
              },
              {
                name: "unitOfMeasure",
                label: "Unit of Measure",
                type: "text",
                value: viewItem.unitOfMeasure,
              },
              {
                name: "expiryDate",
                label: "Expiry Date",
                type: "text",
                value: new Date(viewItem.expiryDate)
                  .toISOString()
                  .split("T")[0],
              },
              {
                name: "storageTypeLocation",
                label: "Storage Type / Location",
                type: "text",
                value: viewItem.storageTypeLocation,
              },
              {
                name: "minimumLevel",
                label: "Minimum Level",
                type: "number",
                value: viewItem.minimumLevel,
              },
            ]}
            onSubmit={() => {}}
            onCancel={() => setIsViewModalOpen(false)}
            readOnly={true} // Optional: Makes form fields read-only for viewing
          />
        )}
      </ReusablePopUp>

      <ReusablePopUp
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Food & Beverage"
      >
        {editItem && (
          <ReusableForm
            fields={[
              {
                name: "itemName",
                label: "Item Name",
                type: "text",
                value: editItem.itemName, // Use editItem instead of viewItem
              },
              {
                name: "category",
                label: "Category",
                type: "select",
                value: editItem.category, // Use editItem instead of viewItem
                options: [
                  "Dairy Products",
                  "Beverages",
                  "Snacks & Sweets",
                  "Spices",
                  "Vegetables",
                  "Fruits",
                  "Grains",
                ],
              },
              {
                name: "quantity",
                label: "Quantity",
                type: "number",
                value: editItem.quantity, // Use editItem instead of viewItem
              },
              {
                name: "weightVolume",
                label: "Weight / Volume",
                type: "text",
                value: editItem.weightVolume, // Use editItem instead of viewItem
              },
              {
                name: "unitOfMeasure",
                label: "Unit of Measure",
                type: "select",
                value: editItem.unitOfMeasure, // Use editItem instead of viewItem
                options: ["kg", "l", "g", "ml", "Pieces"],
              },
              {
                name: "expiryDate",
                label: "Expiry Date",
                type: "date",
                value: new Date(editItem.expiryDate)
                  .toISOString()
                  .split("T")[0], // Use editItem instead of viewItem
              },
              {
                name: "storageTypeLocation",
                label: "Storage Type / Location",
                type: "text",
                value: editItem.storageTypeLocation, // Use editItem instead of viewItem
              },
              {
                name: "minimumLevel",
                label: "Minimum Level",
                type: "number",
                value: editItem.minimumLevel, // Use editItem instead of viewItem
              },
            ]}
            onSubmit={handleSubmit} // Call submit handler for form submission
            onCancel={() => setIsEditModalOpen(false)} // Close modal on cancel
            readOnly={false} // Make the form fields editable
          />
        )}
      </ReusablePopUp>
    </div>
  );
};

export default FoodAndBeverages;
