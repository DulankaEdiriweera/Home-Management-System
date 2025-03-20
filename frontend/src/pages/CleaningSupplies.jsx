import React, { useEffect, useState } from "react";
import axios from "axios";
import ReusableTable from "../components/ReusableTable";
import { FaSearch, FaFilePdf, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SideBarInventory from "../components/SideBarInventory";
import ReusablePopUp from "../components/ReusablePopUp";
import ReusableForm from "../components/ReusableForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CleaningSupplies = () => {
  const navigate = useNavigate();
  const [cleaningSuppplies, setcleaningSuppplies] = useState([]); // State to store fetched items
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

  // Fetch Cleaning Supplies from backend using Axios
  useEffect(() => {
    const fetchCleaningSupplies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/inventory/cleaningSupplies"
        );

        // Transform data: Extract only the date part
        const formattedData = response.data.map((item) => ({
          ...item,
          expiryDate: new Date(item.expiryDate).toISOString().split("T")[0], // Extract YYYY-MM-DD
        }));

        setcleaningSuppplies(formattedData); // Set state with fetched data
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchCleaningSupplies();
  }, []);

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
        "Household Cleaners",
        "Laundry Products",
        "Dishwashing Supplies",
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
          `http://localhost:4000/inventory/cleaningSupplies/${editItem._id}`,
          data
        );
      } else {
        // If adding a new item, make a POST request
        response = await axios.post(
          "http://localhost:4000/inventory/cleaningSupplies",
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

  //View Item
  const [viewItem, setViewItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewClick = async (itemId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/inventory/cleaningSupplies/${itemId}`
      );
      setViewItem(response.data);
      setIsViewModalOpen(true);
    } catch (err) {
      alert("Error fetching item details");
    }
  };

  //Edit Item
  const [editItem, setEditItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = async (itemId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/inventory/cleaningSupplies/${itemId}`
      );
      setEditItem(response.data); // Set the item details for editing
      setIsEditModalOpen(true); // Open the modal for editing
    } catch (err) {
      alert("Error fetching item details for editing");
    }
  };

  //Delete Item
  const handleDeleteClick = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(
          `http://localhost:4000/inventory/cleaningSupplies/${itemId}`
        );
        setcleaningSuppplies(
          cleaningSuppplies.filter((item) => item._id !== itemId)
        ); // Update the UI to reflect deletion
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
        "http://localhost:4000/inventory/cleaningSupplies/low-stock"
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
        "http://localhost:4000/inventory/cleaningSupplies/close-to-expiry"
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

  const filteredItems = (
    isLowStock
      ? lowStockItems
      : isCloseToExpiry
      ? closeToExpiryItems
      : cleaningSuppplies
  ).filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Download PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title with style
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Cleaning Supplies Inventory Report", 14, 20);

    // Add space after the title
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);

    // Group items by category
    const categoryData = {};
    filteredItems.forEach((item) => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = [];
      }
      categoryData[item.category].push(item);
    });

    let startY = 40; // Start position for tables

    // Loop through categories
    Object.entries(categoryData).forEach(([category, items]) => {
      // Category header
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(category, 14, startY); // Category Title
      startY += 8; // Move down

      // Table header with style
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const tableHeader = [
        [
          "Item Name",
          "Quantity",
          "Weight / Volume",
          "Unit",
          "Expiry Date",
          "Storage Location",
          "Minimum Level",
        ],
      ];

      // Table data
      const tableData = items.map((item) => [
        item.itemName,
        item.quantity,
        item.weightVolume,
        item.unitOfMeasure,
        item.expiryDate
          ? new Date(item.expiryDate).toISOString().split("T")[0]
          : "N/A",
        item.storageTypeLocation || "N/A",
        item.minimumLevel,
      ]);

      // Add table
      autoTable(doc, {
        startY,
        head: tableHeader,
        body: tableData,
        theme: "grid", // Add grid theme
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] }, // Header background color
        bodyStyles: { fillColor: [240, 240, 240] }, // Body row background color
        styles: { fontSize: 10, cellPadding: 3, halign: "center" },
      });

      // Update Y position for the next category
      startY = doc.lastAutoTable.finalY + 10;

      // Total items in category
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Items of ${category}: ${items.length}`, 14, startY);

      // Add some spacing before the next category
      startY += 15;
    });

    // Save the generated PDF
    doc.save("CleaningSupplies.pdf");
  };

  // Define the getRowClassName function in the parent component
  const getRowClassName = (row) => {
    const today = new Date().toISOString().split("T")[0];
    const expiryDate = new Date(row.expiryDate).toISOString().split("T")[0];
    const timeDiff = expiryDate - today;
    const daysToExpiry = timeDiff;

    if (row.quantity <= row.minimumLevel && daysToExpiry <= 3) {
      return "bg-gradient-to-r from-red-100 via-red-400 to-red-100";
    } else if (daysToExpiry <= 3) {
      return "bg-gradient-to-r from-red-100 via-red-500 to-red-100"; // Close to expiry
    } else if (row.quantity <= row.minimumLevel) {
      return "bg-gradient-to-r from-red-100 via-red-300 to-red-100"; // Low stock
    }
    return ""; // Default (no color)
  };

  return (
    <div className="flex p-2">
      {/* Sidebar */}
      <SideBarInventory />
      {/* Main Content */}

      <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-4">
        <h1 className="text-3xl font-bold text-gray-900 pl-5">
          CLEANING SUPPLIES
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
                navigate("/cleaningSupplies"); // Fetch all items again
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
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-700 shadow-md"
              onClick={handleExportPDF}
            >
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
                getRowClassName={getRowClassName}
              />
            </div>
          )}
        </div>
      </div>
      <ReusablePopUp
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Cleaning Supply"
      >
        <ReusableForm
          fields={formFields}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </ReusablePopUp>

      <ReusablePopUp
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="View Cleaning Supply Details"
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
        title="Edit Cleaning Supply"
      >
        {editItem && (
          <ReusableForm
            fields={[
              {
                name: "itemName",
                label: "Item Name",
                type: "text",
                value: editItem.itemName,
              },
              {
                name: "category",
                label: "Category",
                type: "select",
                value: editItem.category,
                options: [
                  "Household Cleaners",
                  "Laundry Products",
                  "Dishwashing Supplies",
                ],
              },
              {
                name: "quantity",
                label: "Quantity",
                type: "number",
                value: editItem.quantity,
              },
              {
                name: "weightVolume",
                label: "Weight / Volume",
                type: "text",
                value: editItem.weightVolume,
              },
              {
                name: "unitOfMeasure",
                label: "Unit of Measure",
                type: "select",
                value: editItem.unitOfMeasure,
                options: ["kg", "l", "g", "ml", "Pieces"],
              },
              {
                name: "expiryDate",
                label: "Expiry Date",
                type: "date",
                value: new Date(editItem.expiryDate)
                  .toISOString()
                  .split("T")[0],
              },
              {
                name: "storageTypeLocation",
                label: "Storage Type / Location",
                type: "text",
                value: editItem.storageTypeLocation,
              },
              {
                name: "minimumLevel",
                label: "Minimum Level",
                type: "number",
                value: editItem.minimumLevel,
              },
            ]}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditModalOpen(false)}
            readOnly={false}
          />
        )}
      </ReusablePopUp>
    </div>
  );
};

export default CleaningSupplies;
