# West Web Foundry

Marketing site for West Web Foundry — websites for small & medium businesses (UK & USA).

## Deploy on Railway (via GitHub)

1. Create a new GitHub repo and push this folder:
   ```
   git init
   git add .
   git commit -m "West Web Foundry v1"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/west-web-foundry.git
   git push -u origin main
   ```
2. On Railway: **New Project → Deploy from GitHub repo** → select `west-web-foundry`.
3. Railway auto-detects Node and runs `npm start` (static server on `$PORT`). No variables needed.
4. In the service → **Settings → Networking → Generate Domain**, then add your custom domain (e.g. `westwebfoundry.com`) and point the DNS CNAME as Railway shows.

## Notes

- Contact form currently opens the visitor's email client (mailto). To receive submissions server-side, swap in a Formspree endpoint or a small API later.
- Currency toggle ($/£) is client-side, edit prices in `index.html` via the `data-usd` / `data-gbp` attributes.
