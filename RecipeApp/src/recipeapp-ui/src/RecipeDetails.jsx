import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data);
      } catch (err) {
        // Prefer backend message if available, otherwise generic error
        const message = err?.response?.data?.message || err?.message || "Failed to fetch recipe details";
        setError(message);
        console.error("Fetch recipe error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    const ok = window.confirm("Delete this recipe? This action cannot be undone.");
    if (!ok) return;

    try {
      await api.delete(`/recipes/${id}`);
      // redirect back to home after successful delete
      navigate("/");
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete recipe. See console for details.");
    }
  };

  if (loading) return <div className="text-center p-4">Loading recipe...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!recipe) return <div className="p-4">Recipe not found.</div>;

  return (
    <div className="recipe-details-container max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="details-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
        <button onClick={handleDelete} className="delete-icon-btn" aria-label="Delete recipe" title="Delete recipe">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="delete-icon"
            aria-hidden="true"
            focusable="false"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      <p className="text-gray-700 mb-6">{recipe.description}</p>

      {/* Ingredients Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
        {recipe.recipeIngredients && recipe.recipeIngredients.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {recipe.recipeIngredients.map((ri) => (
              <li key={ri.ingredientId} className="text-gray-800">
                <span className="font-medium">{ri.ingredient?.name}</span>
                {ri.quantity && <span className="text-gray-600 ml-2">({ri.quantity})</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No ingredients listed.</p>
        )}
      </div>

      {/* Instructions Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Instructions</h3>
        {recipe.instructions ? (
          <p className="text-gray-800">{recipe.instructions}</p>
        ) : (
          <p className="text-gray-500">No instructions available.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;