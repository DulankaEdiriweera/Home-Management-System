import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return isAuthenticated ? (
    <Outlet /> // Renders the child route
  ) : (
    <Navigate to="/login" /> // Redirects to login if not authenticated
  );
};
export default ProtectedRoutes;
