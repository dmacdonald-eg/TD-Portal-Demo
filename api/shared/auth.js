const crypto = require('crypto');

const COOKIE_NAME = 'demo_session';
const TTL_SECONDS = 60 * 60 * 8; // 8 hours

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

function makeToken(secret) {
  const payload = { exp: Date.now() + TTL_SECONDS * 1000 };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${payloadB64}.${sign(payloadB64, secret)}`;
}

function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return false;
  if (!safeEqual(sig, sign(payloadB64, secret))) return false;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    return Boolean(payload.exp) && Date.now() < payload.exp;
  } catch {
    return false;
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

module.exports = { COOKIE_NAME, TTL_SECONDS, sign, safeEqual, makeToken, verifyToken, readCookie, sessionCookie };
