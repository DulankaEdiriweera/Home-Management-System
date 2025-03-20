import React from 'react';
import ExpenseSidebar from '../components/ExpensesSideBar';

const ExpensesHome = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <ExpenseSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-semibold mb-4">Expenses Dashboard</h1>
                <p>Total Expenses</p>
                <p>Expenses Overview</p>
            </div>
        </div>
    );
};

export default ExpensesHome;
