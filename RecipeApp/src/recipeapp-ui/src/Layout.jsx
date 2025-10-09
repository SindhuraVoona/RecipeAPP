import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes from API
    fetch("https://localhost:7136/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch(() => setRecipes([]));
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Recipe App</h1>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/add-recipe">Add Recipe</Link> |{" "}
          <Link to="/profile">Profile</Link> |{" "}
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <main className="container">
        {children}
        <section>
          <h2>Recipe List</h2>
          <ul>
            {recipes.length === 0 && <li>No recipes found.</li>}
            {recipes.map((recipe) => (
              <li key={recipe.recipeId}>
                <strong>{recipe.title}</strong> - {recipe.description}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer>
        &copy; 2025 Recipe App
      </footer>
    </div>
  );
};

export default Layout;