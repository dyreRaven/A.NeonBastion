(function initNeonBastionCloudUtils(globalObj) {
  if (!globalObj) return;

  function clampMaxLength(value, fallback) {
    return Math.max(1, Math.floor(Number(value) || fallback));
  }

  function sanitizeAccountName(name, maxLength = 24) {
    return String(name || "")
      .replace(/[^\w\s@.+-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, clampMaxLength(maxLength, 24));
  }

  function sanitizeAccountUsername(username, maxLength = 64) {
    return sanitizeAccountName(username, maxLength).replace(/\s+/g, "");
  }

  function isEmailAddress(value, maxLength = 64) {
    const normalized = sanitizeAccountUsername(value, maxLength);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  }

  function deriveAccountDisplayNameFromEmail(email, displayNameMaxLength = 24, usernameMaxLength = 64) {
    const normalizedEmail = sanitizeAccountUsername(email, usernameMaxLength);
    if (!isEmailAddress(normalizedEmail, usernameMaxLength)) return "";
    const localPart = normalizedEmail.split("@")[0] || "";
    const prettyLocal = localPart.replace(/[._+-]+/g, " ");
    return sanitizeAccountName(prettyLocal, displayNameMaxLength);
  }

  function getLegacyAccountUsernameKey(username, usernameMaxLength = 64) {
    return sanitizeAccountUsername(username, usernameMaxLength).toLowerCase();
  }

  function getAccountUsernameKey(username, usernameMaxLength = 64) {
    const normalized = getLegacyAccountUsernameKey(username, usernameMaxLength);
    if (!normalized) return "";
    const gmailMatch = normalized.match(/^([^@]+)@(gmail\.com|googlemail\.com)$/);
    if (!gmailMatch) return normalized;
    const dottedLocal = gmailMatch[1];
    const localWithoutDots = dottedLocal.replace(/\./g, "");
    const plusIndex = localWithoutDots.indexOf("+");
    const baseLocal = plusIndex >= 0 ? localWithoutDots.slice(0, plusIndex) : localWithoutDots;
    const canonicalLocal = baseLocal || localWithoutDots;
    if (!canonicalLocal) return normalized;
    return `${canonicalLocal}@gmail.com`;
  }

  function hashAccountPassword(username, password, legacyMode = false, usernameMaxLength = 64) {
    const usernameKey = legacyMode
      ? getLegacyAccountUsernameKey(username, usernameMaxLength)
      : getAccountUsernameKey(username, usernameMaxLength);
    const source = `${usernameKey}::${String(password || "")}`;
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  function normalizeStoredPasswordHash(rawHash) {
    const hash = String(rawHash || "").trim().toLowerCase();
    if (!/^[a-f0-9]{8,128}$/.test(hash)) return "";
    return hash;
  }

  function normalizePersistedCloudAuthSession(rawSession, usernameMaxLength = 64) {
    if (!rawSession || typeof rawSession !== "object") return null;
    const accessToken = String(rawSession.accessToken || rawSession.access_token || "").trim();
    const refreshToken = String(rawSession.refreshToken || rawSession.refresh_token || "").trim();
    if (!accessToken || !refreshToken) return null;
    const expiresAtRaw = Number(rawSession.expiresAt ?? rawSession.expires_at);
    const savedAtRaw = Number(rawSession.savedAt ?? rawSession.saved_at);
    const userId = String(rawSession.userId || rawSession.user_id || "").trim();
    const email = sanitizeAccountUsername(rawSession.email || "", usernameMaxLength);
    return {
      accessToken,
      refreshToken,
      expiresAt: Number.isFinite(expiresAtRaw) ? Math.max(0, Math.floor(expiresAtRaw)) : 0,
      savedAt: Number.isFinite(savedAtRaw) ? Math.max(0, Math.floor(savedAtRaw)) : Date.now(),
      userId,
      email,
    };
  }

  function extractPersistedCloudAuthSessionFromStorageString(rawValue, usernameMaxLength = 64) {
    if (typeof rawValue !== "string" || !rawValue.trim()) return null;
    try {
      const parsed = JSON.parse(rawValue);
      if (!parsed || typeof parsed !== "object") return null;
      const candidate = parsed.currentSession || parsed.session || parsed.data?.session || parsed;
      return normalizePersistedCloudAuthSession(candidate, usernameMaxLength);
    } catch (_) {
      return null;
    }
  }

  function resolveCloudUserEmail(user, fallback = "", usernameMaxLength = 64) {
    const candidates = [
      user?.email,
      user?.user_metadata?.email,
      user?.identities?.[0]?.identity_data?.email,
      fallback,
    ];
    for (const candidate of candidates) {
      const normalized = sanitizeAccountUsername(candidate || "", usernameMaxLength);
      if (isEmailAddress(normalized, usernameMaxLength)) return normalized;
    }
    return "";
  }

  globalObj.NeonBastionCloudUtils = Object.freeze({
    sanitizeAccountName,
    sanitizeAccountUsername,
    isEmailAddress,
    deriveAccountDisplayNameFromEmail,
    getLegacyAccountUsernameKey,
    getAccountUsernameKey,
    hashAccountPassword,
    normalizeStoredPasswordHash,
    normalizePersistedCloudAuthSession,
    extractPersistedCloudAuthSessionFromStorageString,
    resolveCloudUserEmail,
  });
})(typeof window !== "undefined" ? window : globalThis);
