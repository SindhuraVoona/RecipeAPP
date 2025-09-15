import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();

  // For now, we'll use a placeholder. Later you can fetch recipe details from API
  const recipe = {
    id,
    name: "Sample Recipe",
    ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
    instructions: "Mix all ingredients and cook for 20 minutes."
  };

  return (
    <div>
      <h2>{recipe.name}</h2>
      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default RecipeDetails;
