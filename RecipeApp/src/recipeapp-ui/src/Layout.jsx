import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

console.log("Layout rendered — updated at", new Date().toISOString());

const Layout = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("token")));
  // const [isAuthenticated, setIsAuthenticated] = useState(Boolean(true));
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/recipes");
      const data = response.data;
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message ?? "Failed to load recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    // update auth state if localStorage changed in other tabs
    const onStorage = () => setIsAuthenticated(Boolean(localStorage.getItem("token")));
    // custom event for same-tab login/logout
    const onAuthChanged = () => setIsAuthenticated(Boolean(localStorage.getItem("token")));

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChanged", onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, []);

  // refetch when authentication changes
  useEffect(() => {
    fetchRecipes();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  return (
    <div className="app-container">
      <header className="py-4 px-6 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recipe App</h1>

        <nav className="space-x-4">
          {/* <Link to="/">Home</Link> */}
      
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/add-recipe">Add Recipe</Link>
              <button onClick={handleLogout} className="underline ml-2">
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="container mx-auto p-6">
        {children}
        {/* recipes list removed from layout */}
      </main>

      <footer className="text-center py-6">© 2025 Recipe App</footer>
    </div>
  );
};

export default Layout;