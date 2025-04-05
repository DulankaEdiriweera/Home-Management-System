import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaChartPie, 
  FaShoppingCart, 
  FaExclamationCircle, 
  FaDollarSign, 
  FaStore, 
  FaBoxOpen, 
  FaList,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [shoppingItems, setShoppingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Statistics state
  const [stats, setStats] = useState({
    totalItems: 0,
    totalEstimatedPrice: 0,
    highPriorityItems: 0,
    categoriesCount: {},
    storesCount: {},
    topExpensiveItems: []
  });

  useEffect(() => {
    fetchShoppingListItems();
  }, []);

  const fetchShoppingListItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/shoppingList", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShoppingItems(response.data);
      calculateStatistics(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (items) => {
    // Total items
    const totalItems = items.length;
    
    // Total estimated price
    const totalEstimatedPrice = items.reduce((total, item) => 
      total + (item.estimatedPrice ? parseFloat(item.estimatedPrice) : 0), 0);
    
    // High priority items
    const highPriorityItems = items.filter(item => item.priority === "High").length;
    
    // Categories count
    const categoriesCount = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    // Stores count
    const storesCount = items.reduce((acc, item) => {
      if (item.store) {
        acc[item.store] = (acc[item.store] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Top expensive items (top 5)
    const topExpensiveItems = [...items]
      .filter(item => item.estimatedPrice)
      .sort((a, b) => parseFloat(b.estimatedPrice) - parseFloat(a.estimatedPrice))
      .slice(0, 5);
    
    setStats({
      totalItems,
      totalEstimatedPrice,
      highPriorityItems,
      categoriesCount,
      storesCount,
      topExpensiveItems
    });
  };

  // Prepare chart data
  const prepareCategoryChartData = () => {
    return Object.entries(stats.categoriesCount).map(([category, count]) => ({
      name: category,
      value: count
    }));
  };

  const preparePriorityChartData = () => {
    const priorityCounts = {
      High: shoppingItems.filter(item => item.priority === "High").length,
      Medium: shoppingItems.filter(item => item.priority === "Medium").length,
      Low: shoppingItems.filter(item => item.priority === "Low").length,
    };
    
    return Object.entries(priorityCounts).map(([priority, count]) => ({
      name: priority,
      value: count
    }));
  };

  const prepareTopExpensiveItemsData = () => {
    return stats.topExpensiveItems.map(item => ({
      name: item.itemName,
      price: parseFloat(item.estimatedPrice)
    }));
  };

  const prepareStoreCounts = () => {
    return Object.entries(stats.storesCount)
      .map(([store, count]) => ({
        name: store,
        value: count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Get top 5 stores
  };

  // Colors for charts
  const CATEGORY_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];
  const PRIORITY_COLORS = {
    High: '#ef4444',  // Red
    Medium: '#f59e0b', // Amber
    Low: '#10b981'    // Green
  };

  // Cards data
  const infoCards = [
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: <FaShoppingCart className="text-blue-500 text-3xl" />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "High Priority",
      value: stats.highPriorityItems,
      percentage: stats.totalItems ? Math.round((stats.highPriorityItems / stats.totalItems) * 100) : 0,
      icon: <FaExclamationCircle className="text-red-500 text-3xl" />,
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Categories",
      value: Object.keys(stats.categoriesCount).length,
      icon: <FaList className="text-purple-500 text-3xl" />,
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Total Estimated",
      value: `LKR ${stats.totalEstimatedPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <FaDollarSign className="text-green-500 text-3xl" />,
      color: "bg-green-100 text-green-800",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-md">
          <h3 className="font-bold text-xl mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate("/shopping-list")}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back to Shopping List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex p-2 bg-gray-50">
      <div className="flex-1 p-6 bg-white shadow-lg min-h-screen rounded-2xl ml-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            <FaChartPie className="inline-block mr-2 text-blue-600" />
            SHOPPING LIST DASHBOARD
          </h1>
          <p className="text-gray-500 mt-2">Overview of your shopping list statistics</p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/shopping-list")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <FaShoppingCart /> View Shopping List
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {infoCards.map((card, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl shadow-md border-l-4 ${card.color} border-l-${card.color.split(" ")[0].replace('bg-', '')}-500`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-500 text-sm uppercase font-semibold">{card.title}</h3>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  {card.percentage !== undefined && (
                    <div className="flex items-center mt-2 text-sm">
                      <span>{card.percentage}% of total</span>
                      {card.percentage > 30 ? (
                        <FaArrowUp className="ml-1 text-red-500" />
                      ) : (
                        <FaArrowDown className="ml-1 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-full bg-white shadow-sm">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution Chart */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">Category Distribution</h3>
            <div className="h-64">
              {stats.totalItems > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareCategoryChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareCategoryChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Priority Distribution Chart */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">Priority Distribution</h3>
            <div className="h-64">
              {stats.totalItems > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePriorityChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {preparePriorityChartData().map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={PRIORITY_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Most Expensive Items Chart */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">Most Expensive Items</h3>
            <div className="h-64">
              {stats.topExpensiveItems.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareTopExpensiveItemsData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`LKR ${value.toFixed(2)}`, 'Price']} />
                    <Bar dataKey="price" fill="#82ca9d" name="Price (LKR)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Stores Chart */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">Most Used Stores</h3>
            <div className="h-64">
              {Object.keys(stats.storesCount).length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareStoreCounts()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                    <Bar dataKey="value" fill="#8884d8" name="Number of Items" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No store data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;