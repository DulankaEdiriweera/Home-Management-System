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
import Swal from "sweetalert2";

const FurnitureAndElectronics = () => {
  const navigate = useNavigate();
  const [householdItems, sethouseholdItems] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState("");

  //Define table columns
  const columns = [
    { header: "Item Name", accessor: "itemName" },
    { header: "Category", accessor: "category" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Storage Type / Location", accessor: "storageTypeLocation" },
    { header: "View", accessor: "viewAction" },
    { header: "Edit", accessor: "editAction" },
    { header: "Delete", accessor: "deleteAction" },
  ];

  // Fetch Household items from backend using Axios
  useEffect(() => {
    const fetchHouseholdItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/inventory/householdItems"
        );

        sethouseholdItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholdItems();
  }, []);

  const filteredItems = householdItems.filter(
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
        "Furniture",
        "Kitchen Item",
        "Electronic Item",
        "Lighting",
        "Clothing Item",
      ],
    },
    {
      name: "quantity",
      label: "Quantity ",
      type: "number",
      placeholder: "Enter the Quantity",
    },
    {
      name: "storageTypeLocation",
      label: "Storage Type / Location",
      type: "text",
      placeholder: "Enter the Storage Type / Location",
    },
  ];

  const handleSubmit = async (data) => {
    try {
      let response;

      if (editItem) {
        // If editing an item, make a PUT request to update the item
        response = await axios.put(
          `http://localhost:4000/inventory/householdItems/${editItem._id}`,
          data
        );
      } else {
        // If adding a new item, make a POST request
        response = await axios.post(
          "http://localhost:4000/inventory/householdItems",
          data
        );
      }

      // Check if the response status is success before showing success message
      if (response.status >= 200 && response.status < 300) {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          setIsModalOpen(false); // Close modal
          window.location.reload(); // Reload the page to fetch updated data
        });
      } else {
        Swal.fire({
          title: "Unexpected Response",
          text: "Unexpected response from server.",
          icon: "warning",
        });
      }
    } catch (error) {
      console.error("Error details:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Error saving item",
        icon: "error",
      });
      setIsModalOpen(false);
    }
  };

  // View an Item
  const [viewItem, setViewItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewClick = async (itemId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/inventory/householdItems/${itemId}`
      );
      setViewItem(response.data);
      setIsViewModalOpen(true);
    } catch (err) {
      alert("Error fetching item details");
    }
  };

  // Edit an Item
  const [editItem, setEditItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = async (itemId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/inventory/householdItems/${itemId}`
      );
      setEditItem(response.data); // Set the item details for editing
      setIsEditModalOpen(true); // Open the modal for editing
    } catch (err) {
      alert("Error fetching item details for editing");
    }
  };

  // Delete an Item
  const handleDeleteClick = async (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you won't be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:4000/inventory/householdItems/${itemId}`
          );
  
          sethouseholdItems(
            householdItems.filter((item) => item._id !== itemId)
          );
  
          Swal.fire({
            title: "Deleted!",
            text: "The item has been removed successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err) {
          setError("Error deleting item");
  
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the item. Please try again.",
            icon: "error",
          });
        }
      }
    });
  };

  // Download PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title with style
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Household Items Inventory Report", 14, 20);

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
      const tableHeader = [["Item Name", "Quantity", "Storage Location"]];

      // Table data
      const tableData = items.map((item) => [
        item.itemName,
        item.quantity,
        item.storageTypeLocation || "N/A",
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
    doc.save("Household_Inventory.pdf");
  };

  return (
    <div className="flex p-2">
      {/* Sidebar */}
      <SideBarInventory />
      {/* Main Content */}

      <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-2">
        <h1 className="text-3xl font-bold text-gray-900 pl-5">
          HOUSEHOLD ITEMS
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
                      className="text-green-700 hover:underline flex items-center"
                      onClick={() => handleViewClick(item._id)}
                    >
                      <FaEye size={25} />
                    </button>
                  ),
                  editAction: (
                    <button
                      className="text-blue-700 hover:underline flex items-center"
                      onClick={() => handleEditClick(item._id)}
                    >
                      <FaEdit size={25} />
                    </button>
                  ),
                  deleteAction: (
                    <button
                      className="text-red-700 hover:underline flex items-center"
                      onClick={() => handleDeleteClick(item._id)}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Household Items"
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
        title="View Household Item Details"
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
                name: "storageTypeLocation",
                label: "Storage Type / Location",
                type: "text",
                value: viewItem.storageTypeLocation,
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
        title="Edit Household Items"
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
                  "Furniture",
                  "Kitchen Item",
                  "Electronic Item",
                  "Lighting",
                  "Clothing Item",
                ],
              },
              {
                name: "quantity",
                label: "Quantity",
                type: "number",
                value: editItem.quantity,
              },
              {
                name: "storageTypeLocation",
                label: "Storage Type / Location",
                type: "text",
                value: editItem.storageTypeLocation,
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

export default FurnitureAndElectronics;
