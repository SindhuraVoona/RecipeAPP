import { Link } from "react-router-dom";

const Home = () => {
  // Sample recipe data; replace with API later
  const recipes = [
    { id: 1, name: "Spaghetti Carbonara" },
    { id: 2, name: "Chicken Curry" },
    { id: 3, name: "Veggie Stir Fry" },
  ];

  return (
    <div className="home-container">
      <h2>Recipes</h2>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="card">
            <h3>{recipe.name}</h3>
            <Link to={`/recipes/${recipe.id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
