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

  const handleEdit = () => {
    // navigate to the edit form; EditRecipeForm will fetch and prefill by id
    navigate(`/recipes/${id}/edit`);
  };

  if (loading) return <div className="text-center p-4">Loading recipe...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!recipe) return <div className="p-4">Recipe not found.</div>;

  return (
    <div className="recipe-details-container max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div
        className="details-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Edit icon button */}
          <button
            onClick={handleEdit}
            aria-label="Edit recipe"
            title="Edit recipe"
            className="icon-btn edit-icon-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="edit-icon"
              aria-hidden="true"
              focusable="false"
            >
              {/* Pencil icon (stroke uses currentColor) */}
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
              <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>

          {/* Delete icon button */}
          <button
            onClick={handleDelete}
            aria-label="Delete recipe"
            title="Delete recipe"
            className="icon-btn delete-icon-btn"
          >
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