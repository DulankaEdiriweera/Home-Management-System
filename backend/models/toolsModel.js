import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const toolsAndMaintainenceItems = mongoose.model(
  "ToolsAndMaintanenceTools",
  toolsAndMaintainenceItemsSchema
);

export default toolsAndMaintainenceItems;
