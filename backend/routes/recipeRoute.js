import express from "express";
import AuthenticateUser from "../middlewares/AuthenticateUser.js";
import {generateRecipe} from "../controllers/recipeController.js"

const router = express.Router()

router.post('/generate-recipe',AuthenticateUser, generateRecipe)

export default router;