const { app } = require('@azure/functions');
const { clearSessionCookie } = require('../../shared/auth');

app.http('logout', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'logout',
  handler: async () => ({
    status: 200,
    jsonBody: { ok: true },
    headers: {
      'Cache-Control': 'no-store',
      'Set-Cookie': clearSessionCookie(),
    },
  }),
});
