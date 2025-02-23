import { Route, Routes } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Main from "../layouts/Main";
import ViewTask from "../pages/ViewTask";

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
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/task/:id" element={<ViewTask />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
