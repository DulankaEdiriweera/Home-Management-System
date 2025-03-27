// generate recipe
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaSyncAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import SideBarInventory from "../components/SideBarInventory";

const AutoRecipeGenerator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [expiringItems, setExpiringItems] = useState([]);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check if token exists, if not redirect to login
    if (!token) {
      Swal.fire({
        title: "Unauthorized",
        text: "You must be logged in to access this page.",
        icon: "error",
      }).then(() => {
        navigate("/login");
      });
      return;
    }
    fetchExpiringItemsAndGenerateRecipes();
  }, []);

  const fetchExpiringItemsAndGenerateRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/inventory/foodAndBeverages/close-to-expiry",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );

      const formattedData = response.data.map((item) => ({
        ...item,
        expiryDate: new Date(item.expiryDate).toISOString().split("T")[0],
        daysToExpiry: Math.ceil(
          (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        ),
      }));

      setExpiringItems(formattedData);

      if (formattedData.length > 0) {
        const categorizedItems = categorizeIngredients(formattedData);
        const suggestions = createRecipeSuggestions(
          categorizedItems,
          formattedData
        );
        setGeneratedRecipes(suggestions);

        if (suggestions.length > 0) {
          Swal.fire({
            title: "Success!",
            text: `${suggestions.length} recipes automatically generated from your expiring ingredients!`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        Swal.fire({
          title: "Unauthorized",
          text: "You are not authorized to access this resource. Please log in.",
          icon: "error",
        }).then(() => {
          navigate("/login"); // Redirect to login page
        });
      } else {
        setError(err.response?.data?.message || "Error fetching expiring items");
      }
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const regenerateRecipes = () => {
    if (!token) {
      Swal.fire({
        title: "Unauthorized",
        text: "You must be logged in to regenerate recipes.",
        icon: "error",
      }).then(() => {
        navigate("/login");
      });
      return;
    }
    setRegenerating(true);
    const categorizedItems = categorizeIngredients(expiringItems);
    const newSuggestions = createRecipeSuggestions(
      categorizedItems,
      expiringItems,
      true
    );
    setGeneratedRecipes(newSuggestions);

    setTimeout(() => {
      setRegenerating(false);
      Swal.fire({
        title: "Regenerated!",
        text: `${newSuggestions.length} new recipe suggestions created!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }, 1000);
  };

  const categorizeIngredients = (items) => {
    const categories = {
      "Dairy Products": [],
      Beverages: [],
      "Snacks & Sweets": [],
      Spices: [],
      Vegetables: [],
      Fruits: [],
      Grains: [],
      Other: [],
    };

    items.forEach((item) => {
      if (categories[item.category]) {
        categories[item.category].push(item);
      } else {
        categories["Other"].push(item);
      }
    });

    return categories;
  };

  const createRecipeSuggestions = (
    categorizedItems,
    allItems,
    isRegeneration = false
  ) => {
    const recipes = [];

    const recipeTemplates = [
      {
        name: "Vegetable Stir Fry",
        recipeType: "Main Course",
        servings: 2,
        requiredCategories: ["Vegetables", "Spices"],
        optionalCategories: ["Grains"],
        instructions:
          "1. Heat oil in a pan\n2. Add chopped vegetables\n3. Season with spices\n4. Stir fry until vegetables are tender\n5. Serve over rice or noodles if available",
        difficulty: "Easy",
        prepTime: "20 minutes",
        mealType: "Lunch/Dinner",
      },
      {
        name: "Fruit Smoothie",
        recipeType: "Beverage",
        servings: 1,
        requiredCategories: ["Fruits"],
        optionalCategories: ["Dairy Products", "Beverages"],
        instructions:
          "1. Add fruits to blender\n2. Add milk or yogurt if available\n3. Add juice or water for desired consistency\n4. Blend until smooth\n5. Serve immediately",
        difficulty: "Easy",
        prepTime: "5 minutes",
        mealType: "Breakfast/Snack",
      },
      {
        name: "Vegetable Soup",
        recipeType: "Soup",
        servings: 4,
        requiredCategories: ["Vegetables", "Spices"],
        optionalCategories: ["Grains"],
        instructions:
          "1. Sauté onions and garlic if available\n2. Add chopped vegetables\n3. Add water or stock\n4. Season with spices\n5. Simmer until vegetables are tender\n6. Add grains like rice or pasta if desired\n7. Serve hot",
        difficulty: "Medium",
        prepTime: "40 minutes",
        mealType: "Lunch/Dinner",
      },
      {
        name: "Mixed Fruit Salad",
        recipeType: "Dessert",
        servings: 2,
        requiredCategories: ["Fruits"],
        optionalCategories: ["Dairy Products", "Snacks & Sweets"],
        instructions:
          "1. Wash and chop all fruits\n2. Mix in a large bowl\n3. Add yogurt or honey if available\n4. Chill before serving",
        difficulty: "Easy",
        prepTime: "15 minutes",
        mealType: "Breakfast/Dessert",
      },
      {
        name: "Grain Bowl",
        recipeType: "Main Course",
        servings: 2,
        requiredCategories: ["Grains"],
        optionalCategories: ["Vegetables", "Spices", "Dairy Products"],
        instructions:
          "1. Cook grains according to package instructions\n2. Prepare vegetables (raw or cooked)\n3. Season with spices\n4. Combine in a bowl\n5. Add dairy like cheese if available\n6. Serve warm or cold",
        difficulty: "Medium",
        prepTime: "30 minutes",
        mealType: "Lunch/Dinner",
      },
      {
        name: "Quick Pasta Dish",
        recipeType: "Main Course",
        servings: 3,
        requiredCategories: ["Grains"],
        optionalCategories: ["Vegetables", "Dairy Products"],
        instructions:
          "1. Boil pasta according to package instructions\n2. Prepare sauce with available ingredients\n3. Combine pasta with sauce\n4. Add cheese if available\n5. Serve hot",
        difficulty: "Easy",
        prepTime: "25 minutes",
        mealType: "Lunch/Dinner",
      },
      {
        name: "Yogurt Parfait",
        recipeType: "Dessert",
        servings: 1,
        requiredCategories: ["Dairy Products"],
        optionalCategories: ["Fruits", "Snacks & Sweets"],
        instructions:
          "1. Layer yogurt in a glass\n2. Add chopped fruits\n3. Add granola or nuts if available\n4. Repeat layers\n5. Serve immediately or refrigerate",
        difficulty: "Easy",
        prepTime: "10 minutes",
        mealType: "Breakfast/Snack",
      },
    ];

    if (isRegeneration) {
      for (let i = recipeTemplates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [recipeTemplates[i], recipeTemplates[j]] = [
          recipeTemplates[j],
          recipeTemplates[i],
        ];
      }
    }

    recipeTemplates.forEach((template) => {
      const hasRequiredIngredients = template.requiredCategories.every(
        (category) =>
          categorizedItems[category] && categorizedItems[category].length > 0
      );

      if (hasRequiredIngredients) {
        const recipe = {
          ...template,
          ingredients: [],
        };

        template.requiredCategories.forEach((category) => {
          categorizedItems[category].forEach((item) => {
            recipe.ingredients.push({
              name: item.itemName,
              quantity: item.quantity > 3 ? 3 : item.quantity,
              weightVolume: item.weightVolume,
              unit: item.unitOfMeasure,
              expiryDate: item.expiryDate,
              daysToExpiry: item.daysToExpiry,
            });
          });
        });

        template.optionalCategories.forEach((category) => {
          if (
            categorizedItems[category] &&
            categorizedItems[category].length > 0
          ) {
            categorizedItems[category].forEach((item) => {
              recipe.ingredients.push({
                name: item.itemName,
                quantity: item.quantity > 2 ? 2 : item.quantity,
                weightVolume: item.weightVolume,
                unit: item.unitOfMeasure,
                expiryDate: item.expiryDate,
                daysToExpiry: item.daysToExpiry,
              });
            });
          }
        });

        if (recipe.ingredients.length >= 3) {
          recipes.push(recipe);
        }
      }
    });

    const usedIngredients = new Set();
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        usedIngredients.add(ingredient.name);
      });
    });

    const unusedItems = allItems.filter(
      (item) => !usedIngredients.has(item.itemName)
    );

    if (unusedItems.length > 0) {
      const customRecipe = {
        name: "Quick Recipe",
        recipeType: "Papaya Mango Tango",
        servings: 2,
        ingredients: unusedItems.map((item) => ({
          name: item.itemName,
          quantity: item.quantity > 3 ? 3 : item.quantity,
          weightVolume: item.weightVolume,
          unit: item.unitOfMeasure,
          expiryDate: item.expiryDate,
          daysToExpiry: item.daysToExpiry,
        })),
        instructions:
          "Combine the ingredients based on their compatibility to create a simple dish.",
        difficulty: "Easy",
        prepTime: "15-30 minutes",
        mealType: "Dessert",
      };

      recipes.push(customRecipe);
    }

    return recipes;
  };

  const handleSaveRecipe = async (recipe) => {
    // Check if token exists before saving
    if (!token) {
      Swal.fire({
        title: "Unauthorized!",
        text: "You are not logged in. Please log in to continue.",
        icon: "error",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/recipes/save",
        recipe,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Recipe saved successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        Swal.fire({
          title: "Unauthorized",
          text: "You are not authorized to save recipes. Please log in.",
          icon: "error",
        }).then(() => {
          navigate("/login"); // Redirect to login page
        });
      } else {
        console.error("Error saving recipe:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to save recipe. Please try again.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="flex p-2">
      <SideBarInventory />
      <div className="flex-1 p-6 bg-gray-100 h-screen rounded-2xl ml-2  overflow-y-auto">
        <div className="flex flex-col p-6 bg-gray-100 h-screen">
          {/* Header */}
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Auto-Generated Recipe Suggestions
            </h1>
          </div>

          {/* Loading, Error, and Empty States */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : expiringItems.length === 0 ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <span className="block sm:inline">
                No items are about to expire within 3 days.
              </span>
            </div>
          ) : (
            <>
              {/* Expiring Items Summary Card */}
              <div className="mb-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Items close to Expire
                  </h2>
                  <div className="text-sm text-gray-500">
                    {expiringItems.length} items expiring soon
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {expiringItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {item.itemName}
                      <span className="ml-2 bg-orange-200 px-2 py-0.5 rounded-full text-xs">
                        {item.daysToExpiry} days
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mb-6">
                <button
                  className={`${regenerating
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-purple-700"
                    } text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md transition`}
                  onClick={regenerateRecipes}
                  disabled={regenerating}
                >
                  <FaSyncAlt className={regenerating ? "animate-spin" : ""} />
                  {regenerating ? "Regenerating..." : "Regenerate Recipes"}
                </button>
              </div>

              {/* Auto-Generated Recipes */}
              {generatedRecipes.length === 0 ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                  <span className="block sm:inline">
                    Unable to generate recipes with the current expiring
                    ingredients.
                  </span>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {generatedRecipes.length} Auto-Generated Recipes
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {generatedRecipes.map((recipe, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-md overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                          <h2 className="text-2xl font-bold text-white">
                            {recipe.name}
                          </h2>
                          <div className="flex flex-wrap mt-2">
                            <div className="w-full flex flex-wrap gap-2 mb-2">
                              <div className="bg-blue-700 px-3 py-1.5 rounded-lg text-white font-medium">
                                Name: {recipe.recipeType}
                              </div>
                              <div className="bg-purple-700 px-3 py-1.5 rounded-lg text-white font-medium">
                                Meal Type: {recipe.mealType}
                              </div>
                            </div>
                            <div className="w-full flex flex-wrap gap-2">
                              <div className="bg-indigo-700 px-3 py-1.5 rounded-lg text-white font-medium">
                                Serves: {recipe.servings}{" "}
                                {recipe.servings === 1 ? "person" : "people"}
                              </div>
                              <div className="bg-violet-700 px-3 py-1.5 rounded-lg text-white font-medium">
                                Prep time: {recipe.prepTime}
                              </div>
                              <div className="bg-fuchsia-700 px-3 py-1.5 rounded-lg text-white font-medium">
                                Difficulty: {recipe.difficulty}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2 border-b border-gray-200 pb-2">
                              Ingredients
                            </h3>
                            <ul className="space-y-2">
                              {recipe.ingredients.map((ingredient, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mt-2 mr-2"></span>
                                  <div>
                                    <span className="font-medium">
                                      {ingredient.quantity} *{" "}
                                      {ingredient.weightVolume}
                                      {ingredient.unit} {ingredient.name}
                                    </span>
                                    <span className="text-sm text-red-500 ml-2">
                                      (expires in {ingredient.daysToExpiry}{" "}
                                      days)
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2 border-b border-gray-200 pb-2">
                              Instructions
                            </h3>
                            <ol className="space-y-2">
                              {recipe.instructions
                                .split("\n")
                                .map((instruction, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mr-2">
                                      {idx + 1}
                                    </span>
                                    <span>
                                      {instruction.replace(/^\d+\.\s*/, "")}
                                    </span>
                                  </li>
                                ))}
                            </ol>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-600 shadow-sm"
                              onClick={() => handleSaveRecipe(recipe)}
                            >
                              <FaSave /> Save Recipe
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoRecipeGenerator;
