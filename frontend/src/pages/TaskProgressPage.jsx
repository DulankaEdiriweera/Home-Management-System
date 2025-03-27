import React, { useState, useEffect } from "react";
import MiniSideBar_Task from "../components/MiniSideBar_Task";
import axios from "axios";
import { BsBell, BsBellFill, BsCalendar, BsCalendarCheck, BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const TaskProgressPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusCounts, setStatusCounts] = useState({
        "Not Started": 0,
        "In Progress": 0,
        "Completed": 0,
        "Total": 0
    });
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const navigate = useNavigate();

    const STATUS_COLORS = {
        "Not Started": "#f97316", // orange
        "In Progress": "#facc15", // yellow 
        "Completed": "#10b981"    // emerald
    };

    const fetchTasks = async () => {
        setLoading(true);
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');

            // If no token is found, redirect to login or handle unauthorized access
            if (!token) {
                setError("No authentication token found");
                navigate('/login'); // Redirect to login page
                return;
            }

            const response = await axios.get("http://localhost:4000/task", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTasks(response.data);
            processTaskData(response.data);
        } catch (err) {
            // Handle different types of errors
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Unauthorized: Please log in again");
                    navigate('/login');
                } else if (err.response.status === 403) {
                    setError("Forbidden: You do not have permission to access this resource");
                } else {
                    setError("Failed to fetch task data");
                }
            } else if (err.request) {
                setError("No response received from server");
            } else {
                setError("Error setting up the request");
            }
            console.error("Fetch tasks error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const processTaskData = (taskData) => {
        // Process status counts
        const counts = {
            "Not Started": 0,
            "In Progress": 0,
            "Completed": 0,
            "Total": taskData.length
        };

        // Find overdue and upcoming tasks
        const overdue = [];
        const upcoming = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Create a date 7 days from now for upcoming tasks window
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        taskData.forEach(task => {
            // Count by status
            if (counts.hasOwnProperty(task.status)) {
                counts[task.status]++;
            }

            // Skip tasks without due dates
            if (!task.dueDate) return;

            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            // Check for overdue tasks
            if (task.status !== "Completed" && dueDate < today) {
                overdue.push(task);
            }

            // Check for upcoming tasks due within the next 7 days
            if (task.status !== "Completed" && dueDate >= today && dueDate <= nextWeek) {
                upcoming.push(task);
            }
        });

        // Sort upcoming tasks by due date (closest first)
        upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        setStatusCounts(counts);
        setOverdueTasks(overdue);
        setUpcomingTasks(upcoming);
    };

    // Format date string to more readable format
    const formatDate = (dateString) => {
        if (!dateString) return "No date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    // Calculate days remaining or overdue
    const getDaysRemaining = (dateString) => {
        if (!dateString) return "";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(dateString);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
        } else if (diffDays === 0) {
            return "Due today";
        } else {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1); // Navigate back to previous page
    };

    return (
        <div className="flex p-2 min-h-screen">
            <MiniSideBar_Task />
            <div className="flex-1 p-6 bg-gray-100 h-screen rounded-2xl ml-4 overflow-y-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleBack}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mr-4 transition duration-300 ease-in-out"
                    >
                        <BsArrowLeft className="mr-2" size={18} />
                        Back
                    </button>
                    <h1 className="text-3xl font-semibold">Task Progress Dashboard</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-xl text-gray-600">Loading task data...</div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Overdue and Upcoming Tasks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Overdue Tasks Panel */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-4">
                                    <h2 className="text-xl font-semibold">Overdue Tasks</h2>
                                    {overdueTasks.length > 0 && (
                                        <div className="ml-3 relative">
                                            <BsBellFill className="text-red-500" size={24} />
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {overdueTasks.length}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {overdueTasks.length > 0 ? (
                                    <div className="overflow-y-auto max-h-80">
                                        {overdueTasks.map((task) => (
                                            <div key={task._id} className="mb-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="font-semibold flex items-center">
                                                            <BsBell className="mr-2 text-red-500" size={16} />
                                                            {task.title}
                                                        </div>
                                                        <div className="text-sm text-red-600 font-medium mt-1">
                                                            Due: {formatDate(task.dueDate)} ({getDaysRemaining(task.dueDate)})
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span
                                                            className={`px-2 py-1 text-xs font-semibold rounded ${task.priority === "High"
                                                                ? "bg-red-100 text-red-800"
                                                                : task.priority === "Medium"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-green-100 text-green-800"
                                                                }`}
                                                        >
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-green-50 text-green-700 rounded">
                                        <div className="flex items-center">
                                            <BsCalendarCheck className="mr-2" size={18} />
                                            Great! No overdue tasks.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Tasks Panel */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-4">
                                    <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
                                    {upcomingTasks.length > 0 && (
                                        <div className="ml-3 relative">
                                            <BsCalendar className="text-blue-500" size={24} />
                                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {upcomingTasks.length}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {upcomingTasks.length > 0 ? (
                                    <div className="overflow-y-auto max-h-80">
                                        {upcomingTasks.map((task) => (
                                            <div
                                                key={task._id}
                                                className={`mb-3 p-3 rounded border-l-4 ${getDaysRemaining(task.dueDate) === "Due today"
                                                    ? "bg-yellow-50 border-yellow-500"
                                                    : "bg-blue-50 border-blue-500"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="font-semibold flex items-center">
                                                            <BsCalendar className={`mr-2 ${getDaysRemaining(task.dueDate) === "Due today"
                                                                ? "text-yellow-500"
                                                                : "text-blue-500"
                                                                }`} size={16} />
                                                            {task.title}
                                                        </div>
                                                        <div className={`text-sm font-medium mt-1 ${getDaysRemaining(task.dueDate) === "Due today"
                                                            ? "text-yellow-600"
                                                            : "text-blue-600"
                                                            }`}>
                                                            Due: {formatDate(task.dueDate)} ({getDaysRemaining(task.dueDate)})
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${task.status === "In Progress"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-gray-100 text-gray-800"
                                                                }`}
                                                        >
                                                            {task.status}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${task.priority === "High"
                                                                ? "bg-red-100 text-red-800"
                                                                : task.priority === "Medium"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-green-100 text-green-800"
                                                                }`}
                                                        >
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-50 text-gray-700 rounded">
                                        <div className="flex items-center">
                                            <BsCalendar className="mr-2" size={18} />
                                            No upcoming tasks in the next 7 days.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Count Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <div
                                    key={status}
                                    className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center"
                                    style={{
                                        borderTop: status !== "Total"
                                            ? `4px solid ${STATUS_COLORS[status]}`
                                            : "4px solid #6366f1" // indigo for total
                                    }}
                                >
                                    <div className="text-4xl font-bold mb-2">{count}</div>
                                    <div className="text-gray-600">{status} Tasks</div>
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                            {statusCounts["Total"] > 0
                                                ? Math.round((statusCounts["Completed"] / statusCounts["Total"]) * 100)
                                                : 0}% Complete
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-gray-600">
                                            {statusCounts["Completed"]} of {statusCounts["Total"]} tasks completed
                                        </span>
                                    </div>
                                </div>
                                <div className="flex h-2 mb-4 overflow-hidden text-xs bg-gray-200 rounded">
                                    <div
                                        style={{
                                            width: `${statusCounts["Total"] > 0
                                                ? (statusCounts["Completed"] / statusCounts["Total"]) * 100
                                                : 0}%`
                                        }}
                                        className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                                    ></div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {Object.entries(statusCounts).filter(([status]) => status !== "Total").map(([status, count]) => (
                                        <div key={status}>
                                            <div className="flex items-center mb-1">
                                                <div
                                                    className="w-3 h-3 mr-2 rounded-sm"
                                                    style={{ backgroundColor: STATUS_COLORS[status] }}
                                                ></div>
                                                <span className="text-sm font-medium">{status}</span>
                                            </div>
                                            <div className="flex h-2 overflow-hidden text-xs bg-gray-200 rounded">
                                                <div
                                                    style={{
                                                        width: `${statusCounts["Total"] > 0
                                                            ? (count / statusCounts["Total"]) * 100
                                                            : 0}%`,
                                                        backgroundColor: STATUS_COLORS[status]
                                                    }}
                                                    className="flex flex-col text-center whitespace-nowrap text-white justify-center"
                                                ></div>
                                            </div>
                                            <div className="text-xs text-right mt-1">
                                                {count} ({statusCounts["Total"] > 0 ? Math.round((count / statusCounts["Total"]) * 100) : 0}%)
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskProgressPage;