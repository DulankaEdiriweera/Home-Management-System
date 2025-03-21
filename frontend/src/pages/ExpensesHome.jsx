import React, { useState, useEffect } from "react";
import ExpenseSidebar from "../components/ExpensesSideBar";

const ExpensesHome = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      processDataForChart();
    }
  }, [expenses, selectedMonth]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/expenses");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setExpenses(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expenses. Please try again.");
      setLoading(false);
    }
  };

  const processDataForChart = () => {
    // Filter expenses by selected month if any
    const filteredExpenses = selectedMonth 
      ? expenses.filter(expense => expense.month === selectedMonth)
      : expenses;

    // Calculate total amount
    const total = filteredExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount), 
      0
    );
    setTotalAmount(total);

    // Group expenses by category
    const categories = {};
    filteredExpenses.forEach(expense => {
      const category = expense.category;
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += parseFloat(expense.amount);
    });

    // Convert to array format for chart rendering
    const chartData = Object.keys(categories).map((category, index) => {
      return {
        category,
        value: categories[category],
        percentage: ((categories[category] / total) * 100).toFixed(1),
        color: getColorByIndex(index)
      };
    });

    setCategoryData(chartData);
  };

  // Get a color from predefined palette based on index
  const getColorByIndex = (index) => {
    const colors = [
      "#3B82F6", // blue-500
      "#EF4444", // red-500
      "#10B981", // green-500
      "#F59E0B", // amber-500
      "#8B5CF6", // violet-500
      "#EC4899", // pink-500
      "#06B6D4", // cyan-500
      "#F97316", // orange-500
      "#6366F1", // indigo-500
      "#14B8A6", // teal-500
    ];
    return colors[index % colors.length];
  };

  // Format number as LKR
  const formatAsLKR = (amount) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate the SVG coordinates for each donut segment
  const renderDonutChart = () => {
    const size = 250;
    const radius = size / 2;
    const innerRadius = radius * 0.6; // Hole size
    const center = size / 2;
    
    let startAngle = 0;
    const segments = categoryData.map((item, index) => {
      const percentage = parseFloat(item.percentage);
      const angle = (percentage / 100) * 360;
      const endAngle = startAngle + angle;
      
      // Calculate the SVG arc path
      const x1 = center + radius * Math.cos(Math.PI * startAngle / 180);
      const y1 = center + radius * Math.sin(Math.PI * startAngle / 180);
      const x2 = center + radius * Math.cos(Math.PI * endAngle / 180);
      const y2 = center + radius * Math.sin(Math.PI * endAngle / 180);
      
      const x3 = center + innerRadius * Math.cos(Math.PI * endAngle / 180);
      const y3 = center + innerRadius * Math.sin(Math.PI * endAngle / 180);
      const x4 = center + innerRadius * Math.cos(Math.PI * startAngle / 180);
      const y4 = center + innerRadius * Math.sin(Math.PI * startAngle / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // Outer arc
      const path = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');
      
      // Store the current angle as the start for the next segment
      startAngle = endAngle;
      
      return (
        <path
          key={index}
          d={path}
          fill={item.color}
          stroke="#fff"
          strokeWidth="1"
        />
      );
    });

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="bold"
        >
          Total
        </text>
        <text
          x={center}
          y={center + 20}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="bold"
        >
          {formatAsLKR(totalAmount)}
        </text>
      </svg>
    );
  };

  return (
    <div className="flex p-2">
      <ExpenseSidebar />
      <div className="flex-1 p-6 bg-gray-200 min-h-screen rounded-2xl ml-4">
        <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome To The Expense Tracker</h1>
          <h2 className="text-2xl font-bold mb-4">Expense Overview</h2>
          
          
          <div className="mb-4">
            <label className="mr-2 font-medium">Filter by Month:</label>
            <select
              className="border px-3 py-2 rounded-lg"
              onChange={(e) => setSelectedMonth(e.target.value)}
              value={selectedMonth}
            >
              <option value="">All Months</option>
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading expense data...</p>
          </div>
        ) : categoryData.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <p className="text-gray-600">No expense data available for the selected period.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md col-span-2">
              <h3 className="text-xl font-bold mb-4">Expense Distribution by Category</h3>
              <div className="flex justify-center">
                {renderDonutChart()}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Category Breakdown</h3>
              <div className="space-y-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.category}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        {formatAsLKR(item.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatAsLKR(totalAmount)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md col-span-3">
              <h3 className="text-xl font-bold mb-4">Key Insights</h3>
              
              {categoryData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Highest Expense Category</p>
                    <p className="text-xl font-bold mt-1">
                      {categoryData.sort((a, b) => b.value - a.value)[0].category}
                    </p>
                    <p className="text-lg">
                      {formatAsLKR(categoryData.sort((a, b) => b.value - a.value)[0].value)}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">Lowest Expense Category</p>
                    <p className="text-xl font-bold mt-1">
                      {categoryData.sort((a, b) => a.value - b.value)[0].category}
                    </p>
                    <p className="text-lg">
                      {formatAsLKR(categoryData.sort((a, b) => a.value - b.value)[0].value)}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-800 font-medium">Average Per Category</p>
                    <p className="text-xl font-bold mt-1">
                      {formatAsLKR(totalAmount / categoryData.length)}
                    </p>
                    <p className="text-lg">
                      across {categoryData.length} categories
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesHome;