import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import logo from "../assets/logo.jpg";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/dashboard" style={styles.brand}>
          <img src={logo} alt="SentinelAI" style={styles.logo} />
          <span style={styles.brandText}>SentinelAI</span>
        </Link>

        {user && (
          <nav style={styles.nav}>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/history" style={styles.link}>History</Link>
            <Link to="/help" style={styles.link}>Help</Link>
            <Link to="/settings" style={styles.link}>Settings</Link>
            <button
              className="btn btn-outline"
              style={{ padding: "8px 16px", fontSize: 13 }}
              onClick={() => { logout(); navigate("/login"); }}
            >
              Sign out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)",
    zIndex: 20,
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  logo: { width: 32, height: 32, borderRadius: 8, objectFit: "cover" },
  brandText: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink)" },
  nav: { display: "flex", alignItems: "center", gap: 22 },
  link: { color: "var(--ink-soft)", fontSize: 14, fontWeight: 500 },
};
