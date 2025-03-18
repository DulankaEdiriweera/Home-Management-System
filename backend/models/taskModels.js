import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
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
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const taskModels = mongoose.model("Task", taskSchema);

export default taskModels;
