const { COOKIE_NAME, verifyToken, readCookie } = require('../shared/auth');

module.exports = async function (context, req) {
  const token = readCookie(req.headers && req.headers.cookie, COOKIE_NAME);
  const authenticated = verifyToken(token, process.env.DEMO_SESSION_SECRET);
  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ authenticated }),
  };
};
