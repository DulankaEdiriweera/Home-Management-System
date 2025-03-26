import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import foodAndBeveragesRoute from "./routes/foodAndBeveragesRoutes.js";
import cleaningSuppliesRoute from "./routes/cleaningSuppliesRoutes.js";
import personalCareRoute from "./routes/personalCareRoute.js";
import householdItemRoute from "./routes/householdItemRoute.js";
import toolsAndMaintainenceRoute from "./routes/toolsRoute.js";
import taskRoutes from "./routes/taskRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import shoppingListRoutes from "./routes/shoppingListRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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

app.use("/inventory/foodAndBeverages", foodAndBeveragesRoute);
app.use("/inventory/cleaningSupplies", cleaningSuppliesRoute);
app.use("/inventory/personalCare", personalCareRoute);
app.use("/inventory/householdItems", householdItemRoute);
app.use("/inventory/toolItems", toolsAndMaintainenceRoute);

app.use("/task", taskRoutes);

app.use("/expenses", expenseRoutes);
app.use("/shoppingList", shoppingListRoutes);

app.use("/user", userRoutes);

app.listen(port, () => console.log("Server Started", port));
