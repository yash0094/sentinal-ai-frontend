import React from "react";
import NavBar from "../components/NavBar.jsx";
import ChatWidget from "../components/ChatWidget.jsx";

const STEPS = [
  { title: "1. Sign in", body: "Sign in with a verified Google account. No manual email entry is accepted, which keeps every account tied to a real identity." },
  { title: "2. Enter a URL", body: "On the Dashboard, paste the URL of the AI agent, chatbot, or AI product you want to check — e.g. an AI travel planner or AI coding assistant." },
  { title: "3. (Optional) Authorise active testing", body: "Tick the consent box only if you own or are authorised to test that specific site. This unlocks deeper behavioural checks; passive checks always run regardless." },
  { title: "4. Run the audit", body: "SentinelAI scans infrastructure security, verifies the company behind the service, reads and analyses the privacy policy, checks requested permissions, probes agent behaviour, and attempts to fingerprint the underlying AI model." },
  { title: "5. Read the report", body: "You'll get an overall trust score out of 100, a risk level, a layer-by-layer breakdown, red flags with plain-language explanations, and a clear list of what's safe vs unsafe to share." },
  { title: "6. Download or revisit", body: "Download the report as a PDF, or find it later in History. Every account gets 10 audits; deleting your account is the only way to reset that limit." },
];

const LAYERS = [
  ["Website & Infrastructure Scan", "HTTPS, SSL certificate validity, security headers, domain age."],
  ["Company Verification", "Looks for a real, identifiable owner: privacy policy, terms, contact info, LinkedIn/GitHub."],
  ["Privacy Policy Analysis", "Claude reads the privacy policy and extracts what data is collected, whether it trains on your data, and whether you can delete it."],
  ["Permission Analysis", "Flags integrations (Google Drive, Gmail, GitHub, banking, etc.) that could request risky account access."],
  ["Agent Behavior Testing", "Checks whether a chat interface exists and, if authorised, notes it for deeper review."],
  ["Prompt Injection Resistance", "Reports whether automated resistance testing was possible for this target."],
  ["AI Fingerprinting", "Best-effort guess at the underlying model (GPT, Claude, Gemini, etc.) from public page content."],
];

export default function Help() {
  return (
    <div>
      <NavBar />
      <main className="container" style={{ paddingTop: 48, paddingBottom: 90, maxWidth: 760 }}>
        <p className="eyebrow">MANUAL</p>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>How SentinelAI works</h1>
        <p style={{ color: "var(--grey)", marginTop: 10, lineHeight: 1.6 }}>
          SentinelAI is a trust layer for AI agents. Instead of scanning files like a traditional
          antivirus tool, it scans AI products themselves — so you know what you're sharing your
          data with before you share it.
        </p>

        <h2 style={{ fontSize: 18, marginTop: 36, marginBottom: 16 }}>Using the app</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {STEPS.map((s) => (
            <div key={s.title} className="card" style={{ padding: "16px 18px" }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{s.title}</p>
              <p style={{ fontSize: 13.5, color: "var(--grey)", lineHeight: 1.6 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 18, marginTop: 36, marginBottom: 16 }}>What each layer checks</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LAYERS.map(([name, desc]) => (
            <div key={name} style={{ display: "flex", gap: 14 }}>
              <div style={{ minWidth: 220, fontWeight: 600, fontSize: 13.5 }}>{name}</div>
              <div style={{ fontSize: 13.5, color: "var(--grey)", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 18, marginTop: 36, marginBottom: 10 }}>Important limits</h2>
        <ul style={{ paddingLeft: 20, fontSize: 13.5, color: "var(--grey)", lineHeight: 1.8 }}>
          <li>A trust score is an evidence-based risk assessment, not a guarantee of safety.</li>
          <li>Checks marked "Not Tested" mean the evidence wasn't available — treat that as unknown, not safe.</li>
          <li>SentinelAI never runs active prompt-injection probes against a site without your explicit authorisation.</li>
          <li>Every account gets 10 audits. Deleting your account is the only way to reset that count.</li>
        </ul>
      </main>
      <ChatWidget />
    </div>
  );
}
