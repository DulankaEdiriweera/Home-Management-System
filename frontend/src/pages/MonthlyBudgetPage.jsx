import { useState, useEffect } from "react";
import axios from "axios";
import ExpenseSideBar from "../components/ExpensesSideBar";

export default function BudgetPage() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  
  useEffect(() => {
    // Fetch budget data from backend
    axios.get("http://localhost:5000/api/budget")
      .then(res => {
        setBudget(res.data.budget);
        setExpenses(res.data.expenses);
      })
      .catch(err => console.error("Error fetching budget data:", err));
  }, []);
  
  // Calculate remaining budget
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget - totalExpenses;
  
  return (
    <div className="flex p-2">
      <ExpenseSideBar/>

      <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-4"> 
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6">
          <h1 className="text-center text-2xl font-bold text-white">Monthly Budget Tracker</h1>
        </div>
        
        <div className="flex">
          
          
          <div className="p-6 flex-1">
            {/* Budget Input Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Enter Monthly Budget</h2>
              <div className="relative">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            {/* Expenses List */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Expenses For The Month So Far</h2>
              {expenses.length > 0 ? (
                <div className="bg-gray-50 rounded-lg border border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {expenses.map((expense, index) => (
                      <li key={index} className="flex justify-between items-center px-4 py-3">
                        <span className="text-gray-800">{expense.name}</span>
                        <span className="font-medium text-gray-900">LKR {expense.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-3 bg-gray-100 text-right">
                    <span className="font-medium">Total: LKR {totalExpenses.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No expenses added yet</p>
              )}
            </div>
            
            {/* Remaining Budget */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Remaining Budget</h2>
              <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                LKR {remaining.toFixed(2)}
              </div>
              {remaining < 0 && (
                <p className="text-red-500 text-sm mt-1">You've exceeded your budget!</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      
        
    </div>
  );
}
