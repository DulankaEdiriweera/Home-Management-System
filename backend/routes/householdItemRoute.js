import express from "express";
import {
  addHouseholdItem,
  deleteHouseholdItemById,
  getAllHouseholdItems,
  getHouseholdItemById,
  updateHouseholdItemById,
} from "../controllers/householdItemController.js";

const router = express.Router();

router.post("/", addHouseholdItem);
router.get("/", getAllHouseholdItems);
router.get("/:id", getHouseholdItemById);
router.put("/:id", updateHouseholdItemById);
router.delete("/:id", deleteHouseholdItemById);

export default router;
