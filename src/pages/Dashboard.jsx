import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import ChatWidget from "../components/ChatWidget.jsx";
import { useAuth } from "../services/AuthContext.jsx";
import { api } from "../services/api.js";

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [url, setUrl] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const scansRemaining = user?.scans_remaining ?? 0;
  const maxScans = user?.max_scans ?? 10;
  const limitReached = scansRemaining <= 0;

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) {
      setError("Please enter a URL to audit.");
      return;
    }
    setScanning(true);
    try {
      const report = await api.runScan(url.trim(), consent);
      await refreshUser();
      navigate(`/report/${report.id}`, { state: { report } });
    } catch (e) {
      setError(e.message || "Could not run this scan. Please check the URL and try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <NavBar />
      <main className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <p className="eyebrow">AI TRUST AUDIT</p>
        <h1 style={{ fontSize: 34, marginTop: 8, maxWidth: 640 }}>
          Check any AI agent before you trust it with your data.
        </h1>
        <p style={{ color: "var(--grey)", marginTop: 10, maxWidth: 560, lineHeight: 1.6 }}>
          Enter the URL of an AI product — a chatbot, assistant, or agent — and SentinelAI will
          scan its infrastructure, privacy practices, permissions, and behaviour to produce a
          trust report.
        </p>

        <form onSubmit={handleScan} className="card" style={styles.form}>
          <label style={styles.label} htmlFor="url">AI agent URL</label>
          <input
            id="url"
            style={styles.input}
            placeholder="e.g. chatgpt.com, lovable.dev, my-ai-agent.vercel.app"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={limitReached || scanning}
          />

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={limitReached || scanning}
            />
            <span style={{ fontSize: 13, color: "var(--grey)" }}>
              I'm authorised to run active behavioural tests against this URL (optional — enables deeper checks).
            </span>
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.footerRow}>
            <span style={styles.counter}>
              {scansRemaining} of {maxScans} audits remaining
            </span>
            <button className="btn btn-primary" type="submit" disabled={limitReached || scanning}>
              {scanning ? "Scanning…" : "Run Audit"}
            </button>
          </div>

          {limitReached && (
            <p style={styles.limitNote}>
              You've used all your audits. Go to <a href="/settings">Settings</a> to delete your account and start fresh.
            </p>
          )}
        </form>
      </main>
      <ChatWidget />
    </div>
  );
}

const styles = {
  form: { marginTop: 32, padding: 28, maxWidth: 620, display: "flex", flexDirection: "column", gap: 14 },
  label: { fontSize: 13, fontWeight: 600, color: "var(--ink)" },
  input: {
    padding: "13px 14px",
    borderRadius: 10,
    border: "1.5px solid var(--border)",
    fontSize: 15,
    fontFamily: "var(--font-mono)",
  },
  checkboxRow: { display: "flex", alignItems: "flex-start", gap: 8 },
  error: { color: "var(--red)", fontSize: 13 },
  footerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  counter: { fontSize: 12.5, color: "var(--grey)", fontFamily: "var(--font-mono)" },
  limitNote: { fontSize: 12.5, color: "var(--red)" },
};
