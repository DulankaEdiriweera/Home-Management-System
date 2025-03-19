import mongoose from "mongoose";

const personalCareSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const personalCare = mongoose.model("PersonalCare", personalCareSchema);

export default personalCare;
