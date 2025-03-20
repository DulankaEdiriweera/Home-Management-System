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
    category: {
      type: String,
      required: true,
      enum: ["Groceries", "Household", "Electronics", "personal Care", "Furniture", "Other"], // Adjust as needed
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"], // Defines allowed priority values
    },
    store: {
      type: String,
      required: true,
    },
    estimatedPrice: {
      type: Number,
      required: true,
      min: 0, // Ensures price is non-negative
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

export default ShoppingList;