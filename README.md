# TD-Portal-Demo

Standalone, password-gated public demo of the **ThreatDefender Client Portal**.
Runs entirely on synthetic "Acme Corp" data — no production systems, no real
APIs. Used by Solutions Architects for live sales walkthroughs.

## Stack
- React 19 + Vite + Tailwind (frontend, `src/`)
- Azure Static Web Apps managed Functions (auth gate, `api/`)
- Hosted on SWA `tdportal-demo` (`rg-threatdefender-portal`)
- Custom domain: https://portaldemo.threatdefendermssp.com

## Auth gate
A shared username/password gate. Credentials are validated **server-side** in
`api/login` against app settings — they are never shipped in the client bundle.
On success an HMAC-signed, HttpOnly session cookie is issued (`api/shared/auth.js`),
and `api/session` validates it on load.

Required SWA application settings:
| Setting | Purpose |
|---------|---------|
| `DEMO_USERNAME` | Shared username handed to testers |
| `DEMO_PASSWORD` | Shared password handed to testers |
| `DEMO_SESSION_SECRET` | Random secret used to sign session cookies |

Rotate credentials without a rebuild:
```bash
az staticwebapp appsettings set -n tdportal-demo -g rg-threatdefender-portal \
  --setting-names DEMO_USERNAME=<user> DEMO_PASSWORD=<pass>
```

## Develop locally
```bash
npm install
npm run dev          # frontend on :3000, proxies /api to the SWA Functions host :7071
```

## Deploy
Pushing to `main` triggers the GitHub Action (`.github/workflows/azure-static-web-apps.yml`)
which builds and deploys to the `tdportal-demo` SWA.
