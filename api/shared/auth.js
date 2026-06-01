const crypto = require('crypto');

const COOKIE_NAME = 'demo_session';
const TTL_SECONDS = 60 * 60 * 8; // 8 hours

// Modules a user can be granted. Mirrors the module ids tagged on each step
// in src/environmentDemo/tour.jsx and on each entry in NAV_ITEMS.
const ALL_MODULES = ['dashboard','incidents','tickets','health','mail','identity','threat-intel','reports','tools'];

function sign(payloadB64, secret) {
  return crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
}

// Constant-time compare that won't throw on length mismatch.
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// `extra` lets the caller embed identity (e.g. { username }) so /api/session
// can look up the user's modules/steps without round-tripping the bigger
// scope through the cookie.
function makeToken(secret, extra = {}) {
  const payload = { exp: Date.now() + TTL_SECONDS * 1000, ...extra };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${payloadB64}.${sign(payloadB64, secret)}`;
}

// Returns the decoded payload if the signature and expiry are valid, else null.
function verifyToken(token, secret) {
  if (!token || !secret) return null;
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return null;
  if (!safeEqual(sig, sign(payloadB64, secret))) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

function sessionCookie(token) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${TTL_SECONDS}`;
}

// Parse the DEMO_USERS app setting (JSON array). Returns null if missing or
// malformed so callers can fall back to the legacy single-user envs.
function getDemoUsers() {
  const raw = process.env.DEMO_USERS;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// Username is treated as non-secret; constant-time isn't required for the
// lookup. Returns the user record or null. Strips the password before
// returning so callers can't leak it accidentally.
function findUserSafe(users, username) {
  if (!users || !username) return null;
  const u = users.find((entry) => entry && entry.username === username);
  if (!u) return null;
  const { password: _pw, ...safe } = u;
  return safe;
}

// Returns the scope for a known username. For DEMO_USERS entries, reads the
// record's modules/steps (defaulting if unspecified). For the legacy fallback
// user (DEMO_USERNAME), grants everything.
function scopeForUsername(username) {
  const users = getDemoUsers();
  const record = findUserSafe(users, username);
  if (record) {
    return {
      username: record.username,
      modules: Array.isArray(record.modules) && record.modules.length ? record.modules : ALL_MODULES,
      steps: record.steps || 'all',
    };
  }
  if (process.env.DEMO_USERNAME && username === process.env.DEMO_USERNAME) {
    return { username, modules: ALL_MODULES, steps: 'all' };
  }
  return null;
}

module.exports = {
  COOKIE_NAME,
  TTL_SECONDS,
  ALL_MODULES,
  sign,
  safeEqual,
  makeToken,
  verifyToken,
  readCookie,
  sessionCookie,
  getDemoUsers,
  findUserSafe,
  scopeForUsername,
};
