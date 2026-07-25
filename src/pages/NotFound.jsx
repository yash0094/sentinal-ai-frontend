import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <h1 style={{ fontSize: 28 }}>Page not found</h1>
      <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 8 }}>Back to Dashboard</Link>
    </div>
  );
}
