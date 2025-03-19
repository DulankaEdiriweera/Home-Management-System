import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import expenseRoutes from "./routes/expenseRoutes.js";

//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//Middleware
app.use(express.json());
app.use(cors());

//API Endpoint
app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.use("/expenses", expenseRoutes);

app.listen(port, () => console.log("Server Started", port));
