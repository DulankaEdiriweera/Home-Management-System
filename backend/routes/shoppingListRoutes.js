import express from "express";
import {
  addShoppingListItem,
  deleteShoppingListItemById,
  getAllShoppingListItems,
  getShoppingListItemById,
  getHighPriorityShoppingItems,
  getShoppingItemsByStore,
  updateShoppingListItemById,
} from "../controllers/shoppingListController.js";

const router = express.Router();

// Route to get high-priority shopping list items
router.get("/high-priority", getHighPriorityShoppingItems);

// Route to get shopping list items by store
router.get("/store/:store", getShoppingItemsByStore);

// Route to add a new shopping list item
router.post("/", addShoppingListItem);

// Route to get all shopping list items
router.get("/", getAllShoppingListItems);

// Route to get a specific shopping list item by ID
router.get("/:id", getShoppingListItemById);

// Route to update a shopping list item by ID
router.put("/:id", updateShoppingListItemById);

// Route to delete a shopping list item by ID
router.delete("/:id", deleteShoppingListItemById);

export default router;
