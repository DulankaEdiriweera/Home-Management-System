import axios from 'axios';
import "dotenv/config";  // Load environment variables

// Load your Spoonacular API key from environment variables
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

export const generateRecipe = async (req, res) => {
  // Expecting ingredients to be an array in the request body
  const { ingredients } = req.body;

  // Check if ingredients are provided and are in an array
  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Ingredients must be an array" });
  }

  // Convert the ingredients array into a comma-separated string for Spoonacular API
  const ingredientsList = ingredients.join(", ");
  const endpoint = 'https://api.spoonacular.com/recipes/findByIngredients';
  
  const params = {
    ingredients: ingredientsList,
    number: 3,
    apiKey: SPOONACULAR_API_KEY,
    cuisine: "sri_lankan",  // You can remove this line if you want to get recipes from any cuisine
  };

  console.log("Ingredients:", ingredientsList);
  console.log("Params being sent to Spoonacular:", params);

  try {
    // Make the request to Spoonacular API to get recipes
    const response = await axios.get(endpoint, { params });

    // For each recipe, fetch detailed information (ingredients, instructions, etc.)
    const recipeDetails = await Promise.all(
      response.data.map(async (recipe) => {
        const recipeId = recipe.id;
        const recipeInfoEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/information`;

        const recipeInfoParams = {
          apiKey: SPOONACULAR_API_KEY,
        };

        try {
          const recipeInfoResponse = await axios.get(recipeInfoEndpoint, { params: recipeInfoParams });
          const detailedRecipe = recipeInfoResponse.data;

          return {
            title: recipe.title,                // Recipe name
            servings: detailedRecipe.servings,   // Number of servings
            image: detailedRecipe.image,         // Image of the recipe
            title: recipe.title,
            servings: detailedRecipe.servings,
            image: detailedRecipe.image,
            readyInMinutes: detailedRecipe.readyInMinutes,
            dishType: recipe.dishTypes && recipe.dishTypes.length > 0 ? recipe.dishTypes : ['Not specified'],
            instructions: detailedRecipe.instructions,
            ingredients: detailedRecipe.extendedIngredients.map((ingredient) => ({
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
            })), // Extracting amount, unit, and name // Extended list of ingredients
            dishType: recipe.dishTypes && recipe.dishTypes.length > 0 ? recipe.dishTypes : ['Not specified'], // Default if empty
            readyInMinutes: detailedRecipe.readyInMinutes, // Time to prepare the recipe
            instructions: detailedRecipe.instructions, // Recipe preparation instructions
          };
        } catch (error) {
          console.error("Error fetching recipe details:", error.response?.data || error.message);
          return null;
        }
      })
    );

    // Filter out any failed recipes that couldn't fetch detailed info
    const filteredRecipes = recipeDetails.filter((recipe) => recipe !== null);

    // Send the formatted data (including instructions) to the frontend
    res.json({ recipes: filteredRecipes });
  } catch (error) {
    if (error.response) {
        console.error("API Response Error Data:", error.response.data);
        console.error("API Response Status:", error.response.status);
      } else {
        console.error("Error Message:", error.message);
      }
    res.status(500).json({ error: "Failed to fetch recipes. Please try again later." });
  }
};
