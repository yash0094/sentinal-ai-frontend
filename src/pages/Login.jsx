import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import { api } from "../services/api.js";
import logo from "../assets/logo.jpg";

export default function Login() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div style={styles.wrap}>
      <div className="card" style={styles.card}>
        <img src={logo} alt="SentinelAI" style={styles.logo} />
        <h1 style={styles.title}>Welcome to SentinelAI</h1>
        <p style={styles.sub}>
          Sign in to start auditing AI agents before you share your data with them.
        </p>

        <a href={api.googleLoginUrl()} style={{ width: "100%" }}>
          <button className="btn btn-outline" style={styles.googleBtn}>
            <GoogleIcon />
            Continue with Google
          </button>
        </a>

        <p style={styles.fine}>
          We only accept verified Google accounts — no manually typed emails.
          By continuing you agree this is an evidence-based audit tool, not a guarantee of safety.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.4 26.7 37 24 37c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 40.6 16.2 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C40.9 36 44 30.9 44 24c0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--white)", padding: 24 },
  card: { width: 400, maxWidth: "100%", padding: "40px 32px", textAlign: "center" },
  logo: { width: 56, height: 56, borderRadius: 14, objectFit: "cover", marginBottom: 18 },
  title: { fontSize: 24, marginBottom: 8 },
  sub: { color: "var(--grey)", fontSize: 14, marginBottom: 26, lineHeight: 1.5 },
  googleBtn: { width: "100%", padding: "12px 18px", fontSize: 14.5 },
  fine: { color: "var(--grey)", fontSize: 11.5, marginTop: 22, lineHeight: 1.5 },
};
