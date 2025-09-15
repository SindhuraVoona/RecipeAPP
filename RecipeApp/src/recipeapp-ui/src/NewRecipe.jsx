import { useState } from "react";

const Form = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
  });

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recipe Submitted:", recipe);
    alert("Recipe submitted! Check console for data.");
    // Later: send this data to an API or state
    setRecipe({ name: "", ingredients: "", instructions: "" });
  };

  return (
    <div className="form-container">
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipe Name:</label>
          <input
            type="text"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ingredients (comma-separated):</label>
          <input
            type="text"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Instructions:</label>
          <textarea
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default Form;
