const { makeToken, safeEqual, sessionCookie } = require('../shared/auth');

const json = (status, body, extraHeaders = {}) => ({
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
  body: JSON.stringify(body),
});

module.exports = async function (context, req) {
  const { DEMO_USERNAME, DEMO_PASSWORD, DEMO_SESSION_SECRET } = process.env;

  if (!DEMO_USERNAME || !DEMO_PASSWORD || !DEMO_SESSION_SECRET) {
    context.log.error('Demo credentials not configured (DEMO_USERNAME/DEMO_PASSWORD/DEMO_SESSION_SECRET).');
    context.res = json(500, { ok: false, error: 'Demo not configured.' });
    return;
  }

  const username = (req.body && req.body.username) || '';
  const password = (req.body && req.body.password) || '';

  // Evaluate both before AND-ing so a wrong username and wrong password take
  // the same path (no early-out timing signal on which field was wrong).
  const userOk = safeEqual(username, DEMO_USERNAME);
  const passOk = safeEqual(password, DEMO_PASSWORD);

  if (!(userOk && passOk)) {
    context.res = json(401, { ok: false, error: 'Invalid username or password.' });
    return;
  }

  context.res = json(200, { ok: true }, { 'Set-Cookie': sessionCookie(makeToken(DEMO_SESSION_SECRET)) });
};
