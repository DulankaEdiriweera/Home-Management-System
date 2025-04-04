import express from "express";
import {
    addExpense,
    deleteExpenseRecordById,
    getAllExpenses,
    getExpensesByID,
  updateExpenseById,
} from "../controllers/expensesController.js";
import AuthenticateUser from "../middlewares/AuthenticateUser.js";

const router = express.Router();



// Route to add a new Food and Beverage Item
router.post("/",AuthenticateUser, addExpense);

// Route to get all Food and Beverage Items
router.get("/",AuthenticateUser, getAllExpenses);

// Route to get a specific Food and Beverage Item by ID
router.get("/:id",AuthenticateUser, getExpensesByID);

// Route to update a Food and Beverage Item by ID
router.put("/:id",AuthenticateUser, updateExpenseById);

// Route to delete a Food and Beverage Item by ID
router.delete("/:id",AuthenticateUser, deleteExpenseRecordById);

export default router;