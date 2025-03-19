import mongoose from "mongoose";

const householdItemsSchema = new mongoose.Schema(
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

const householdItems = mongoose.model("HouseholdItem", householdItemsSchema);

export default householdItems;
