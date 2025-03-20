import { useState, useEffect } from "react";
import ExpenseSidebar from '../components/ExpensesSideBar';

const ExpenseForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    category: "Food and beverages",
    paymentMethod: "Cash",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:4000/expenses");
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        isUpdating ? `http://localhost:4000/expenses/${currentExpenseId}` : "http://localhost:4000/expenses",
        {
          method: isUpdating ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Failed to save expense");
      const savedExpense = await response.json();
      setExpenses(
        isUpdating
          ? expenses.map((exp) => (exp._id === currentExpenseId ? savedExpense.expense : exp))
          : [...expenses, savedExpense.expense]
      );
      resetForm();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/expenses/${id}`, { method: "DELETE" });
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const resetForm = () => {
    setFormData({ amount: "", date: "", category: "Food and beverages", paymentMethod: "Cash", description: "" });
    setIsUpdating(false);
    setCurrentExpenseId(null);
  };

  const handleUpdateClick = (expense) => {
    setIsUpdating(true);
    setCurrentExpenseId(expense._id);
    setFormData({
      amount: expense.amount,
      date: expense.date.split("T")[0], // Ensuring proper date format
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      description: expense.description,
    });
  };

  return (

    <div className="flex p-2">
      {/* Sidebar */}
      <ExpenseSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-4 overflow-y-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">{isUpdating ? "Update" : "Add"} Expense</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["Food and beverages", "Cleaning Supplies", "Personal Care", "Furniture and Electronic Items", "Tools and Maintenance Items"].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["Cash", "Card"].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {isUpdating ? "Update Expense" : "Add Expense"}
          </button>
          {isUpdating && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          )}
        </form>
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Expense List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-center rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                {["Amount", "Date", "Category", "Payment Method", "Description", "Actions"].map((head) => (
                  <th key={head} className="border p-3">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="border-t">
                  <td className="p-3">${expense.amount}</td>
                  <td className="p-3">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-3">{expense.category}</td>
                  <td className="p-3">{expense.paymentMethod}</td>
                  <td className="p-3">{expense.description}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button onClick={() => handleUpdateClick(expense)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Update</button>
                    <button onClick={() => handleDelete(expense._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
