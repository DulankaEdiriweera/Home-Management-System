import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TaskSideBar = ({ onFilterChange, onViewProgress }) => {
    const [category, setCategory] = useState('All');
    const [status, setStatus] = useState(''); // Default to no status selected
    const [priority, setPriority] = useState(''); // Default to no priority selected

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        onFilterChange('category', e.target.value); // Send filter data to parent
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        onFilterChange('status', e.target.value); // Send filter data to parent
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
        onFilterChange('priority', e.target.value); // Send filter data to parent
    };

    const resetFilters = () => {
        setCategory('All');
        setStatus(''); // Reset to no status selected
        setPriority(''); // Reset to no priority selected
        onFilterChange('category', 'All');
        onFilterChange('status', '');
        onFilterChange('priority', '');
    };

    return (
        <div className="w-64 bg-blue-500 text-white min-h-screen p-5 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6">Task Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full bg-blue-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="All">All</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Billing">Billing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Space Between Category and Status */}
            <div className="mb-6"></div>

            {/* Status Filter (Vertically Displayed) */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex flex-col space-y-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="Completed"
                            checked={status === 'Completed'}
                            onChange={handleStatusChange}
                            className="mr-2"
                        />
                        Completed
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="In Progress"
                            checked={status === 'In Progress'}
                            onChange={handleStatusChange}
                            className="mr-2"
                        />
                        In Progress
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="Not Started"
                            checked={status === 'Not Started'}
                            onChange={handleStatusChange}
                            className="mr-2"
                        />
                        Not Started
                    </label>
                </div>
            </div>

            {/* Space Between Status and Priority */}
            <div className="mb-6"></div>

            {/* Priority Filter (Vertically Displayed) */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Priority</label>
                <div className="flex flex-col space-y-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="Low"
                            checked={priority === 'Low'}
                            onChange={handlePriorityChange}
                            className="mr-2"
                        />
                        Low
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="Medium"
                            checked={priority === 'Medium'}
                            onChange={handlePriorityChange}
                            className="mr-2"
                        />
                        Medium
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="High"
                            checked={priority === 'High'}
                            onChange={handlePriorityChange}
                            className="mr-2"
                        />
                        High
                    </label>
                </div>
            </div>

            {/* Reset Filters */}
            <button
                onClick={resetFilters}
                className="w-full bg-red-500 text-white py-2 rounded-lg mt-6 hover:bg-red-600"
            >
                Reset Filters
            </button>

            <Link
                to="/task-progress"
                className="w-full bg-blue-900 text-white py-2 rounded-lg mt-6 hover:bg-blue-400 flex items-center justify-center"
            >
                <span className="mr-2">📊</span> View Progress
            </Link>
        </div>
    );
};

export default TaskSideBar;