import React, { useState  } from 'react';
import { Link } from 'react-router-dom';

const ExpenseSideBar = ({ onSelectionChange }) => {
    const [selectedOption, setSelectedOption] = useState('Expenses Home');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        onSelectionChange(option);
    };

    return (
        <div className="w-64 bg-[#3B82F6] text-white min-h-screen p-5 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6">Expense Menu</h2>

            <div className="flex flex-col space-y-4">
            <Link
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Expenses Home' ? 'bg-blue-700' : 'bg-gray-700'}`}
                    to="/expensesAdd"
                >
                    Expenses Home
                </Link>
                <button 
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Expenses' ? 'bg-blue-700' : 'bg-gray-700'}`} 
                    
                >
                    Expenses
                </button>
                <Link
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Monthly Budget' ? 'bg-blue-700' : 'bg-gray-700'}`}
                    to="/monthlyBudget"
                >
                    Monthly Budget
                </Link>
                <button 
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Expense Overview' ? 'bg-blue-700' : 'bg-gray-700'}`} 
                    
                >
                    Expense Overview
                </button>
            </div>
        </div>
    );
};

export default ExpenseSideBar;
