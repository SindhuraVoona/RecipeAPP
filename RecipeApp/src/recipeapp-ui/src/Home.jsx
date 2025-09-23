import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://localhost:7136/api/recipes")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch recipes. Is the API running and CORS enabled?");
        setLoading(false);
        console.error(err);
      });
  }, []);

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
            <div key={recipe.recipeId} className="card">
              <h3>{recipe.title}</h3>
              <Link to={`/recipes/${recipe.recipeId}`}>
                <button>View Details</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;