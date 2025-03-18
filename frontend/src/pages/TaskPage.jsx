import React, { useState, useEffect } from "react";
import MiniSideBar_Task from "../components/MiniSideBar_Task";
import axios from "axios";

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [newTask, setNewTask] = useState({
        title: "",
        category: "Cooking",
        description: "",
        dueDate: "",
        priority: "Low",
        status: "Not Started",
        completed: false,
    });
    const [taskCount, setTaskCount] = useState(5);
    const [message, setMessage] = useState("");
    const [filters, setFilters] = useState({
        category: 'All',
        status: '',
        priority: '',
        search: ''
    });

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/task?_limit=${taskCount}`);
                setTasks(response.data);
                // Apply filters to the newly fetched data
                applyFilters(response.data);
            } catch (err) {
                setError("Failed to fetch tasks");
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [taskCount]);

    // Apply filters whenever filters change
    useEffect(() => {
        applyFilters(tasks);
    }, [filters]);

    const applyFilters = (taskList) => {
        let result = [...taskList];

        // Apply category filter
        if (filters.category && filters.category !== 'All') {
            result = result.filter(task => task.category === filters.category);
        }

        // Apply status filter
        if (filters.status) {
            result = result.filter(task => task.status === filters.status);
        }

        // Apply priority filter
        if (filters.priority) {
            result = result.filter(task => task.priority === filters.priority);
        }

        // Apply search filter (case insensitive)
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase().trim();
            result = result.filter(task =>
                (task.title && task.title.toLowerCase().includes(searchTerm)) ||
                (task.category && task.category.toLowerCase().includes(searchTerm)) ||
                (task.description && task.description.toLowerCase().includes(searchTerm))
            );
        }

        setFilteredTasks(result);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value;
        setFilters(prevFilters => ({
            ...prevFilters,
            search: searchValue
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            category: 'All',
            status: '',
            priority: '',
            search: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.description) {
            setError("Title and Description are required.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/task", { ...newTask, createdAt: new Date() });
            setNewTask({
                title: "",
                category: "Cooking",
                description: "",
                dueDate: "",
                priority: "Low",
                status: "Not Started",
                completed: false,
            });
            setShowAddForm(false);

            // Update local state with the new task
            const newTaskWithId = response.data;
            setTasks(prevTasks => [...prevTasks, newTaskWithId]);
            // Apply filters to include the new task if it matches
            applyFilters([...tasks, newTaskWithId]);

            setMessage("Task added successfully!");
            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            setError("Failed to add task");
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };

    const handleEditTask = async (e) => {
        e.preventDefault();
        if (!editTask.title || !editTask.description) {
            setError("Title and Description are required.");
            return;
        }

        try {
            await axios.put(`http://localhost:4000/task/${editTask._id}`, editTask);
            setEditTask(null);
            setShowEditForm(false);

            // Update the task in the local state
            const updatedTasks = tasks.map(task =>
                task._id === editTask._id ? editTask : task
            );
            setTasks(updatedTasks);

            // Apply filters to the updated task list
            applyFilters(updatedTasks);

            setMessage("Task updated successfully!");
            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            setError("Failed to update task");
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };

    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm("Do you want to delete this task?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:4000/task/${taskId}`);

                // Update local state
                const remainingTasks = tasks.filter((task) => task._id !== taskId);
                setTasks(remainingTasks);

                // Apply filters to the remaining tasks
                applyFilters(remainingTasks);

                setMessage("Task deleted successfully!");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } catch (err) {
                setError("Failed to delete task");
                setTimeout(() => {
                    setError("");
                }, 3000);
            }
        }
    };

    const loadMoreTasks = () => {
        setLoading(true);
        setTaskCount((prevCount) => prevCount + 5);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    const getRelativeTime = (dateString) => {
        if (!dateString) return "Unknown time";
        const now = new Date();
        const taskDate = new Date(dateString);
        const differenceInSeconds = Math.floor((now - taskDate) / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);

        if (differenceInSeconds < 60) {
            return `${differenceInSeconds} second${differenceInSeconds > 1 ? "s" : ""} ago`;
        } else if (differenceInMinutes < 60) {
            return `${differenceInMinutes} minute${differenceInMinutes > 1 ? "s" : ""} ago`;
        } else if (differenceInHours < 24) {
            return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
        } else {
            return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
        }
    };

    return (
        <div className="flex p-2 min-h-screen">
            <MiniSideBar_Task onFilterChange={handleFilterChange} />
            <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-4 overflow-hidden">
                <h1 className="text-3xl font-semibold mb-6">Task List</h1>
                <div className="flex items-center justify-between p-5">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        + Add New Task
                    </button>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.search}
                        onChange={handleSearchChange}
                        className="w-1/3 px-4 py-2 border rounded-2xl focus:ring-2 focus:ring-blue-400 shadow-md"
                    />
                </div>

                {/* Display active filters */}
                {(filters.category !== 'All' || filters.status || filters.priority || filters.search) && (
                    <div className="mb-4 px-6 py-2 bg-blue-100 rounded-lg flex flex-wrap items-center">
                        <span className="mr-2 font-semibold">Active Filters:</span>
                        {filters.category !== 'All' && (
                            <span className="bg-blue-200 px-3 py-1 rounded-full text-sm mr-2">
                                Category: {filters.category}
                            </span>
                        )}
                        {filters.status && (
                            <span className="bg-blue-200 px-3 py-1 rounded-full text-sm mr-2">
                                Status: {filters.status}
                            </span>
                        )}
                        {filters.priority && (
                            <span className="bg-blue-200 px-3 py-1 rounded-full text-sm mr-2">
                                Priority: {filters.priority}
                            </span>
                        )}
                        {filters.search && (
                            <span className="bg-blue-200 px-3 py-1 rounded-full text-sm mr-2">
                                Search: "{filters.search}"
                            </span>
                        )}
                        <button
                            onClick={clearAllFilters}
                            className="ml-auto text-xs text-blue-600 hover:text-blue-800"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Display task count */}
                <div className="px-6 mb-2">
                    <p className="text-gray-600">
                        Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                        {(filters.category !== 'All' || filters.status || filters.priority || filters.search) &&
                            ` (filtered from ${tasks.length})`}
                    </p>
                </div>

                {/* Display success or error message */}
                {message && <div className="bg-green-500 text-white p-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}

                {/* Add Task Form */}
                {showAddForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
                            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                            <label className="block mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Add Title"
                                value={newTask.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-3"
                            />
                            <label className="block mb-1">Category</label>
                            <select
                                name="category"
                                value={newTask.category}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-3"
                            >
                                <option value="Cooking">Cooking</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Study">Study</option>
                                <option value="Work">Work</option>
                                <option value="Billing">Billing</option>
                                <option value="Other">Other</option>
                            </select>
                            <label className="block mb-1">Description</label>
                            <textarea
                                name="description"
                                placeholder="Add Description"
                                value={newTask.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-3"
                            />
                            <label className="block mb-1">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={newTask.dueDate}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-3"
                            />
                            <label className="block mb-1">Priority</label>
                            <select
                                name="priority"
                                value={newTask.priority}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-3"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <label className="block mb-1">Status</label>
                            <select
                                name="status"
                                value={newTask.status}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-3"
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>

                            {/* Buttons */}
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddTask}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Edit Task Form */}
                {showEditForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
                            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                            <label className="block mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Edit Title"
                                value={editTask?.title || ''}
                                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                className="w-full p-2 border rounded mb-3"
                            />
                            <label className="block mb-1">Category</label>
                            <select
                                name="category"
                                value={editTask?.category || ''}
                                onChange={(e) => setEditTask({ ...editTask, category: e.target.value })}
                                className="w-full p-2 border rounded mb-3"
                            >
                                <option value="Cooking">Cooking</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Study">Study</option>
                                <option value="Work">Work</option>
                                <option value="Billing">Billing</option>
                                <option value="Other">Other</option>
                            </select>
                            <label className="block mb-1">Description</label>
                            <textarea
                                name="description"
                                placeholder="Edit Description"
                                value={editTask?.description || ''}
                                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                className="w-full p-2 border rounded mb-3"
                            />
                            <label className="block mb-1">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={editTask?.dueDate || ''}
                                onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                                className="w-full p-2 border rounded mb-3"
                            />
                            <label className="block mb-1">Priority</label>
                            <select
                                name="priority"
                                value={editTask?.priority || ''}
                                onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                                className="w-full p-2 border rounded mb-3"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <label className="block mb-1">Status</label>
                            <select
                                name="status"
                                value={editTask?.status || ''}
                                onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                                className="w-full p-2 border rounded mb-3"
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>

                            {/* Buttons */}
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => setShowEditForm(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditTask}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Task List */}
                <div className="pt-5 overflow-y-auto max-h-[calc(100vh-250px)]">
                    {filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow">
                            <p className="text-xl text-gray-500">No tasks found matching your filters</p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredTasks.map((task) => (
                                <div key={task._id} className="p-6 bg-white border rounded-lg shadow-lg flex flex-col justify-between">
                                    <h3 className="text-xl font-semibold">{task.title}</h3>
                                    <p className="text-sm text-gray-500">{task.category}</p>
                                    <p className="mt-2 text-gray-600">{task.description}</p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        <strong>Due Date:</strong> {formatDate(task.dueDate)}
                                    </p>
                                    <div
                                        className={`p-2 text-white text-center rounded mt-2 ${task.priority === "Low"
                                            ? "bg-yellow-300"
                                            : task.priority === "Medium"
                                                ? "bg-green-300"
                                                : "bg-red-300"
                                            }`}
                                    >
                                        {task.priority} Priority
                                    </div>
                                    <p className={`mt-2 text-sm ${task.status === "Completed" ? "text-green-600" : task.status === "In Progress" ? "text-yellow-600" : "text-gray-600"}`}>
                                        <strong>Status:</strong> {task.status}
                                    </p>

                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            onClick={() => {
                                                setEditTask(task); // Set the task to be edited
                                                setShowEditForm(true); // Show the edit form
                                            }}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <p className="text-sm text-gray-500">
                                            {getRelativeTime(task.createdAt)}
                                        </p>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {filteredTasks.length > 0 && filteredTasks.length < tasks.length && (
                    <div className="flex justify-center mt-5">
                        <p className="text-gray-500">Filtered view - Load More not available</p>
                    </div>
                )}

                {filteredTasks.length === tasks.length && (
                    <div className="flex justify-center mt-5">
                        <button
                            onClick={loadMoreTasks}
                            disabled={loading}
                            className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Loading..." : "Load More Tasks"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskPage;