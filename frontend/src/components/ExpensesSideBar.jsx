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
                    to="/expenses"
                >
                    Expenses Home
                </Link>
                <Link
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Expenses Home' ? 'bg-blue-700' : 'bg-gray-700'}`}
                    to="/expensesAdd"
                >
                    View Expenses 
                </Link>
                
                <Link
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Expenses Home' ? 'bg-blue-700' : 'bg-gray-700'}`}
                    to="/monthlyBudget"
                >
                    Monthly Budget
                </Link>
                
            </div>
        </div>
    );
};

export default ExpenseSideBar;
