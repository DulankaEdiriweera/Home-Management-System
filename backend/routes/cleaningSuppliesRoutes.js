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
import AuthenticateUser from "../middlewares/AuthenticateUser.js";


const router = express.Router();

// Route to get low stock Cleaning Supplies items
router.get("/low-stock",AuthenticateUser, getLowStockCleaningSupplies);

// Route to get items close to expiry (within 3 days)
router.get("/close-to-expiry",AuthenticateUser, getItemsCloseToExpiryCleaningSupplies);

// Route to add a new Cleaning Supplies Item
router.post("/",AuthenticateUser, addCleaningSupplies);

// Route to get all Cleaning Supplies Items
router.get("/",AuthenticateUser, getAllCleaningSupllies);

// Route to get a specific Cleaning Supplies Item by ID
router.get("/:id",AuthenticateUser, getCleaningSupplyById);

// Route to update a Cleaning Supplies Item by ID
router.put("/:id",AuthenticateUser, updateCleaningSupplyById);

// Route to delete a Cleaning Supplies Item by ID
router.delete("/:id",AuthenticateUser, deleteCleaningSupplyById);

export default router;
