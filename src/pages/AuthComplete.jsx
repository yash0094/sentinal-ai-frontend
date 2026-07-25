import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/api.js";
import { useAuth } from "../services/AuthContext.jsx";

export default function AuthComplete() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash; // "#token=..."
    const token = new URLSearchParams(hash.replace("#", "")).get("token");

    if (!token) {
      setError(true);
      return;
    }

    setToken(token);
    refreshUser().then(() => navigate("/dashboard", { replace: true }));
  }, []);

  if (error) {
    return (
      <div style={styles.wrap}>
        <p>Login failed. <a href="/login">Try again</a>.</p>
      </div>
    );
  }

  return <div style={styles.wrap}>Signing you in…</div>;
}

const styles = {
  wrap: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--grey)" },
};
