const { app } = require('@azure/functions');
const { makeToken, safeEqual, sessionCookie } = require('../../shared/auth');

app.http('login', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'login',
  handler: async (request, context) => {
    const { DEMO_USERNAME, DEMO_PASSWORD, DEMO_SESSION_SECRET } = process.env;

    if (!DEMO_USERNAME || !DEMO_PASSWORD || !DEMO_SESSION_SECRET) {
      context.error('Demo credentials not configured (DEMO_USERNAME/DEMO_PASSWORD/DEMO_SESSION_SECRET).');
      return { status: 500, jsonBody: { ok: false, error: 'Demo not configured.' }, headers: { 'Cache-Control': 'no-store' } };
    }

    let body = {};
    try { body = await request.json(); } catch { body = {}; }

    // Evaluate both before AND-ing so a wrong username and wrong password take
    // the same path (no early-out timing signal on which field was wrong).
    const userOk = safeEqual(body.username || '', DEMO_USERNAME);
    const passOk = safeEqual(body.password || '', DEMO_PASSWORD);

    if (!(userOk && passOk)) {
      return { status: 401, jsonBody: { ok: false, error: 'Invalid username or password.' }, headers: { 'Cache-Control': 'no-store' } };
    }

    return {
      status: 200,
      jsonBody: { ok: true },
      headers: { 'Set-Cookie': sessionCookie(makeToken(DEMO_SESSION_SECRET)), 'Cache-Control': 'no-store' },
    };
  },
});
