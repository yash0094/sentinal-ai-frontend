import React from "react";

const RISK_COLOR = {
  low: "#1D9C6F",
  moderate: "#C9821A",
  high: "#C0392B",
  critical: "#C0392B",
};

export default function TrustRing({ score = 0, riskLevel = "moderate", size = 168 }) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = RISK_COLOR[riskLevel] || "#2E6FF2";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E3E7EE" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={styles.center}>
        <div style={{ ...styles.score, color }}>{score}</div>
        <div style={styles.label}>/ 100</div>
      </div>
    </div>
  );
}

const styles = {
  center: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  score: { fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 40, lineHeight: 1 },
  label: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--grey)", marginTop: 2 },
};
