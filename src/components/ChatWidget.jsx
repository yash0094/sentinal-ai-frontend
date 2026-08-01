import React, { useEffect, useRef, useState } from "react";
import { api } from "../services/api.js";

export default function ChatWidget({ scanId }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I'm the SentinelAI assistant. Ask me anything about your report or how to use the app." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);
    try {
      console.log("Before API call");
      const res = await api.sendChatMessage(text, scanId);
      console.log("After API call", res);
      setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
    } catch (e) {
        console.error("CHAT ERROR:", e);
        setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry, I couldn't respond just now. Please try again." }
      ]);
    }
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button style={styles.fab} onClick={() => setOpen((o) => !o)} aria-label="Open assistant">
        {open ? "×" : "💬"}
      </button>

      {open && (
        <div style={styles.panel} role="dialog" aria-label="SentinelAI assistant">
          <div style={styles.panelHeader}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>SentinelAI Assistant</span>
          </div>
          <div ref={scrollRef} style={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === "user" ? styles.userBubble : styles.botBubble}>
                {m.text}
              </div>
            ))}
            {sending && <div style={styles.botBubble}>Thinking…</div>}
          </div>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="btn btn-primary" style={{ padding: "10px 16px" }} onClick={send} disabled={sending}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "var(--blue)",
    color: "white",
    border: "none",
    fontSize: 22,
    boxShadow: "0 8px 24px rgba(46,111,242,0.35)",
    zIndex: 50,
  },
  panel: {
    position: "fixed",
    bottom: 92,
    right: 24,
    width: 340,
    maxWidth: "calc(100vw - 48px)",
    height: 440,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 16,
    boxShadow: "0 16px 40px rgba(11,30,61,0.18)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 50,
  },
  panelHeader: {
    padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    background: "var(--ink)",
    color: "white",
  },
  messages: { flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 },
  userBubble: {
    alignSelf: "flex-end",
    background: "var(--blue)",
    color: "white",
    padding: "9px 13px",
    borderRadius: "12px 12px 2px 12px",
    fontSize: 13.5,
    maxWidth: "85%",
  },
  botBubble: {
    alignSelf: "flex-start",
    background: "var(--paper)",
    color: "var(--ink)",
    padding: "9px 13px",
    borderRadius: "12px 12px 12px 2px",
    fontSize: 13.5,
    maxWidth: "85%",
  },
  inputRow: { display: "flex", gap: 8, padding: 10, borderTop: "1px solid var(--border)" },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    fontSize: 13.5,
    fontFamily: "var(--font-body)",
  },
};
