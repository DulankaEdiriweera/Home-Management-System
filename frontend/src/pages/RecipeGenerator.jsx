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

      const filteredData = response.data.filter((item) => {
        const expiryDate = new Date(item.expiryDate);
        return expiryDate > new Date(); // Only include items that are not expired
      });

      const formattedData = filteredData.map((item) => ({
        ...item,
        expiryDate: new Date(item.expiryDate).toISOString().split("T")[0],
        daysToExpiry: Math.ceil(
          (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        ),
      }));

      setExpiringItems(formattedData);

      // Get ingredients from the expiring items to pass to the backend
      if (formattedData.length > 0) {
        const ingredients = formattedData.map((item) => item.itemName); // Assuming item.name holds the ingredient name
        console.log("Ingredients being passed:", ingredients);
        // Send ingredients to backend to get recipe suggestions
        const recipeResponse = await axios.post(
          "http://localhost:4000/recipes/generate-recipe",
          { ingredients },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // Add the token to the Authorization header
            },
          }
        );

        setGeneratedRecipes(recipeResponse.data.recipes);

        if (recipeResponse.data.recipes.length > 0) {
          Swal.fire({
            title: "Success!",
            text: `${recipeResponse.data.recipes.length} recipes automatically generated from your expiring ingredients!`,
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
        setError(err.response?.data?.message || "Error fetching recipies");
      }
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  return (
    <div className="flex p-2">
      <SideBarInventory />
      <div className="flex-1 p-6 bg-gray-100 h-screen rounded-2xl ml-2  overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Generated Recipes</h2>
        {loading && <p>Loading recipes...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Expiring Items Summary Card */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Items close to Expire</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedRecipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
            >
              {/* Recipe Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {recipe.title}
              </h3>

              {/* Recipe Image */}
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />

              {/* Servings & Cooking Time */}
              <div className="flex justify-between text-gray-600 text-sm mb-2">
                <p>
                  <strong>Servings:</strong> {recipe.servings}
                </p>
                <p>
                  <strong>Ready In:</strong> {recipe.readyInMinutes} min
                </p>
              </div>

              {/* Ingredients List */}
              <div className="mb-2">
                <h4 className="font-semibold text-gray-700 text-sm">
                  Ingredients:
                </h4>
                <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-semibold text-gray-700 text-sm">
                  Instructions:
                </h4>
                <p className="text-gray-600 text-sm">
                  {recipe.instructions
                    ? recipe.instructions
                    : "No instructions available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoRecipeGenerator;
