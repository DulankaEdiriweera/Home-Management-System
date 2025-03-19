import express from "express";
import {
  addToolSAndMaintanenceItem,
  deleteToolSAndMaintanenceItemById,
  getAllToolSAndMaintanenceItems,
  getToolSAndMaintanenceItemById,
  updateToolSAndMaintanenceItemById,
} from "../controllers/toolsController.js";

const router = express.Router();

router.post("/", addToolSAndMaintanenceItem);
router.get("/", getAllToolSAndMaintanenceItems);
router.get("/:id", getToolSAndMaintanenceItemById);
router.put("/:id", updateToolSAndMaintanenceItemById);
router.delete("/:id", deleteToolSAndMaintanenceItemById);

export default router;
