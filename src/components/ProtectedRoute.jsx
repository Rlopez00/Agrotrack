// src/components/ProtectedRoute.jsx

import React from "react";

const ProtectedRoute = ({ children }) => {
  // Temporarily disable authentication check for development
  return children;
};

export default ProtectedRoute;
