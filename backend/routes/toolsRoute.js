import express from "express";
import {
  addToolSAndMaintanenceItem,
  deleteToolSAndMaintanenceItemById,
  getAllToolSAndMaintanenceItems,
  getToolSAndMaintanenceItemById,
  updateToolSAndMaintanenceItemById,
} from "../controllers/toolsController.js";
import AuthenticateUser from "../middlewares/AuthenticateUser.js";

const router = express.Router();

router.post("/", AuthenticateUser, addToolSAndMaintanenceItem);
router.get("/", AuthenticateUser, getAllToolSAndMaintanenceItems);
router.get("/:id",AuthenticateUser,  getToolSAndMaintanenceItemById);
router.put("/:id", AuthenticateUser, updateToolSAndMaintanenceItemById);
router.delete("/:id", AuthenticateUser, deleteToolSAndMaintanenceItemById);

export default router;
