import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", color: "#5A6472" }}>
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
