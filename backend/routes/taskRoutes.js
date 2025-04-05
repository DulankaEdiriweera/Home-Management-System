import express from "express";
import {
  addTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById
} from "../controllers/taskController.js";
import AuthenticateUser from "../middlewares/AuthenticateUser.js";

const router = express.Router();

// Route to create a new task
router.post("/",AuthenticateUser, addTask);

// Route to fetch all tasks
router.get("/",AuthenticateUser, getAllTasks);

// Route to fetch a task by ID
router.get("/:id",AuthenticateUser, getTaskById);

// Route to update a task by ID
router.put("/:id", AuthenticateUser,updateTaskById);

// Route to delete a task by ID
router.delete("/:id", AuthenticateUser,deleteTaskById);

export default router;
