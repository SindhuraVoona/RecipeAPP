const RecipeDetails = ({ id }) => {
  // Placeholder recipe data; replace with API later
  const recipe = {
    id,
    name: `Recipe ${id}`,
    ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
    instructions: "Mix all ingredients and cook for 20 minutes.",
  };

  return (
    <div className="recipe-details-container">
      <h2>{recipe.name}</h2>
      <div className="card">
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3>Instructions:</h3>
        <p>{recipe.instructions}</p>
      </div>
    </div>
  );
};

export default RecipeDetails;
