import express from "express";
import {
  addTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById
} from "../controllers/taskController.js";

const router = express.Router();

// Route to create a new task
router.post("/", addTask);

// Route to fetch all tasks
router.get("/", getAllTasks);

// Route to fetch a task by ID
router.get("/:id", getTaskById);

// Route to update a task by ID
router.put("/:id", updateTaskById);

// Route to delete a task by ID
router.delete("/:id", deleteTaskById);

export default router;
