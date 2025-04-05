import mongoose from "mongoose";

const shoppingListSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Ensures quantity is at least 1
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "l", "ml", "g", "pieces"], // Allowed units of measure
    },
    category: {
      type: String,
      required: true,
      enum: ["Groceries", "Household", "Electronics", "Personal Care", "Furniture", "Other"], 
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    store: {
      type: String,
      required: true,
    },
    estimatedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

export default ShoppingList;
