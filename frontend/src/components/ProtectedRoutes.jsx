import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoutes = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return isAuthenticated ? (
    <Outlet /> // Renders the child route
  ) : (
    <Navigate to="/login" /> // Redirects to login if not authenticated
  );
};

ProtectedRoutes.propTypes = {
  component: PropTypes.elementType, // Validates that 'component' is a React component
};

export default ProtectedRoutes;
