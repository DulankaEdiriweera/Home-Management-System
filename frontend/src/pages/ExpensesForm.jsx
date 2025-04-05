import React, { useState, useEffect, useRef } from "react";
import ExpenseSideBar from "../components/ExpensesSideBar";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [error, setError] = useState(null);
  const printRef = useRef();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    amount: "",
    month: "",
    date: "",
    category: "",
    paymentMethod: "",
    description: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:4000/expenses", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          "Content-Type": "application/json", // Ensure proper content type
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expenses. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.month || !formData.date || !formData.category || !formData.paymentMethod || !formData.description) {
      setError("All fields are required!");
      return;
    }

    try {
      setError(null);
      const url = isUpdating 
        ? `http://localhost:4000/expenses/${selectedExpenseId}` 
        : "http://localhost:4000/expenses";
      const method = isUpdating ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit data");

      // After successful submission, fetch fresh data
      await fetchExpenses();
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting expense:", error);
      setError("Failed to submit. Please try again.");
    }
};

const handleDeleteClick = (id) => {
  setExpenseToDelete(id);
  setShowDeleteModal(true);
};

const handleDelete = async () => {
  if (!expenseToDelete) {
    console.error("No expense ID provided for deletion");
    setError("No expense selected for deletion.");
    return;
  }

  try {
    console.log("Deleting expense with ID:", expenseToDelete); // Debugging

    const response = await fetch(
      `http://localhost:4000/expenses/${expenseToDelete}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = await response.json(); // Read response

    if (!response.ok) {
      console.error("Error response from backend:", responseData);
      throw new Error(responseData.message || "Failed to delete expense");
    }

    console.log("Expense deleted successfully:", responseData);
    await fetchExpenses();
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  } catch (error) {
    console.error("Error deleting expense:", error);
    setError(error.message);
    setShowDeleteModal(false);
  }
};




  const formatDateForInput = (dateString) => {
    // Convert date string to YYYY-MM-DD format for the input
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Return empty if invalid date

      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  
  

  const handleUpdateClick = (expense) => {
    setFormData({
      amount: expense.amount,
      month: expense.month,
      date: formatDateForInput(expense.date), // Format date for input element
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      description: expense.description,
    });
    setSelectedExpenseId(expense._id);
    setIsUpdating(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      month: "",
      date: "",
      category: "",
      paymentMethod: "",
      description: "",
    });
    setIsUpdating(false);
    setSelectedExpenseId(null);
    setError(null);
  };

  const getMonthNumber = (monthName) => {
    return (new Date(Date.parse(monthName + " 1, 2024")).getMonth() + 1)
      .toString()
      .padStart(2, "0");
  };

  const getCurrentYear = () => new Date().getFullYear();

  // Get the last day of the selected month
  const getLastDayOfMonth = (monthName) => {
    const monthNumber = getMonthNumber(monthName);
    const year = getCurrentYear();
    // Create a date for the first day of the next month, then subtract one day
    const lastDay = new Date(year, parseInt(monthNumber), 0).getDate();
    return lastDay.toString().padStart(2, "0");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "month") {
      // When month changes, reset the date field
      setFormData((prev) => ({
        ...prev,
        month: value,
        date: "",
      }));
    } else if (name === "amount") {
      // Only allow positive numbers for amount field
      if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Format number as LKR
  const formatAsLKR = (amount) => {
    return new Intl.NumberFormat("LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filter expenses based on search query (category only) and month
  const filteredExpenses = expenses.filter(
    (expense) =>
      (searchQuery === "" ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (searchMonth === "" || expense.month === searchMonth)
  );

  // Calculate total amount
  const totalAmount = filteredExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );

  // Generate PDF report using client-side JavaScript
  const generatePDF = () => {
    // Create a printable version of the data
    const printWindow = window.open("", "_blank", "height=600,width=800");

    if (!printWindow) {
      setError("Pop-up blocked! Please allow pop-ups for this website.");
      return;
    }

    // Generate HTML content for printing
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expense Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #7CB9E8; }
          .total-row { font-weight: bold; background-color: #f2f2f2; }
          .no-print { margin-top: 20px; text-align: center; }
          @media print {
            .no-print { display: none; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Expense Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        ${searchMonth ? `<p>Month: ${searchMonth}</p>` : ""}
        ${searchQuery ? `<p>Search Filter: ${searchQuery}</p>` : ""}
        
        <table>
          <thead>
            <tr>
               <th>Amount</th>
              <th>Month</th>
              <th>Date</th>
              <th>Category</th>
              <th>Payment Method</th>
              <th>Description</th>
             
            </tr>
          </thead>
          <tbody>
            ${filteredExpenses
              .map(
                (expense) => `
              <tr>
                <td>${formatAsLKR(expense.amount)}</td>
                <td>${expense.month}</td>
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.category}</td>
                <td>${expense.paymentMethod}</td>
                <td>${expense.description}</td>
              </tr>
            `
              )
              .join("")}
            <tr class="total-row">
              <td>${formatAsLKR(totalAmount)}</td>
              <td colspan="5">Total</td>
            </tr>
          </tbody>
        </table>
        
        <div class="no-print">
          <button onclick="window.print();">Print Report</button>
          <button onclick="window.close();">Close</button>
        </div>
        
        <script>
          // Auto-trigger print dialog when the page loads
          window.onload = function() {
            // Small delay to ensure content is fully loaded
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    // Write the HTML content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="flex p-2">
      <ExpenseSideBar />
      <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Expense Tracker</h2>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by category..."
                className="border px-3 py-2 rounded-lg"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="border px-3 py-2 rounded-lg"
                onChange={(e) => setSearchMonth(e.target.value)}
                value={searchMonth}
              >
                <option value="">All Months</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => setShowModal(true)}
            >
              Add Expense
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={generatePDF}
            >
              Export as PDF
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Expense Table */}
        <div className="overflow-x-auto" ref={printRef}>
          <table className="w-full border border-gray-300 text-center rounded-lg overflow-hidden">
            <thead>
              <tr
                style={{ backgroundColor: "#7CB9E8" }}
                className="text-gray-700"
              >
                {[
                  "Month",
                  "Date",
                  "Category",
                  "Payment Method",
                  "Description",
                  "Amount",
                  "Actions",
                ].map((head) => (
                  <th key={head} className="border p-3">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center">
                    No expenses found. Add one to get started!
                  </td>
                </tr>
              ) : (
                <>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="border-t">
                      <td className="p-3">{expense.month}</td>
                      <td className="p-3">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="p-3">{expense.category}</td>
                      <td className="p-3">{expense.paymentMethod}</td>
                      <td className="p-3">{expense.description}</td>
                      <td className="p-3">{formatAsLKR(expense.amount)}</td>
                      <td className="p-3 flex gap-2 justify-center">
                        <button
                          onClick={() => handleUpdateClick(expense)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteClick(expense._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 border-t">
                    <td className="p-3 font-bold">
                      Total = {formatAsLKR(totalAmount)}
                    </td>
                    <td colSpan="6" className="p-3 text-left font-bold"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Expense Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                  {isUpdating ? "Update" : "Add"} Expense
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (LKR) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount in LKR"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month *
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select Month
                    </option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min={
                      formData.month
                        ? `${getCurrentYear()}-${getMonthNumber(
                            formData.month
                          )}-01`
                        : ""
                    }
                    max={
                      formData.month
                        ? `${getCurrentYear()}-${getMonthNumber(
                            formData.month
                          )}-${getLastDayOfMonth(formData.month)}`
                        : ""
                    }
                    disabled={!formData.month}
                  />
                  {formData.month && (
                    <p className="text-xs text-gray-500 mt-1">
                      Select a date in {formData.month} {getCurrentYear()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {[
                      "Food and beverages",
                      "Cleaning Supplies",
                      "Personal Care",
                      "Furniture and Electronic Items",
                      "Tools and Maintenance Items",
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select Payment Method
                    </option>
                    {["Cash", "Card"].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter expense description"
                  />
                </div>

                <div className="mt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isUpdating ? "Update" : "Add"} Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Expense
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete this expense? This action
                  cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
