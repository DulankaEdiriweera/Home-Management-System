import taskModels from "../models/taskModels.js";

// Add a new Task
export const addTask = async (req, res) => {
  try {
    // Check if a task with the same parameters already exists
    const existingTask = await taskModels.findOne({
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      status: req.body.status,
    });

    if (existingTask) {
      return res.status(400).json({ message: "Task with the same parameters already exists" });
    }

    const newTask = new taskModels(req.body);
    const savedTask = await newTask.save();
    res.status(201).json({ message: "Task added successfully", task: savedTask });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error: error.message });
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModels.find().sort({ updatedAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error: error.message });
  }
};

// Get a task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await taskModels.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving task", error: error.message });
  }
};

// Update a task by ID
export const updateTaskById = async (req, res) => {
  try {
    // Find the task by ID and update it with the new data from the request body
    const updatedTask = await taskModels.findByIdAndUpdate(
      req.params.id,  // the ID of the task to update
      req.body,       // the data to update the task with
      { new: true }    // return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Delete a task by ID
export const deleteTaskById = async (req, res) => {
  try {
    const deletedTask = await taskModels.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};
