const { app } = require('@azure/functions');
const { makeToken, safeEqual, sessionCookie, getDemoUsers } = require('../../shared/auth');

const noStore = { 'Cache-Control': 'no-store' };

app.http('login', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'login',
  handler: async (request, context) => {
    const { DEMO_USERS, DEMO_USERNAME, DEMO_PASSWORD, DEMO_SESSION_SECRET } = process.env;

    if (!DEMO_SESSION_SECRET || (!DEMO_USERS && (!DEMO_USERNAME || !DEMO_PASSWORD))) {
      context.error('Demo not configured: need DEMO_SESSION_SECRET plus either DEMO_USERS or DEMO_USERNAME+DEMO_PASSWORD.');
      return { status: 500, jsonBody: { ok: false, error: 'Demo not configured.' }, headers: noStore };
    }

    let body = {};
    try { body = await request.json(); } catch { body = {}; }
    const username = body.username || '';
    const password = body.password || '';

    // Try DEMO_USERS first; fall back to the legacy single-user envs so the
    // deploy stays functional even if DEMO_USERS hasn't been set yet.
    let matchedUsername = null;
    const users = getDemoUsers();
    if (users) {
      const candidate = users.find((u) => u && u.username === username);
      if (candidate && typeof candidate.password === 'string' && safeEqual(password, candidate.password)) {
        matchedUsername = candidate.username;
      }
    }
    if (!matchedUsername && DEMO_USERNAME && DEMO_PASSWORD) {
      const userOk = safeEqual(username, DEMO_USERNAME);
      const passOk = safeEqual(password, DEMO_PASSWORD);
      if (userOk && passOk) matchedUsername = DEMO_USERNAME;
    }

    if (!matchedUsername) {
      return { status: 401, jsonBody: { ok: false, error: 'Invalid username or password.' }, headers: noStore };
    }

    const token = makeToken(DEMO_SESSION_SECRET, { username: matchedUsername });
    return {
      status: 200,
      jsonBody: { ok: true },
      headers: { ...noStore, 'Set-Cookie': sessionCookie(token) },
    };
  },
});
