const { app } = require('@azure/functions');
const { COOKIE_NAME, verifyToken, readCookie, scopeForUsername } = require('../../shared/auth');

app.http('session', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'session',
  handler: async (request) => {
    const noStore = { 'Cache-Control': 'no-store' };
    const token = readCookie(request.headers.get('cookie'), COOKIE_NAME);
    const payload = verifyToken(token, process.env.DEMO_SESSION_SECRET);
    if (!payload || !payload.username) {
      return { status: 200, jsonBody: { authenticated: false }, headers: noStore };
    }
    // Re-resolve scope on every check so module/step changes to DEMO_USERS
    // apply on the next request without forcing testers to log back in.
    const scope = scopeForUsername(payload.username);
    if (!scope) {
      return { status: 200, jsonBody: { authenticated: false }, headers: noStore };
    }
    return {
      status: 200,
      jsonBody: {
        authenticated: true,
        username: scope.username,
        modules: scope.modules,
        steps: scope.steps,
      },
      headers: noStore,
    };
  },
});
