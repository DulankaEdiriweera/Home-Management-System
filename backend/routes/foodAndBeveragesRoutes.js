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
import AuthenticateUser from "../middlewares/AuthenticateUser.js";

const router = express.Router();

// Route to get low stock food and beverage items
router.get("/low-stock", AuthenticateUser, getLowStockFoodAndBeverages);

// Route to get items close to expiry (within 3 days)
router.get("/close-to-expiry", AuthenticateUser, getItemsCloseToExpiry);

// Route to add a new Food and Beverage Item
router.post("/", AuthenticateUser, addFoodAndBeverage);

// Route to get all Food and Beverage Items
router.get("/", AuthenticateUser, getAllFoodAndBeverages);

// Route to get a specific Food and Beverage Item by ID
router.get("/:id", AuthenticateUser, getFoodAndBeverageById);

// Route to update a Food and Beverage Item by ID
router.put("/:id", AuthenticateUser, updateFoodAndBeverageById);

// Route to delete a Food and Beverage Item by ID
router.delete("/:id", AuthenticateUser, deleteFoodAndBeverageById);

export default router;
