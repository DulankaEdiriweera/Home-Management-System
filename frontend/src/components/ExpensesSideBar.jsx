import React, { useState } from 'react';

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
                <button 
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Expenses Home' ? 'bg-blue-700' : 'bg-gray-700'}`} 
                    onClick={() => handleOptionChange('Expenses Home')}
                >
                    Expenses Home
                </button>
                <button 
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Expenses' ? 'bg-blue-700' : 'bg-gray-700'}`} 
                    onClick={() => handleOptionChange('Expenses')}
                >
                    Expenses
                </button>
                <button 
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Monthly Budget' ? 'bg-blue-700' : 'bg-gray-700'}`} 
                    onClick={() => handleOptionChange('Monthly Budget')}
                >
                    Monthly Budget
                </button>
                <button 
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'Expense Overview' ? 'bg-blue-700' : 'bg-gray-700'}`} 
                    onClick={() => handleOptionChange('Expense Overview')}
                >
                    Expense Overview
                </button>
            </div>
        </div>
    );
};

export default ExpenseSideBar;
