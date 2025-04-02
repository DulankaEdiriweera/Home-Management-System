import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import SideBarInventory from "./SideBarInventory";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Charts = () => {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]); //Food Items
  const [cleaningItems, setcleaningItems] = useState([]);
  const [personalcareItems, setpersonalcareItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedCleaningFilter, setSelectedCleaningFilter] = useState("all");
  const [selectedPersonalcareItemsFilter, setSelectedpersonalcareItemsFilter] = useState("all");

  // Fetch data using Axios
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/inventory/foodAndBeverages/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setItems(response.data); // Axios automatically parses JSON
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  //Cleaning items
  useEffect(() => {
    const fetchCleaningItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/inventory/cleaningSupplies/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setcleaningItems(response.data); // Axios automatically parses JSON
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchCleaningItems();
  }, []);

  //Personal items
  useEffect(() => {
    const fetchPersonalCareItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/inventory/personalCare/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setpersonalcareItems(response.data); // Axios automatically parses JSON
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchPersonalCareItems();
  }, []);

  // Function to filter items based on selected filter
  const filterItems = () => {
    const now = new Date();

    return items.filter((item) => {
      const expiryDate = new Date(item.expiryDate);
      const stockLevel = item.quantity;
      const minStock = item.minimumLevel;

      if (selectedFilter === "closeToExpire") {
        return (
          expiryDate > now && (expiryDate - now) / (1000 * 60 * 60 * 24) <= 3
        ); // Expiring within 7 days
      }
      if (selectedFilter === "expired") {
        return expiryDate < now;
      }
      if (selectedFilter === "lowStock") {
        return stockLevel <= minStock; // Filtering for low stock
      }
      return true; // "all"
    });
  };

  const filterCleaningItems = () => {
    const now = new Date();

    return cleaningItems.filter((item) => {
      const expiryDate = new Date(item.expiryDate);
      const stockLevel = item.quantity;
      const minStock = item.minimumLevel;

      if (selectedCleaningFilter === "closeToExpire") {
        return (
          expiryDate > now && (expiryDate - now) / (1000 * 60 * 60 * 24) <= 3
        ); // Expiring within 7 days
      }
      if (selectedCleaningFilter === "expired") {
        return expiryDate < now;
      }
      if (selectedCleaningFilter === "lowStock") {
        return stockLevel <= minStock; // Filtering for low stock
      }
      return true; // "all"
    });
  };

  const filterPersonalItems = () => {
    const now = new Date();

    return personalcareItems.filter((item) => {
      const expiryDate = new Date(item.expiryDate);
      const stockLevel = item.quantity;
      const minStock = item.minimumLevel;

      if (selectedPersonalcareItemsFilter === "closeToExpire") {
        return (
          expiryDate > now && (expiryDate - now) / (1000 * 60 * 60 * 24) <= 3
        ); // Expiring within 7 days
      }
      if (selectedPersonalcareItemsFilter === "expired") {
        return expiryDate < now;
      }
      if (selectedPersonalcareItemsFilter === "lowStock") {
        return stockLevel <= minStock; // Filtering for low stock
      }
      return true; // "all"
    });
  };

  // Prepare data for the chart
  const allItems = filterItems(); // This applies the filter
  const allCleaningItems = filterCleaningItems();
  const allPersonalCareItems = filterPersonalItems();

  const chartData = [
    { name: "All Items", count: items.length },
    {
      name: "Close to Expire",
      count: allItems.filter((item) => selectedFilter === "closeToExpire")
        .length,
    },
    {
      name: "Expired",
      count: allItems.filter((item) => selectedFilter === "expired").length,
    },
    {
      name: "Low Stock",
      count: allItems.filter((item) => selectedFilter === "lowStock").length,
    },
  ];

  const chartDataCleaning = [
    { name: "All Items", count: cleaningItems.length },
    {
      name: "Close to Expire",
      count: allCleaningItems.filter(
        (item) => selectedCleaningFilter === "closeToExpire"
      ).length,
    },
    {
      name: "Expired",
      count: allCleaningItems.filter(
        (item) => selectedCleaningFilter === "expired"
      ).length,
    },
    {
      name: "Low Stock",
      count: allCleaningItems.filter(
        (item) => selectedCleaningFilter === "lowStock"
      ).length,
    },
  ];

  const chartDataPersonalCare = [
    { name: "All Items", count: personalcareItems.length },
    {
      name: "Close to Expire",
      count: allPersonalCareItems.filter(
        (item) => selectedPersonalcareItemsFilter === "closeToExpire"
      ).length,
    },
    {
      name: "Expired",
      count: allPersonalCareItems.filter(
        (item) => selectedPersonalcareItemsFilter === "expired"
      ).length,
    },
    {
      name: "Low Stock",
      count: allPersonalCareItems.filter(
        (item) => selectedPersonalcareItemsFilter === "lowStock"
      ).length,
    },
  ];

  return (
    <div className="flex p-2">
      {/* Sidebar */}
      <SideBarInventory />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-2 overflow-y-auto">
        {/* Title & Filter Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">
            Food and Beverages Statistics
          </h1>

          {/* Filter Dropdown */}
          <select
            className="p-2 border border-gray-400 rounded-md bg-white text-gray-700"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="closeToExpire">Items Close to Expiry</option>
            <option value="expired">Already Expired</option>
            <option value="lowStock">Low Stock</option>
          </select>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <br />
        <br />
        {/* Title & Filter Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">
            Cleaning Supplies Statistics
          </h1>

          {/* Filter Dropdown */}
          <select
            className="p-2 border border-gray-400 rounded-md bg-white text-gray-700"
            value={selectedCleaningFilter}
            onChange={(e) => setSelectedCleaningFilter(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="closeToExpire">Items Close to Expiry</option>
            <option value="expired">Already Expired</option>
            <option value="lowStock">Low Stock</option>
          </select>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartDataCleaning}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <br />
        <br />
        {/* Title & Filter Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">
            Personal Care Statistics
          </h1>

          {/* Filter Dropdown */}
          <select
            className="p-2 border border-gray-400 rounded-md bg-white text-gray-700"
            value={selectedPersonalcareItemsFilter}
            onChange={(e) => setSelectedpersonalcareItemsFilter(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="closeToExpire">Items Close to Expiry</option>
            <option value="expired">Already Expired</option>
            <option value="lowStock">Low Stock</option>
          </select>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartDataPersonalCare}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
     
        
      
    </div>
  );
};

export default Charts;
