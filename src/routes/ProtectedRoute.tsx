import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p></p>;
  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
};

export default ProtectedRoute;
