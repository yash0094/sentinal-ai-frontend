import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import ChatWidget from "../components/ChatWidget.jsx";
import TrustRing from "../components/TrustRing.jsx";
import { api, downloadScanPdf } from "../services/api.js";

const STATUS_STYLE = {
  pass: { bg: "#E9F7F0", fg: "#1D9C6F", label: "Pass" },
  warning: { bg: "#FDF3E4", fg: "#C9821A", label: "Warning" },
  fail: { bg: "#FBEAE8", fg: "#C0392B", label: "Fail" },
  not_applicable: { bg: "#F1F3F7", fg: "#5A6472", label: "Not Tested" },
};

const SEVERITY_STYLE = {
  critical: { bg: "#FBEAE8", fg: "#C0392B" },
  high: { bg: "#FDEDE9", fg: "#C0392B" },
  medium: { bg: "#FDF3E4", fg: "#C9821A" },
  low: { bg: "#E9F7F0", fg: "#1D9C6F" },
};

export default function ReportView() {
  const { id } = useParams();
  const location = useLocation();
  const [report, setReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState("");

  useEffect(() => {
    if (report) return;
    api.getScan(id).then(setReport).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageShell><p style={{ padding: 40 }}>Loading report…</p></PageShell>;
  if (error || !report) return <PageShell><p style={{ padding: 40, color: "var(--red)" }}>{error || "Report not found."}</p></PageShell>;

  return (
    <PageShell scanId={report.id}>
      <div className="container" style={{ paddingTop: 44, paddingBottom: 90 }}>
        <Link to="/history" style={{ fontSize: 13, color: "var(--grey)" }}>← Back to history</Link>

        <div style={styles.headerRow}>
          <div>
            <p className="eyebrow">AI TRUST REPORT</p>
            <h1 style={{ fontSize: 26, marginTop: 6, wordBreak: "break-all" }}>{report.target_url}</h1>
            <p style={{ color: "var(--grey)", fontSize: 13, marginTop: 6 }}>
              Scanned {new Date(report.created_at).toLocaleString()} · Likely model: {report.fingerprint_guess || "Unknown"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <TrustRing score={report.overall_score} riskLevel={report.risk_level} />
            <span style={{ ...styles.riskPill, ...riskPillColor(report.risk_level) }}>{report.risk_level.toUpperCase()} RISK</span>
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => downloadScanPdf(report.id)}>
          ⬇ Download PDF Report
        </button>

        <Section title="Layer-by-Layer Results">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {report.layers.map((layer) => {
              const s = STATUS_STYLE[layer.status];
              return (
                <div key={layer.name} className="card" style={{ padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <strong style={{ fontSize: 14 }}>{layer.name}</strong>
                    <span style={{ ...styles.badge, background: s.bg, color: s.fg }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.5 }}>{layer.summary}</p>
                  <div style={styles.miniBarTrack}>
                    <div style={{ ...styles.miniBarFill, width: `${layer.score}%`, background: s.fg }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Red Flags">
          {report.red_flags.length === 0 ? (
            <p style={{ color: "var(--grey)", fontSize: 14 }}>No red flags were identified.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {report.red_flags.map((f, i) => {
                const s = SEVERITY_STYLE[f.severity];
                return (
                  <div key={i} className="card" style={{ padding: "14px 16px", borderLeft: `4px solid ${s.fg}` }}>
                    <span style={{ ...styles.badge, background: s.bg, color: s.fg, marginRight: 8 }}>{f.severity.toUpperCase()}</span>
                    <strong>{f.title}</strong>
                    <p style={{ fontSize: 13.5, color: "var(--grey)", marginTop: 4 }}>{f.explanation}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Section title="Safe to Share">
            <ul style={styles.list}>
              {report.safe_to_share.map((x, i) => <li key={i} style={{ color: "var(--green)" }}>✔ {x}</li>)}
            </ul>
          </Section>
          <Section title="Avoid Sharing">
            <ul style={styles.list}>
              {report.unsafe_to_share.map((x, i) => <li key={i} style={{ color: "var(--red)" }}>✘ {x}</li>)}
            </ul>
          </Section>
        </div>

        <Section title="Recommendation">
          <p style={{ fontSize: 14, marginBottom: 6 }}><strong>Suitable for:</strong> {report.recommendation_suitable_for.join(", ")}</p>
          <p style={{ fontSize: 14 }}><strong>Avoid using for:</strong> {report.recommendation_avoid_for.join(", ")}</p>
        </Section>

        <Section title="Why This Score">
          <ul style={styles.list}>
            {report.explainability.map((r, i) => <li key={i} style={{ color: "var(--ink-soft)" }}>{r}</li>)}
          </ul>
        </Section>

        <p style={styles.disclaimer}>
          This report is an evidence-based risk assessment, not a guarantee of safety. Layers marked
          "Not Tested" mean the evidence wasn't available automatically — treat that as unknown, not safe.
        </p>
      </div>
    </PageShell>
  );
}

function PageShell({ children, scanId }) {
  return (
    <div>
      <NavBar />
      {children}
      <ChatWidget scanId={scanId} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 17, marginBottom: 14 }}>{title}</h2>
      {children}
    </section>
  );
}

function riskPillColor(level) {
  const map = {
    low: { background: "#E9F7F0", color: "#1D9C6F" },
    moderate: { background: "#FDF3E4", color: "#C9821A" },
    high: { background: "#FBEAE8", color: "#C0392B" },
    critical: { background: "#FBEAE8", color: "#C0392B" },
  };
  return map[level] || {};
}

const styles = {
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 18, flexWrap: "wrap", gap: 20 },
  riskPill: { fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 999, letterSpacing: "0.04em" },
  badge: { fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999 },
  miniBarTrack: { height: 5, background: "var(--paper)", borderRadius: 4, marginTop: 12, overflow: "hidden" },
  miniBarFill: { height: "100%", borderRadius: 4 },
  list: { margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5, lineHeight: 1.5 },
  disclaimer: { marginTop: 46, fontSize: 12, color: "var(--grey)", borderTop: "1px solid var(--border)", paddingTop: 16, lineHeight: 1.6 },
};
