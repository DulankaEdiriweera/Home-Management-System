import express from "express";
import {
  addCleaningSupplies,
  deleteCleaningSupplyById,
  getAllCleaningSupllies,
  getCleaningSupplyById,
  getItemsCloseToExpiryCleaningSupplies,
  getLowStockCleaningSupplies,
  updateCleaningSupplyById,
} from "../controllers/cleaningSuppliesController.js";

const router = express.Router();

// Route to get low stock Cleaning Supplies items
router.get("/low-stock", getLowStockCleaningSupplies);

// Route to get items close to expiry (within 3 days)
router.get("/close-to-expiry", getItemsCloseToExpiryCleaningSupplies);

// Route to add a new Cleaning Supplies Item
router.post("/", addCleaningSupplies);

// Route to get all Cleaning Supplies Items
router.get("/", getAllCleaningSupllies);

// Route to get a specific Cleaning Supplies Item by ID
router.get("/:id", getCleaningSupplyById);

// Route to update a Cleaning Supplies Item by ID
router.put("/:id", updateCleaningSupplyById);

// Route to delete a Cleaning Supplies Item by ID
router.delete("/:id", deleteCleaningSupplyById);

export default router;
