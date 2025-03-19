import express from "express";
import {
  addPersonalCareItem,
  deletePersonalCareItemById,
  getAllPersonalCareItems,
  getItemsCloseToExpiryPersonalCare,
  getLowStockPersonalCareItems,
  getPersonalCareItemById,
  updatePersonalCareItemById,
} from "../controllers/personalCareController.js";

const router = express.Router();

// Route to get low stock Personal Care items
router.get("/low-stock", getLowStockPersonalCareItems);

// Route to get items close to expiry (within 3 days)
router.get("/close-to-expiry", getItemsCloseToExpiryPersonalCare);

// Route to add a new Personal Care Item
router.post("/", addPersonalCareItem);

// Route to get all Personal Care Items
router.get("/", getAllPersonalCareItems);

// Route to get a specific Personal Care Item by ID
router.get("/:id", getPersonalCareItemById);

// Route to update a Personal Care Item by ID
router.put("/:id", updatePersonalCareItemById);

// Route to delete a Personal Care Item by ID
router.delete("/:id", deletePersonalCareItemById);

export default router;
