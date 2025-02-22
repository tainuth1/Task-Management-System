import { Route, Routes } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Main from "../layouts/Main";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
