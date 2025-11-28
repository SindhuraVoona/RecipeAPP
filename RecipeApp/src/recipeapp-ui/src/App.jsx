import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import RecipeDetails from "./RecipeDetails";
import NewRecipe from "./NewRecipe";
import Profile from "./Profile";
import Login from "./Login";
import Register from "./Register";
import EditRecipeForm from "./EditRecipeForm";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-recipe" element={<NewRecipe />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipes/:id" element={<DynamicRecipeDetails />} />
          <Route path="/recipes/:id/edit" element={<DynamicEditForm />} />
        </Routes>
      </Layout>
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
  return <EditRecipeForm editMode={true} recipeId={id} />;
}