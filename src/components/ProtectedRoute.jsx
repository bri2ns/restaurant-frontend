import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded?.role;

    // If role prop is passed, ensure user matches it
    if (role && userRole !== role) {
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (err) {
    console.error("Token decode error:", err);
    return <Navigate to="/login" replace />;
  }

  return children;
}
