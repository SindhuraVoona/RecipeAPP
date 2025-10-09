import { Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes/:id" element={<DynamicRecipeDetails />} />
        <Route path="/recipes/:id/edit" element={<DynamicEditForm />} />
        <Route path="/add-recipe" element={<NewRecipe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </Router>
  );
}

// Wrappers to read params from React Router
function DynamicRecipeDetails() {
  const { id } = useParams();
  return <RecipeDetails id={id} />;
}

function DynamicEditForm() {
  const { id } = useParams();
  return <RecipeForm editMode={true} recipeId={id} />;
}

