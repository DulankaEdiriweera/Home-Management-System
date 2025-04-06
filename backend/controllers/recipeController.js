import axios from 'axios';
import "dotenv/config";  // Load environment variables

// Load your Spoonacular API key from environment variables
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

export const generateRecipe = async (req, res) => {
  const { ingredients } = req.body;

  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Ingredients must be an array" });
  }

  const ingredientsList = ingredients.join(", ");
  const endpoint = 'https://api.spoonacular.com/recipes/findByIngredients';
  
  const params = {
    ingredients: ingredientsList,
    number: 3,
    apiKey: SPOONACULAR_API_KEY,
    cuisine: "sri_lankan",  
  };

  console.log("Ingredients:", ingredientsList);
  console.log("Params being sent to Spoonacular:", params);

  try {
    const response = await axios.get(endpoint, { params });

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
            title: recipe.title,                // Recipe name from the initial API response
            servings: detailedRecipe.servings,   // Number of servings from detailed recipe info
            image: detailedRecipe.image,         // Image of the recipe from detailed recipe info
            readyInMinutes: detailedRecipe.readyInMinutes, // Time to prepare the recipe
            dishType: recipe.dishTypes && recipe.dishTypes.length > 0 ? recipe.dishTypes : ['Not specified'], // Dish type from initial response
            instructions: detailedRecipe.instructions, // Instructions from detailed recipe info
            ingredients: detailedRecipe.extendedIngredients.map((ingredient) => ({
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
            })),
          };
        } catch (error) {
          console.error("Error fetching recipe details:", error.response?.data || error.message);
          return null;
        }
      })
    );

    const filteredRecipes = recipeDetails.filter((recipe) => recipe !== null);

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
