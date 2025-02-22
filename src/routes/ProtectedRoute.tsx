import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p></p>;
  return isAuthenticated ? children : <Navigate to={"/login"} />;
};

export default ProtectedRoute;
