import React from 'react';
import ExpenseSidebar from '../components/ExpensesSideBar';

const ExpensesHome = () => {
    return (
        <div className="flex p-2 ">
            {/* Sidebar */}
            <ExpenseSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-4 overflow-y-auto">
                <h1 className="text-3xl font-semibold mb-4">Expenses Dashboard</h1>
                <p>Total Expenses</p>
                <p>Expenses Overview</p>
            </div>
        </div>
    );
};

export default ExpensesHome;
