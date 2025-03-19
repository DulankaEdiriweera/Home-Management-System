import express from "express";
import {
    addExpense,
    deleteExpenseRecordById,
    getAllExpenses,
    getExpensesByID,
  updateExpenseById,
} from "../controllers/expensesController.js";

const router = express.Router();



// Route to add a new Food and Beverage Item
router.post("/", addExpense);

// Route to get all Food and Beverage Items
router.get("/", getAllExpenses);

// Route to get a specific Food and Beverage Item by ID
router.get("/:id", getExpensesByID);

// Route to update a Food and Beverage Item by ID
router.put("/:id", updateExpenseById);

// Route to delete a Food and Beverage Item by ID
router.delete("/:id", deleteExpenseRecordById);

export default router;