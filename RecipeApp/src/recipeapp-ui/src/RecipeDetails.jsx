import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`https://localhost:7136/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading recipe...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!recipe) return <div className="p-4">Recipe not found.</div>;

  return (
    <div className="recipe-details-container max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
      <p className="text-gray-700 mb-6">{recipe.description}</p>

      {/* Ingredients Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
        {recipe.recipeIngredients && recipe.recipeIngredients.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
  {recipe.recipeIngredients.map((ri) => (
    <li key={ri.ingredientId} className="text-gray-800">
      <span className="font-medium">{ri.ingredient?.name}</span>
      {ri.quantity && (
        <span className="text-gray-600 ml-2">({ri.quantity})</span>
      )}
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
