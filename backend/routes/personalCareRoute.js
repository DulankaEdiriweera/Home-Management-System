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
import AuthenticateUser from "../middlewares/AuthenticateUser.js";

const router = express.Router();

// Route to get low stock Personal Care items
router.get("/low-stock", AuthenticateUser, getLowStockPersonalCareItems);

// Route to get items close to expiry (within 3 days)
router.get(
  "/close-to-expiry",
  AuthenticateUser,
  getItemsCloseToExpiryPersonalCare
);

// Route to add a new Personal Care Item
router.post("/", AuthenticateUser, addPersonalCareItem);

// Route to get all Personal Care Items
router.get("/", AuthenticateUser, getAllPersonalCareItems);

// Route to get a specific Personal Care Item by ID
router.get("/:id", AuthenticateUser, getPersonalCareItemById);

// Route to update a Personal Care Item by ID
router.put("/:id", AuthenticateUser, updatePersonalCareItemById);

// Route to delete a Personal Care Item by ID
router.delete("/:id", AuthenticateUser, deletePersonalCareItemById);

export default router;
