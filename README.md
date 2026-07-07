# West Web Foundry

Marketing site **and client portal** for West Web Foundry — websites for small & medium businesses (UK & USA).

Node/Express app. Serves the public marketing site plus:

- **Contact form** — saved server-side (`/api/contact`), viewable in the admin panel.
- **Book a meeting** — Calendly section on the homepage and in the portal (set `CALENDLY_URL`).
- **Client login** (`/login`, `/register`) — clients register and sign in.
- **Client dashboard** (`/dashboard`) — project status, live URL, build progress, next payment date, care fee and invoices.
- **Admin panel** (`/admin`) — manage each client's project, progress, payment dates and invoices, and read incoming enquiries/meeting requests.

## Run locally

```bash
npm install
cp .env.example .env      # then edit values
npm start                 # http://localhost:3000
```

The first admin account is created automatically from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your env. Sign in at `/login`, you'll land on `/admin`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SESSION_SECRET` | Long random string used to sign session cookies. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seeds the first admin account on first boot. |
| `CALENDLY_URL` | Your Calendly scheduling link. Until set, "Book a meeting" falls back to the contact form. |
| `DATABASE_PATH` | Where the SQLite file lives. Locally `./data/wwf.db`; on Railway point at a mounted volume. |
| `PORT` | Provided automatically by Railway. |

## Deploy on Railway (via GitHub)

1. Push this repo to GitHub (already done for the WWF repo).
2. On Railway: **New Project → Deploy from GitHub repo** → select `west-web-foundry`.
3. Railway auto-detects Node and runs `npm start`.
4. Under the service → **Variables**, add: `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CALENDLY_URL` and `DATABASE_PATH=/data/wwf.db`.
5. Under **Settings → Volumes**, add a volume mounted at `/data` so the database (clients, invoices) survives redeploys. **Without a volume, all portal data resets on every redeploy.**
6. Under **Settings → Networking → Generate Domain**, then add your custom domain (e.g. `westwebfoundry.com`) and point the DNS CNAME as Railway shows.

## Notes

- Passwords are hashed with bcrypt; sessions are cookie-based.
- Currency toggle ($/£) on the marketing page is client-side; edit prices in `public/index.html` via the `data-usd` / `data-gbp` attributes.
- To receive enquiry emails (in addition to storing them), wire an email provider into `POST /api/contact` in `server.js`.
