import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import ChatWidget from "../components/ChatWidget.jsx";
import { api } from "../services/api.js";

const RISK_COLOR = { low: "#1D9C6F", moderate: "#C9821A", high: "#C0392B", critical: "#C0392B" };

export default function History() {
  const [scans, setScans] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getHistory().then(setScans).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <NavBar />
      <main className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <p className="eyebrow">HISTORY</p>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Your past audits</h1>

        {error && <p style={{ color: "var(--red)", marginTop: 20 }}>{error}</p>}

        {scans && scans.length === 0 && (
          <p style={{ color: "var(--grey)", marginTop: 24 }}>
            You haven't run any audits yet. <Link to="/dashboard">Run your first one →</Link>
          </p>
        )}

        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
          {scans && scans.map((s) => (
            <Link key={s.id} to={`/report/${s.id}`} className="card" style={styles.row}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14.5, wordBreak: "break-all" }}>{s.target_url}</p>
                <p style={{ fontSize: 12, color: "var(--grey)", marginTop: 3 }}>
                  {new Date(s.created_at).toLocaleString()}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: RISK_COLOR[s.risk_level] }}>
                  {s.overall_score}
                </span>
                <span style={{ ...styles.pill, color: RISK_COLOR[s.risk_level] }}>{s.risk_level}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 18px",
    gap: 16,
  },
  pill: { fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" },
};
