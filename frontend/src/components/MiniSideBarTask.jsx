import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MdBarChart } from 'react-icons/md';

const TaskSideBar = ({ onFilterChange, onViewProgress }) => {
    const [category, setCategory] = useState('All');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        onFilterChange('category', e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        onFilterChange('status', e.target.value);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
        onFilterChange('priority', e.target.value);
    };

    const resetFilters = () => {
        setCategory('All');
        setStatus('');
        setPriority('');
        onFilterChange('category', 'All');
        onFilterChange('status', '');
        onFilterChange('priority', '');
    };

    return (
        <div className="w-64 bg-blue-500 text-white min-h-screen p-5 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6">Task Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
                <select
                    id="category"
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

            {/* Status Filter */}
            <div className="mb-6">
                <span className="block text-sm font-medium mb-2">Status</span>
                <div className="flex flex-col space-y-4">
                    {["Completed", "In Progress", "Not Started"].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value={option}
                                checked={status === option}
                                onChange={handleStatusChange}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Priority Filter */}
            <div className="mb-6">
                <span className="block text-sm font-medium mb-2">Priority</span>
                <div className="flex flex-col space-y-4">
                    {["Low", "Medium", "High"].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="priority"
                                value={option}
                                checked={priority === option}
                                onChange={handlePriorityChange}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <button
                onClick={resetFilters}
                className="w-full bg-red-500 text-white py-2 rounded-lg mt-6 hover:bg-red-600"
            >
                Reset Filters
            </button>

            {/* View Progress Button with Icon */}
            <Link
                to="/task-progress"
                onClick={onViewProgress}
                className="w-full bg-blue-900 text-white py-2 rounded-lg mt-6 hover:bg-blue-400 flex items-center justify-center"
            >
                <MdBarChart className="mr-2 text-xl" aria-hidden="true" />
                View Progress
            </Link>
        </div>
    );
};

TaskSideBar.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    onViewProgress: PropTypes.func.isRequired,
};

export default TaskSideBar;
