import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <header>
        <h1>Recipe App</h1>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/add-recipe">Add Recipe</Link> |{" "}
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <main className="container">
        {children}
      </main>

      <footer>
        &copy; 2025 Recipe App
      </footer>
    </div>
  );
};

export default Layout;
