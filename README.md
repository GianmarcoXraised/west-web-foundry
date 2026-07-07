# West Web Foundry

Marketing site **and client portal** for West Web Foundry — websites for small & medium businesses. Node/Express app, zero native dependencies.

## What's inside

**Public marketing site** (server-rendered, one page per nav item, SEO/AEO/GEO optimised):
Home, Services, Our work, Packages, Process, News (+ articles), FAQ, Book a call, Contact — plus `sitemap.xml`, `robots.txt` and JSON-LD structured data on every page.

**Client portal**

- **Register / login** (`/register`, `/login`) — bcrypt-hashed passwords, cookie sessions.
- **Client dashboard** (`/dashboard`) — project status, live URL, build progress, next payment date, care fee, invoices (USD/GBP/EUR), and a **request-a-call ticket**: the client explains why they'd like a call; you approve or decline and they're emailed the outcome (with the Calendly link when approved).
- **Superadmin panel** (`/admin`) — create client accounts, reset any user's password, see every client with their package and a **fee-overdue** flag, review and decide **call requests**, and read enquiries.

## Run locally

```bash
npm install
cp .env.example .env      # then edit values
npm start                 # http://localhost:3000
```

The first superadmin is created automatically from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Sign in at `/login` → you land on `/admin`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SESSION_SECRET` | Long random string used to sign session cookies. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seeds the superadmin account on first boot. Never commit the real password. |
| `NOTIFY_EMAIL` | Where new call requests and enquiries are emailed. |
| `CALENDLY_URL` | Calendly link for public booking and approved call requests. |
| `SITE_URL` | Public base URL, used in canonical/OG tags and the sitemap. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM` | SMTP for sending call-request emails. Without SMTP, emails are logged to the console instead of sent. |
| `DATABASE_PATH` | Where the JSON database lives. Locally `./data/wwf.db`; on Railway point at a mounted volume. |
| `PORT` | Provided automatically by Railway. |

## Deploy on Railway (via GitHub)

1. On Railway: **New Project → Deploy from GitHub repo** → select `west-web-foundry`. Railway auto-detects Node and runs `npm start`.
2. Under the service → **Variables**, add: `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NOTIFY_EMAIL`, `CALENDLY_URL`, `SITE_URL=https://west-web-foundry.com`, `DATABASE_PATH=/data/wwf.db`, and the `SMTP_*` values from your email provider.
3. Under **Settings → Volumes**, add a volume mounted at `/data` so the database (clients, invoices, call requests) survives redeploys. **Without a volume, all portal data resets on every redeploy.**
4. Under **Settings → Networking → Generate Domain**, then add your custom domain `west-web-foundry.com` and point the DNS as Railway shows.

## Notes

- Call-request emails need working SMTP credentials. Until those are set, requests are still stored and visible in `/admin`, and the intended email is logged to the server console.
- Currency toggle ($/£/€) on the marketing site is client-side. Package prices and copy live in `views/data.js`.
- Marketing pages are server-rendered from `views/` (`data.js`, `layout.js`, `pages.js`).
