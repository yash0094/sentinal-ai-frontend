import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import logo from "../assets/logo.jpg";

export default function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      if (loading) return;
      navigate(user ? "/dashboard" : "/login");
    }, 1600);
    return () => clearTimeout(t);
  }, [loading, user, navigate]);

  return (
    <div style={styles.wrap}>
      <div style={styles.ringOuter}>
        <div style={styles.ringInner}>
          <img src={logo} alt="SentinelAI" style={styles.logo} />
        </div>
      </div>
      <h1 style={styles.title}>SentinelAI</h1>
      <p className="eyebrow" style={{ marginTop: 6 }}>TRUST · VERIFY · PROTECT</p>
    </div>
  );
}

const styles = {
  wrap: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--white)",
  },
  ringOuter: {
    width: 128,
    height: 128,
    borderRadius: "50%",
    border: "3px solid var(--border)",
    borderTopColor: "var(--blue)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "spin 1.4s linear infinite",
  },
  ringInner: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
  },
  logo: { width: "100%", height: "100%", objectFit: "cover" },
  title: { fontSize: 30, marginTop: 24, letterSpacing: "-0.01em" },
};

const styleSheet = document.createElement("style");
styleSheet.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);
