import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import RecipeDetails from "./RecipeDetails";
import NewRecipe from "./NewRecipe";
import Profile from "./Profile";
import Login from "./Login";
import Register from "./Register";
import EditRecipeForm from "./EditRecipeForm";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/add-recipe" element={<ProtectedRoute><NewRecipe /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/recipes/:id" element={<ProtectedRoute><DynamicRecipeDetails /></ProtectedRoute>} />
          <Route path="/recipes/:id/edit" element={<ProtectedRoute><DynamicEditForm /></ProtectedRoute>} />
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