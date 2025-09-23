import { useEffect, useState } from "react";

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [message, setMessage] = useState("");

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://localhost:7136/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const removeIngredientField = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const newRecipe = {
      title,
      instructions,
      categoryId: categoryId ? parseInt(categoryId) : null,
      recipeIngredients: ingredients
        .filter((i) => i.name.trim() !== "")
        .map((i) => ({
          ingredient: { name: i.name },
          quantity: i.quantity,
        })),
    };

    try {
      const response = await fetch("https://localhost:7136/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) throw new Error("Failed to save recipe");

      setMessage("✅ Recipe saved successfully!");
      setTitle("");
      setInstructions("");
      setCategoryId("");
      setIngredients([{ name: "", quantity: "" }]);
    } catch (err) {
      setMessage("❌ Error saving recipe.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Recipe</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            className="input-medium border rounded-lg p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block font-medium mb-1">Instructions</label>
          <textarea
            className="input-large border rounded-lg p-2"
            rows="4"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            className="category-dropdown border rounded-lg p-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ingredients Section */}
        <div>
          <label className="block font-medium mb-2">Ingredients</label>
          <div className="space-y-2">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="input-medium flex-1 border rounded-lg p-2"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                />
                <input
                  className="input-small border rounded-lg p-2"
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 text-white bg-red-500 rounded-lg"
                    onClick={() => removeIngredientField(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg"
            onClick={addIngredientField}
          >
            ➕ Add Ingredient
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700"
        >
          Save Recipe
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 text-center font-semibold ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddRecipe;