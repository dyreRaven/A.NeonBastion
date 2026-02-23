(function initNeonBastionMultiplayerUtils(globalObj) {
  if (!globalObj) return;

  function sanitizeRoomCode(rawCode, limit = 16) {
    return String(rawCode || "")
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "")
      .slice(0, Math.max(1, Math.floor(Number(limit) || 16)));
  }

  function normalizeServerUrl(rawUrl) {
    const text = String(rawUrl || "").trim();
    if (!text) return "";
    try {
      const parsed = new URL(text);
      if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") return "";
      parsed.hash = "";
      return parsed.href.replace(/\/+$/, "");
    } catch (_) {
      return "";
    }
  }

  function getDefaultServerUrl(locationLike) {
    const host = locationLike?.hostname || "";
    const isLocalHost = host === "localhost" || host === "127.0.0.1";
    if (!isLocalHost) return "wss://neon-bastion-multiplayer.onrender.com";
    const secure = locationLike?.protocol === "https:";
    return `${secure ? "wss" : "ws"}://${host}:8787`;
  }

  function formatClockTime(rawTime = Date.now()) {
    const date = new Date(rawTime);
    if (!Number.isFinite(date.getTime())) return "--:--";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function sanitizeChatText(rawText, maxLength = 140) {
    return String(rawText || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, Math.max(1, Math.floor(Number(maxLength) || 140)));
  }

  globalObj.NeonBastionMultiplayerUtils = Object.freeze({
    sanitizeRoomCode,
    normalizeServerUrl,
    getDefaultServerUrl,
    formatClockTime,
    sanitizeChatText,
  });
})(typeof window !== "undefined" ? window : globalThis);
