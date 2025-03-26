import mongoose from "mongoose";
import users from "../models/userModel.js";

const toolsAndMaintainenceItemsSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    storageTypeLocation: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the 'users' collection
      required: true, // Ensure this field is always provided
    },
  },
  { timestamps: true }
);

const toolsAndMaintainenceItems = mongoose.model(
  "ToolsAndMaintanenceTools",
  toolsAndMaintainenceItemsSchema
);

export default toolsAndMaintainenceItems;
