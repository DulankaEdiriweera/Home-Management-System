import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ExpenseSideBar = ({ onSelectionChange }) => {
    const [selectedOption, setSelectedOption] = useState('Expenses Home');

    return (
        <div className="w-64 bg-[#3B82F6] text-white min-h-screen p-5 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6">Expense Menu</h2>

            <div className="flex flex-col space-y-4">
                <Link
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Expenses Home' ? 'bg-blue-700' : 'bg-gray-700'}`}
                    to="/expenses"
                    onClick={() => {
                        setSelectedOption('Expenses Home');
                        onSelectionChange('Expenses Home');
                    }}
                >
                    Expenses Home
                </Link>
                <Link
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'View Expenses' ? 'bg-blue-700' : 'bg-gray-700'}`}
                    to="/expensesAdd"
                    onClick={() => {
                        setSelectedOption('View Expenses');
                        onSelectionChange('View Expenses');
                    }}
                >
                    View Expenses
                </Link>
            </div>
        </div>
    );
};

export default ExpenseSideBar;
