import taskModels from "../models/taskModels.js";
import users from "../models/userModel.js";

// Add a new Task
export const addTask = async (req, res) => {
  try {
    // Check if a task with the same parameters already exists
    const userId = req.userId;
    const existingTask = await taskModels.findOne({
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      status: req.body.status,
      users: userId,
    });

    if (existingTask) {
      return res.status(400).json({ message: "Task with the same parameters already exists" });
    }

    const newTask = new taskModels({
      ...req.body,
      user: userId, // Associate the item with the user
    });
    const savedTask = await newTask.save();
    res
      .status(201)
      .json({ message: "Task added successfully", task: savedTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding task", error: error.message });
  }
};

// Get all tasks for specific user
export const getAllTasks = async (req, res) => {
  try {
    const userId = req.userId; // Assuming the userId is set in req.userId after authentication
    const tasks = await taskModels.find({ user: userId }).sort({ updatedAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error: error.message });
  }
};

// Get a task by ID for specific user
export const getTaskById = async (req, res) => {
  try {
    const userId = req.userId; // Assuming the userId is set in req.userId after authentication
    const task = await taskModels.findOne({
      _id: req.params.id,
      user: userId, // Check if the item belongs to the user
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving task", error: error.message });
  }
};

// Update a task by ID for specific user
export const updateTaskById = async (req, res) => {
  try {
    
    const userId = req.userId; // Assuming the userId is set in req.userId after authentication
    // Find the task by ID and update it with the new data from the request body
    const updatedTask = await taskModels.findOneAndUpdate(
      { _id: req.params.id, user: userId }, // Ensure the item belongs to the user
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Delete a task by ID for a specific user
export const deleteTaskById = async (req, res) => {
  try {
    const userId = req.userId; // Assuming the userId is set in req.userId after authentication
    const deletedTask = await taskModels.findOneAndDelete({
      _id: req.params.id,
      user: userId, // Ensure the item belongs to the user
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};
