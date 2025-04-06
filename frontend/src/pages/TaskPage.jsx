import React, { useState, useEffect } from "react";
import MiniSideBarTask from "../components/MiniSideBarTask"
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { FaFilePdf } from "react-icons/fa";
import autoTable from "jspdf-autotable";

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
        category: "",
        description: "",
        dueDate: "",
        priority: "",
        status: "",
        completed: false,
    });
    const [taskCount] = useState(5);
    const [message] = useState("");
    const [filters, setFilters] = useState({
        category: 'All',
        status: '',
        priority: '',
        search: ''
    });
    const [formErrors, setFormErrors] = useState({
        title: "",
        category: "",
        description: "",
        dueDate: "",
        priority: "",
        status: "",

    });

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "Low":
                return "bg-yellow-300";
            case "Medium":
                return "bg-green-300";
            case "High":
                return "bg-red-300";
            default:
                return "bg-gray-300"; // Fallback color
        }
    };

    const getStatusTextClass = (status) => {
        switch (status) {
            case "Completed":
                return "text-green-600";
            case "In Progress":
                return "text-yellow-600";
            case "Not Started":
                return "text-gray-500";
            default:
                return "text-gray-600";
        }
    };

    // Calculate today's date for min attribute on date input
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:4000/task?_limit=${taskCount}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTasks(response.data);
            applyFilters(response.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                Swal.fire({
                    title: "Unauthorized",
                    text: "You are not authorized to access this resource. Please log in.",
                    icon: "error",
                }).then(() => {
                    navigate("/login");
                });
            } else {
                setError(err.response?.data?.message || "Failed to fetch tasks");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                task.title?.toLowerCase().includes(searchTerm) ||
                task.category?.toLowerCase().includes(searchTerm) ||
                task.description?.toLowerCase().includes(searchTerm)
            );
        }
        setFilteredTasks(result);
    };

    const validateForm = (task) => {
        // Create a new empty errors object each time
        const errors = {};

        if (!task.title.trim()) {
            errors.title = "Title is required";
        } else if (task.title.length < 3) {
            errors.title = "Title must be at least 3 characters";
        }

        if (!task.description.trim()) {
            errors.description = "Description is required";
        }

        if (!task.dueDate) {
            errors.dueDate = "Due date is required";
        }

        if (!task.category) {
            errors.category = "Category is required";
        }

        if (!task.priority) {
            errors.priority = "Priority is required";
        }

        if (!task.status) {
            errors.status = "Status is required";
        }

        // Return both the errors and whether the form is valid
        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };
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

        // Clear error for the field being edited immediately
        setFormErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditTask({ ...editTask, [name]: value });

        // Clear error for the field being edited immediately
        setFormErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const handleAddTask = async (e) => {
        e.preventDefault();

        const { errors, isValid } = validateForm(newTask);

        if (!isValid) {
            setFormErrors(errors);
            return;
        }

        // Clear any remaining form errors
        setFormErrors({});

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: "Unauthorized!",
                text: "You are not logged in. Please log in to continue.",
                icon: "error",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:4000/task",
                { ...newTask, createdAt: new Date() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Check for successful response status
            if (response.status >= 200 && response.status < 300) {
                setNewTask({
                    title: "",
                    category: "",
                    description: "",
                    dueDate: "",
                    priority: "",
                    status: "",
                    completed: false,
                });
                setShowAddForm(false);

                // Fetch all tasks again to ensure we have the most up-to-date data
                await fetchTasks();

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.data.message || 'Task added successfully!',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: "Unexpected Response",
                    text: "Unexpected response from server.",
                    icon: "warning",
                });
            }
        } catch (err) {
            console.error("Error details:", err);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Failed to add the task.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = async (e) => {
        e.preventDefault();

        const { errors, isValid } = validateForm(editTask);

        if (!isValid) {
            setFormErrors(errors);
            return;
        }

        // Clear any remaining form errors
        setFormErrors({});

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: "Unauthorized!",
                text: "You are not logged in. Please log in to continue.",
                icon: "error",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                `http://localhost:4000/task/${editTask._id}`,
                editTask,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Check for successful response status
            if (response.status >= 200 && response.status < 300) {
                setEditTask(null);
                setShowEditForm(false);

                // Fetch all tasks again to ensure we have the most up-to-date data
                await fetchTasks();

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.data.message || 'Task updated successfully!',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: "Unexpected Response",
                    text: "Unexpected response from server.",
                    icon: "warning",
                });
            }
        } catch (err) {
            console.error("Error details:", err);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Failed to update the task.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: "Unauthorized!",
                text: "You are not logged in. Please log in to continue.",
                icon: "error",
            });
            return;
        }

        const { isConfirmed } = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (isConfirmed) {
            try {
                setLoading(true);
                const response = await axios.delete(
                    `http://localhost:4000/task/${taskId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Check for successful response status
                if (response.status >= 200 && response.status < 300) {
                    // Fetch all tasks again to ensure we have the most up-to-date data
                    await fetchTasks();

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.data.message || 'Task deleted successfully!',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        title: "Unexpected Response",
                        text: "Unexpected response from server.",
                        icon: "warning",
                    });
                }
            } catch (err) {
                console.error("Error details:", err);
                Swal.fire({
                    title: "Error!",
                    text: err.response?.data?.message || "Failed to delete the task.",
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        }
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

    // Format date to YYYY-MM-DD for date input field
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleExportTasksPDF = () => {
        const doc = new jsPDF();

        // Add title with style
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Tasks Report", 14, 20);

        // Add generation date
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);

        // Group tasks by category
        const categoryData = {};
        filteredTasks.forEach((task) => {
            if (!categoryData[task.category]) {
                categoryData[task.category] = [];
            }
            categoryData[task.category].push(task);
        });

        let startY = 40; // Start position for tables

        // Loop through categories
        Object.entries(categoryData).forEach(([category, tasks]) => {
            // Category header
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(category, 14, startY);
            startY += 8;

            // Table header
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            const tableHeader = [["Title", "Priority", "Status", "Due Date"]];

            // Table data
            const tableData = tasks.map((task) => [
                task.title,
                task.priority,
                task.status,
                task.dueDate ? formatDate(task.dueDate) : "No date"
            ]);

            // Add table
            autoTable(doc, {
                startY,
                head: tableHeader,
                body: tableData,
                theme: "grid",
                headStyles: {
                    fillColor: [59, 130, 246],
                    textColor: [255, 255, 255]
                },
                bodyStyles: {
                    fillColor: [240, 240, 240]
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                    halign: "center"
                },
            });

            // Update Y position for the next category
            startY = doc.lastAutoTable.finalY + 10;

            // Total tasks in category
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Total Tasks in ${category} category: ${tasks.length}`, 14, startY);

            // Add some spacing before the next category
            startY += 15;
        });

        // Save the generated PDF
        doc.save(`Tasks_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };
    return (
        <div className="flex p-2 min-h-screen">
            <MiniSideBarTask onFilterChange={handleFilterChange} />
            <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-4 overflow-hidden">
                <h1 className="text-3xl font-semibold mb-6">Task List</h1>
                <div className="flex items-center justify-between p-5">
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                            setFormErrors({});
                        }}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        + Add New Task
                    </button>

                    {/* Centered search with download button */}
                    <div className="flex items-center justify-center flex-1 mx-4">
                        <div className="relative w-2/3">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="w-full px-4 py-2 border rounded-2xl focus:ring-2 focus:ring-blue-400 shadow-md"
                            />
                            <span className="absolute right-3 top-2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Right: Other Buttons */}
                    <div className="flex space-x-2">
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-700 shadow-md"
                            onClick={handleExportTasksPDF}
                        >
                            <FaFilePdf /> Export PDF
                        </button>
                    </div>
                </div>

                {/* Display active filters */}
                {(filters.category !== 'All' || filters.status || filters.priority || filters.search) && (
                    <div className="mb-4 px-6 py-2 bg-blue-100 rounded-lg flex flex-wrap items-center">
                        <span className="mr-2 font-semibold"> Your Active Filters:</span>
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
                        Showing count of {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                        {(filters.category !== 'All' || filters.status || filters.priority || filters.search) &&
                            ` ( from all ${tasks.length} tasks)`}
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
                            <form onSubmit={handleAddTask}>
                                <div className="mb-3">
                                    <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        placeholder="Add Title"
                                        value={newTask.title}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {formErrors.title && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                                    )}
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="category" className="block mb-1">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={newTask.category}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.category ? 'border-red-500' : ''}`}
                                    >
                                        <option value=""></option>
                                        <option value="Cooking">Cooking</option>
                                        <option value="Cleaning">Cleaning</option>
                                        <option value="Work">Work</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formErrors.category && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                                    )}
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="description" className="block mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Add Description"
                                        value={newTask.description}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.description ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.description && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                    )}
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="dueDate" className="block mb-1">Due Date</label>
                                    <input
                                        id="dueDate"
                                        type="date"
                                        name="dueDate"
                                        value={newTask.dueDate}
                                        onChange={handleInputChange}
                                        min={getTodayDate()}
                                        className={`w-full p-2 border rounded ${formErrors.dueDate ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.dueDate && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>
                                    )}
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="priority" className="block mb-1">Priority</label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={newTask.priority}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.priority ? 'border-red-500' : ''}`}
                                    >
                                        <option value=""></option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                    {formErrors.priority && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.priority}</p>
                                    )}
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="status" className="block mb-1">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={newTask.status}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.status ? 'border-red-500' : ''}`}
                                    >
                                        <option value=""></option>
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    {formErrors.status && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>
                                    )}
                                </div>


                                {/* Buttons */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setFormErrors({});
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Task Form */}
                {showEditForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
                            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                            <form onSubmit={handleEditTask}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="block mb-1">Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        placeholder="Edit Title"
                                        value={editTask?.title || ''}
                                        onChange={handleEditInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.title ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.title && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="category" className="block mb-1">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={editTask?.category || ''}
                                        onChange={handleEditInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.category ? 'border-red-500' : ''}`}
                                    >
                                        <option value=""></option>
                                        <option value="Cooking">Cooking</option>
                                        <option value="Cleaning">Cleaning</option>
                                        <option value="Work">Work</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="description" className="block mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Edit Description"
                                        value={editTask?.description || ''}
                                        onChange={handleEditInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.description ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="dueDate" className="block mb-1">Due Date</label>
                                    <input
                                        id="dueDate"
                                        type="date"
                                        name="dueDate"
                                        value={editTask?.dueDate ? formatDateForInput(editTask.dueDate) : ''}
                                        onChange={handleEditInputChange}
                                        min={getTodayDate()}
                                        className={`w-full p-2 border rounded ${formErrors.dueDate ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.dueDate && <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>}
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="priority" className="block mb-1">Priority</label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={editTask?.priority || ''}
                                        onChange={handleEditInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.priority ? 'border-red-500' : ''}`}
                                    >
                                        <option value=""></option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                    {formErrors.priority && <p className="text-red-500 text-sm mt-1">{formErrors.priority}</p>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="status" className="block mb-1">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={editTask?.status || ''}
                                        onChange={handleEditInputChange}
                                        className={`w-full p-2 border rounded ${formErrors.status ? 'border-red-500' : ''}`}
                                    >
                                        <option value=""></option>
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    {formErrors.status && <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>}
                                </div>


                                {/* Buttons */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditForm(false);
                                            setFormErrors({});
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
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
                                    <div className={`p-2 text-white text-center rounded mt-2 ${getPriorityClass(task.priority)}`}>
                                        {task.priority} Priority
                                    </div>

                                    <p className={`mt-2 text-sm ${getStatusTextClass(task.status)}`}>
                                        <strong>Status:</strong> {task.status}
                                    </p>


                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            onClick={() => {
                                                setEditTask(task);
                                                setShowEditForm(true);
                                                setFormErrors({});
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
            </div>
        </div>
    );
};

export default TaskPage;