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
import AuthenticateUser from "../middlewares/AuthenticateUser.js";

const router = express.Router();

// Route to get high-priority shopping list items
router.get("/high-priority",AuthenticateUser, getHighPriorityShoppingItems);

// Route to get shopping list items by store
router.get("/store/:store",AuthenticateUser, getShoppingItemsByStore);

// Route to add a new shopping list item
router.post("/",AuthenticateUser, addShoppingListItem);

// Route to get all shopping list items
router.get("/",AuthenticateUser, getAllShoppingListItems);

// Route to get a specific shopping list item by ID
router.get("/:id",AuthenticateUser, getShoppingListItemById);

// Route to update a shopping list item by ID
router.put("/:id",AuthenticateUser, updateShoppingListItemById);

// Route to delete a shopping list item by ID
router.delete("/:id",AuthenticateUser, deleteShoppingListItemById);

export default router;
