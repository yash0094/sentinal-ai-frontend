import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import ChatWidget from "../components/ChatWidget.jsx";
import { useAuth } from "../services/AuthContext.jsx";
import { api, clearToken } from "../services/api.js";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await api.deleteAccount();
      clearToken();
      logout();
      navigate("/login", { replace: true });
    } catch (e) {
      setError(e.message || "Could not delete your account. Please try again.");
      setDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <NavBar />
      <main className="container" style={{ paddingTop: 48, paddingBottom: 90, maxWidth: 640 }}>
        <p className="eyebrow">SETTINGS</p>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Account</h1>

        <div className="card" style={{ padding: 24, marginTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
          {user.picture && <img src={user.picture} alt="" style={{ width: 52, height: 52, borderRadius: "50%" }} />}
          <div>
            <p style={{ fontWeight: 600 }}>{user.name}</p>
            <p style={{ color: "var(--grey)", fontSize: 13.5 }}>{user.email}</p>
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginTop: 20 }}>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Audit usage</p>
          <p style={{ color: "var(--grey)", fontSize: 13.5 }}>
            {user.scans_used} of {user.max_scans} audits used on this account.
          </p>
          <div style={{ height: 8, background: "var(--paper)", borderRadius: 4, marginTop: 12, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(user.scans_used / user.max_scans) * 100}%`,
              background: user.scans_remaining > 0 ? "var(--blue)" : "var(--red)",
            }} />
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginTop: 20, borderColor: "#F3D3CE" }}>
          <p style={{ fontWeight: 600, color: "var(--red)", marginBottom: 6 }}>Danger zone</p>
          <p style={{ color: "var(--grey)", fontSize: 13.5, lineHeight: 1.6 }}>
            Deleting your account permanently removes your profile and every scan report and chat
            history tied to it. This is the only way to reset your audit limit. This cannot be undone.
          </p>

          {!showConfirm ? (
            <button className="btn btn-danger" style={{ marginTop: 14 }} onClick={() => setShowConfirm(true)}>
              Delete account
            </button>
          ) : (
            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 13, color: "var(--grey)" }}>
                Type <strong>DELETE</strong> to confirm.
              </label>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                style={{ display: "block", marginTop: 8, marginBottom: 12, padding: "10px 12px", border: "1.5px solid var(--border)", borderRadius: 8, width: 220 }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn btn-danger"
                  disabled={confirmText !== "DELETE" || deleting}
                  onClick={handleDelete}
                >
                  {deleting ? "Deleting…" : "Permanently delete"}
                </button>
                <button className="btn btn-outline" onClick={() => { setShowConfirm(false); setConfirmText(""); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          {error && <p style={{ color: "var(--red)", fontSize: 13, marginTop: 10 }}>{error}</p>}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
