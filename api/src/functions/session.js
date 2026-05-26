const { app } = require('@azure/functions');
const { COOKIE_NAME, verifyToken, readCookie } = require('../../shared/auth');

app.http('session', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'session',
  handler: async (request) => {
    const token = readCookie(request.headers.get('cookie'), COOKIE_NAME);
    const authenticated = verifyToken(token, process.env.DEMO_SESSION_SECRET);
    return {
      status: 200,
      jsonBody: { authenticated },
      headers: { 'Cache-Control': 'no-store' },
    };
  },
});
