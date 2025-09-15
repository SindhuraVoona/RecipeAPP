
import { Link } from "react-router-dom";

const Home = () => {
  const recipes = [
    { id: 1, name: "Spaghetti Carbonara" },
    { id: 2, name: "Chicken Curry" },
    { id: 3, name: "Veggie Stir Fry" },
  ];

  return (
    <div>
      <h2>Home Page</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
