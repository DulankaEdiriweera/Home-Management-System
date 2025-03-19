import express from "express";
import {
  addFoodAndBeverage,
  deleteFoodAndBeverageById,
  getAllFoodAndBeverages,
  getFoodAndBeverageById,
  getItemsCloseToExpiry,
  getLowStockFoodAndBeverages,
  updateFoodAndBeverageById,
} from "../controllers/foodAndBeveragesController.js";

const router = express.Router();

// Route to get low stock food and beverage items
router.get("/low-stock", getLowStockFoodAndBeverages);

// Route to get items close to expiry (within 3 days)
router.get("/close-to-expiry", getItemsCloseToExpiry);

// Route to add a new Food and Beverage Item
router.post("/", addFoodAndBeverage);

// Route to get all Food and Beverage Items
router.get("/", getAllFoodAndBeverages);

// Route to get a specific Food and Beverage Item by ID
router.get("/:id", getFoodAndBeverageById);

// Route to update a Food and Beverage Item by ID
router.put("/:id", updateFoodAndBeverageById);

// Route to delete a Food and Beverage Item by ID
router.delete("/:id", deleteFoodAndBeverageById);

export default router;
