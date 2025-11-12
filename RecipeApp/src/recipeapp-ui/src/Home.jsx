import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get("/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.error("Fetch recipes error:", err);
        const message = err?.response?.data?.message || err?.message || "Failed to fetch recipes.";
        setError(`${message} Is the API running and CORS enabled?`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (recipeId) => {
    const ok = window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.");
    if (!ok) return;

    try {
      await api.delete(`/recipes/${recipeId}`);
      // Remove from state so UI updates without refetch
      setRecipes((prev) => prev.filter((r) => r.recipeId !== recipeId));
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete recipe. See console for details.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="home-container">
      <h2>Recipes</h2>
      <div className="recipes-grid">
        {recipes.length === 0 ? (
          <div>No recipes found.</div>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.recipeId} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
              <div>
                <h3 style={{ margin: 0 }}>{recipe.title}</h3>
                <div style={{ marginTop: 6 }}>
                  <Link to={`/recipes/${recipe.recipeId}`}>
                    <button style={{ marginRight: 8 }}>View Details</button>
                  </Link>
                </div>
              </div>

              {/* Icon-only delete button */}
              <button
                onClick={() => handleDelete(recipe.recipeId)}      /* or requestDelete() in details */
                aria-label={`Delete ${recipe.title}`}
                title="Delete recipe"
                className="delete-icon-btn"
              >
                <svg className="delete-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;