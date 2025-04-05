import mongoose from "mongoose";
import users from "../models/userModel.js";

const taskSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Cooking", "Billing", "Cleaning", "Work","Other"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"], // Example priorities
    },
    status: {
      type: String,
      required: true,
      enum: ["Not Started", "In Progress", "Completed"], // Example status options
    },
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users", // Reference to the 'users' collection
          required: true, // Ensure this field is always provided
        },
  },
  { timestamps: true }
);

const taskModels = mongoose.model("Task", taskSchema);

export default taskModels;
