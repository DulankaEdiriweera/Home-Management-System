import mongoose from "mongoose";

const foodAndBeveragesSchema = new mongoose.Schema(
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
    weightVolume: {
      type: Number,
      required: true,
    },
    unitOfMeasure: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    storageTypeLocation: {
      type: String,
      required: true,
    },
    minimumLevel: {
      type: Number,
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

const foodAndBeverages = mongoose.model(
  "FoodAndBeverages",
  foodAndBeveragesSchema
);

export default foodAndBeverages;
