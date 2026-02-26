import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute wraps components that require authentication.
 * If no valid token exists in localStorage, redirects to /login.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
