import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // term entered by the user to filter the list
  const [searchTerm, setSearchTerm] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/recipes", {
          params: { page, pageSize }
        });
        const data = response.data;
        // data is expected to have { items, totalCount }
        if (page === 1) {
          setRecipes(data.items || []);
        } else {
          setRecipes((prev) => [...prev, ...(data.items || [])]);
        }
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error("Fetch recipes error:", err);
        const message = err?.response?.data?.message || err?.message || "Failed to fetch recipes.";
        setError(`${message} Is the API running at ${err?.config?.baseURL}${err?.config?.url}?`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [page]);

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

  // derive filtered list based on search term (case-insensitive)
  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && page === 1) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="home-container">
      <h2>Recipes</h2>
      {/* search bar with icon */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Search recipes by name..."
          aria-label="Search recipes by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: 6, flex: 1 }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          style={{ marginLeft: 8 }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <div className="recipes-grid">
        {filteredRecipes.length === 0 ? (
          <div>No recipes found.</div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div key={recipe.recipeId} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
              <div>
                <h3 style={{ margin: 0 }}>{recipe.title}</h3>
                {recipe.ratings && recipe.ratings.length > 0 && (
                  <div style={{ fontSize: '0.9rem', color: '#555' }}>
                    Avg: {(
                      recipe.ratings.reduce((sum, r) => sum + (r.ratingValue || 0), 0) /
                      recipe.ratings.length
                    ).toFixed(1)} / 5
                  </div>
                )}
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

      {/* load more button for pagination */}
      {recipes.length < totalCount && (
        <div className="text-center mt-4">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;