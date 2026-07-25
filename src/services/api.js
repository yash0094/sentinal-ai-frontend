const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("sentinelai_token");
}

export function setToken(token) {
  localStorage.setItem("sentinelai_token", token);
}

export function clearToken() {
  localStorage.removeItem("sentinelai_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let detail = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch (_) {}
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res;
}

export const api = {
  googleLoginUrl: () => `${API_BASE}/api/auth/google/login`,
  me: () => request("/api/auth/me"),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  deleteAccount: () => request("/api/auth/account", { method: "DELETE" }),

  runScan: (url, consentActiveTesting) =>
    request("/api/scan", {
      method: "POST",
      body: JSON.stringify({ url, consent_active_testing: consentActiveTesting }),
    }),
  getHistory: () => request("/api/scan/history"),
  getScan: (id) => request(`/api/scan/${id}`),
  downloadPdfUrl: (id) => `${API_BASE}/api/scan/${id}/pdf`,

  sendChatMessage: (message, scanId) =>
    request("/api/chat", { method: "POST", body: JSON.stringify({ message, scan_id: scanId || null }) }),
};

export async function downloadScanPdf(id) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/scan/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Could not download the report.");
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sentinelai-report-${id.slice(0, 8)}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
