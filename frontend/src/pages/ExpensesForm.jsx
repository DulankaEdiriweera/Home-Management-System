import React, { useState, useEffect, useRef } from "react";
import ExpenseSideBar from "../components/ExpensesSideBar";

//Expenses add page 

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]); // State to store list of expenses
  const [showModal, setShowModal] = useState(false); // State to control visibility of the Add/Edit Expense modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);  // State to control visibility of the Delete Confirmation modal
  const [expenseToDelete, setExpenseToDelete] = useState(null); // State to hold the expense selected for deletion
  const [isUpdating, setIsUpdating] = useState(false);  // Flag to indicate whether the form is in update mode
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);  // ID of the expense currently being edited
  const [searchQuery, setSearchQuery] = useState("");  // Search input for filtering expenses by description or other text
  const [searchMonth, setSearchMonth] = useState("");  // Search filter for selecting expenses by month
  const [error, setError] = useState(null);  // State to hold error messages if any occur during operations
  const printRef = useRef();  // Reference to the section/component to be printed (e.g., for reports)
  const token = localStorage.getItem("token");  // Retrieve authentication token from localStorage

  // Form data for adding or updating an expense
  const [formData, setFormData] = useState({
    amount: "",
    month: "",
    date: "",
    category: "",
    paymentMethod: "",
    description: "",
  });

  // Run this when the component first loads
  useEffect(() => {
    fetchExpenses();  // Get all expenses from the server
  }, []);

  // Function to get expenses from the server
  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:4000/expenses", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setExpenses(data); // Save data to state
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expenses. Please try again.");
    }
  };

  // Handle form submission for adding or updating an expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any field is empty
    if (
      !formData.amount ||
      !formData.month ||
      !formData.date ||
      !formData.category ||
      !formData.paymentMethod ||
      !formData.description
    ) {
      setError("All fields are required!");
      return;
    }

    try {
      setError(null); // Clear any previous errors

      // Decide the URL and method based on whether it's an update or a new entry
      const url = isUpdating
        ? `http://localhost:4000/expenses/${selectedExpenseId}`  // Update existing expense
        : "http://localhost:4000/expenses";   // Create new expense
      const method = isUpdating ? "PUT" : "POST";

      // Send the request to the server
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),  // Send the form data
      });

      if (!response.ok) throw new Error("Failed to submit data");

     // Refresh the expense list after a successful save
      await fetchExpenses();

      setShowModal(false);  // Close the form modal
      resetForm();    // Clear the form fields
    } catch (error) {
      console.error("Error submitting expense:", error);  // Handle any errors during form submission
      setError("Failed to submit. Please try again.");
    }
  };

  // When the delete icon/button is clicked, store the ID and show the delete confirmation modal
  const handleDeleteClick = (id) => {
    setExpenseToDelete(id);
    setShowDeleteModal(true);
  };

  // Handle actual deletion of an expense
  const handleDelete = async () => {
    if (!expenseToDelete) {
      console.error("No expense ID provided for deletion");
      setError("No expense selected for deletion.");  // Show error if no ID is provided
      return;
    }

    try {
      console.log("Deleting expense with ID:", expenseToDelete);  // Show error if no ID is provided

      // Send DELETE request to the server to remove the selected expense
      const response = await fetch(
        `http://localhost:4000/expenses/${expenseToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();  // Set method to DELETE

      // Check if the deletion was successful
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
      setShowDeleteModal(false);  // Close the delete confirmation modal after successful deletion
    }
  };

  // Format a date string to 'YYYY-MM-DD' format for input fields
  const formatDateForInput = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // When the user clicks "Edit", fill the form with the selected expense data
  const handleUpdateClick = (expense) => {
    setFormData({
      amount: expense.amount,
      month: expense.month,
      date: formatDateForInput(expense.date),
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      description: expense.description,
    });
    setSelectedExpenseId(expense._id);
    setIsUpdating(true);  // Enable update mode
    setShowModal(true);   // Open the modal with form pre-filled
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

  // Convert month name (e.g., "March") to two-digit month number (e.g., "03")
  const getMonthNumber = (monthName) => {
    return (new Date(Date.parse(monthName + " 1, 2024")).getMonth() + 1)
      .toString()
      .padStart(2, "0");
  };

  const getCurrentYear = () => new Date().getFullYear();

  const getLastDayOfMonth = (monthName) => {
    const monthNumber = getMonthNumber(monthName);
    const year = getCurrentYear();
    const lastDay = new Date(year, parseInt(monthNumber), 0).getDate();
    return lastDay.toString().padStart(2, "0");  // Return as two-digit string
  };

  // Handle input field changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the month is changed, also reset the date
    if (name === "month") {
      setFormData((prev) => ({
        ...prev,
        month: value,
        date: "",  // Clear date to force re-selection based on new month
      }));
    } 
    // Allow only valid numbers for amount (including empty input)
    else if (name === "amount") {
      if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } 
    // For all other fields, update normally
    else {
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

  const formatAsLKR = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filter expenses by search query and selected month
  const filteredExpenses = expenses.filter(
    (expense) =>
      (searchQuery === "" ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (searchMonth === "" || expense.month === searchMonth)
  );

  // Calculate total amount from filtered expenses
  const totalAmount = filteredExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );

  const generatePDF = () => {
    const printWindow = window.open("", "_blank", "height=600,width=800");

    if (!printWindow) {
      setError("Pop-up blocked! Please allow pop-ups for this website.");
      return;
    }

    //generate a printable expense report
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
              <td colSpan="5">Total</td>
            </tr>
          </tbody>
        </table>
        
        <div class="no-print">
          <button onclick="window.print();">Print Report</button>
          <button onclick="window.close();">Close</button>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="flex p-2">
      <ExpenseSideBar />
      <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Expense Tracker</h2>
          {/* Search by category and filter by month */}
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Expenses table */}
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
                {/* Map and render each expense row */}
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
                   {/* Form for adding/updating */}
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

        {/* Modal for adding or updating an expense */}
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

              {/* Form for adding/updating */}
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

        {/* Delete confirmation modal */}
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
                {/* Delete or cancel actions */}
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
