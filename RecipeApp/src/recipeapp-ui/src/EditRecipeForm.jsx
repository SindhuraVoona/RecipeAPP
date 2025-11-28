import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Props:
 * - editMode: boolean
 * - recipeId?: number|string
 *
 * If editMode is true, the component will fetch the recipe by recipeId
 * and prefill the form. On submit it will PUT /recipes/{id}.
 * Otherwise it POSTs to /recipes.
 */
const EditRecipeForm = ({ editMode = false, recipeId }) => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [instructions, setInstructions] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
    const [loading, setLoading] = useState(editMode); // loading true when editing
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get("/categories");
                setCategories(data || []);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!editMode || !recipeId) return;

        const loadRecipe = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/recipes/${recipeId}`);
                if (data) {
                    setTitle(data.title ?? "");
                    setDescription(data.description ?? "");
                    setInstructions(data.instructions ?? "");
                    setCategoryId(data.category?.categoryId ?? data.categoryId ?? "");
                    const mapped = (data.recipeIngredients || []).map((ri) => ({
                        name: ri.ingredient?.name ?? ri.ingredientName ?? "",
                        quantity: ri.quantity ?? "",
                    }));
                    setIngredients(mapped.length > 0 ? mapped : [{ name: "", quantity: "" }]);
                } else {
                    setError("Recipe not found");
                }
            } catch (err) {
                console.error("Failed to load recipe", err);
                const msg = err?.response?.data?.message || err?.message || "Error loading recipe";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        loadRecipe();
    }, [editMode, recipeId]);

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
        setIngredients(updated.length ? updated : [{ name: "", quantity: "" }]);
    };

    const buildPayload = () => {
        return {
            title,
            description,
            categoryId: categoryId ? parseInt(categoryId, 10) : null,
            recipeIngredients: ingredients
                .filter((i) => i.name && i.name.trim() !== "")
                .map((i) => ({
                    ingredient: { name: i.name },
                    quantity: i.quantity,
                })),
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const payload = buildPayload();
        try {
            if (editMode && recipeId) {
                await api.put(`/recipes/${recipeId}`, { ...payload, recipeId: Number(recipeId) });
                navigate(`/recipes/${recipeId}`);
            } else {
                const { data } = await api.post("/recipes", payload);
                const newId = data?.recipeId;
                if (newId) navigate(`/recipes/${newId}`);
                else navigate("/");
            }
        } catch (err) {
            console.error("Save recipe error", err);
            const msg = err?.response?.data?.message || err?.message || "Failed to save recipe";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4">Loading recipe...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">{editMode ? "Edit Recipe" : "Add New Recipe"}</h2>

            {error && <div className="mb-4 text-red-600">{error}</div>}

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

                {/* Description */}
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        className="input-large border rounded-lg p-2"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        value={categoryId ?? ""}
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
                                <button
                                    type="button"
                                    className="px-3 py-1 text-white bg-red-500 rounded-lg"
                                    onClick={() => removeIngredientField(index)}
                                >
                                    ✕
                                </button>
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
                <button type="submit" disabled={saving} className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700">
                    {saving ? (editMode ? "Saving..." : "Creating...") : editMode ? "Save Changes" : "Save Recipe"}
                </button>
            </form>
        </div>
    );
};

export default EditRecipeForm;