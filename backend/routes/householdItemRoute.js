import express from "express";
import {
  addHouseholdItem,
  deleteHouseholdItemById,
  getAllHouseholdItems,
  getHouseholdItemById,
  updateHouseholdItemById,
} from "../controllers/householdItemController.js";
import AuthenticateUser from "../middlewares/AuthenticateUser.js";

const router = express.Router();

router.post("/", AuthenticateUser, addHouseholdItem);
router.get("/", AuthenticateUser, getAllHouseholdItems);
router.get("/:id",AuthenticateUser, getHouseholdItemById);
router.put("/:id",AuthenticateUser, updateHouseholdItemById);
router.delete("/:id",AuthenticateUser, deleteHouseholdItemById);

export default router;
