'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { bcrypt, users, projects, invoices, enquiries, callRequests } = require('./db');
const mailer = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Behind Railway's proxy, trust it so secure cookies work over HTTPS.
app.set('trust proxy', 1);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    name: 'wwf.sid',
    secret: process.env.SESSION_SECRET || 'dev-insecure-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
);

/* --------------------------- helpers --------------------------- */

function publicUser(u) {
  if (!u) return null;
  return { id: u.id, email: u.email, name: u.name, role: u.role };
}
function currentUser(req) {
  if (!req.session.userId) return null;
  return users.findById(req.session.userId);
}
function requireAuth(req, res, next) {
  const u = currentUser(req);
  if (!u) return res.status(401).json({ error: 'Not signed in' });
  req.user = u;
  next();
}
function requireAdmin(req, res, next) {
  const u = currentUser(req);
  if (!u) return res.status(401).json({ error: 'Not signed in' });
  if (u.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  req.user = u;
  next();
}

const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const clampProgress = (n) => Math.max(0, Math.min(100, parseInt(n, 10) || 0));
const cur = (c) => {
  const v = String(c || 'USD').toUpperCase();
  return ['USD', 'GBP', 'EUR'].includes(v) ? v : 'USD';
};

// A client's monthly care fee is "overdue" when their next payment date is in the past,
// or when they have an invoice explicitly marked overdue.
function isOverdue(userId) {
  const p = projects.get(userId);
  const today = new Date().toISOString().slice(0, 10);
  if (p.next_payment_date && p.next_payment_date.slice(0, 10) < today) return true;
  return invoices.listByUser(userId).some((i) => i.status === 'overdue');
}

/* --------------------------- public API --------------------------- */

app.get('/api/config', (req, res) => {
  res.json({ calendlyUrl: process.env.CALENDLY_URL || '' });
});

app.post('/api/contact', (req, res) => {
  const { name = '', email = '', business = '', package: pkg = '', message = '', kind = 'enquiry' } =
    req.body || {};
  if (!String(name).trim() || !isEmail(email)) {
    return res.status(400).json({ error: 'A name and a valid email are required.' });
  }
  enquiries.create({
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    business: String(business).slice(0, 300),
    package: String(pkg).slice(0, 120),
    message: String(message).slice(0, 4000),
    kind: kind === 'meeting' ? 'meeting' : 'enquiry',
  });
  res.json({ ok: true });
});

/* --------------------------- auth --------------------------- */

app.post('/api/auth/register', (req, res) => {
  const { name = '', email = '', password = '' } = req.body || {};
  if (!String(name).trim()) return res.status(400).json({ error: 'Please enter your name.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'Please enter a valid email.' });
  if (String(password).length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  if (users.findByEmail(email))
    return res.status(409).json({ error: 'An account with that email already exists.' });

  const user = users.create({
    email,
    password_hash: bcrypt.hashSync(String(password), 10),
    name: String(name).slice(0, 120),
    role: 'client',
  });
  projects.get(user.id);
  req.session.userId = user.id;
  res.json({ ok: true, user: publicUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email = '', password = '' } = req.body || {};
  const user = users.findByEmail(email);
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }
  req.session.userId = user.id;
  res.json({ ok: true, user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({
    user: publicUser(req.user),
    project: projects.get(req.user.id),
    invoices: invoices.listByUser(req.user.id),
    callRequests: callRequests.listByUser(req.user.id),
  });
});

/* --------------------------- call requests (client) --------------------------- */

app.post('/api/call-requests', requireAuth, async (req, res) => {
  const reason = String((req.body || {}).reason || '').trim();
  const preferred = String((req.body || {}).preferred || '').slice(0, 120);
  if (reason.length < 10) {
    return res.status(400).json({ error: 'Please tell us a bit more about why you\'d like a call (at least 10 characters).' });
  }
  // Rate-limit: one pending request at a time.
  const hasPending = callRequests.listByUser(req.user.id).some((r) => r.status === 'pending');
  if (hasPending) {
    return res.status(409).json({ error: 'You already have a call request pending review. We\'ll be in touch shortly.' });
  }
  const request = callRequests.create({
    user_id: req.user.id,
    reason: reason.slice(0, 2000),
    preferred,
  });
  // Notify the admin (best-effort; never blocks the response on email failure).
  mailer
    .notifyNewCallRequest({
      client: { name: req.user.name, email: req.user.email },
      reason: request.reason,
      preferred: request.preferred,
      dashboardUrl: (process.env.SITE_URL || SITE.baseUrl) + '/admin',
    })
    .catch(() => {});
  res.json({ ok: true, request });
});

/* --------------------------- admin API --------------------------- */

app.get('/api/admin/clients', requireAdmin, (req, res) => {
  const clients = users.listClients().map((c) => ({
    user: publicUser(c),
    created_at: c.created_at,
    project: projects.get(c.id),
    invoices: invoices.listByUser(c.id),
    overdue: isOverdue(c.id),
  }));
  res.json({
    clients,
    summary: {
      total: clients.length,
      overdue: clients.filter((c) => c.overdue).length,
      pendingCalls: callRequests.pendingCount(),
    },
  });
});

// Superadmin: create a client account directly.
app.post('/api/admin/users', requireAdmin, (req, res) => {
  const { name = '', email = '', password = '', package: pkg = '' } = req.body || {};
  if (!String(name).trim()) return res.status(400).json({ error: 'Name is required.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'A valid email is required.' });
  if (String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (users.findByEmail(email)) return res.status(409).json({ error: 'An account with that email already exists.' });

  const user = users.create({
    email,
    password_hash: bcrypt.hashSync(String(password), 10),
    name: String(name).slice(0, 120),
    role: 'client',
  });
  const project = projects.get(user.id);
  if (pkg) projects.update(user.id, { package: String(pkg).slice(0, 120) });
  res.json({ ok: true, user: publicUser(user), project });
});

// Superadmin: change any user's password.
app.put('/api/admin/users/:id/password', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const target = users.findById(id);
  if (!target) return res.status(404).json({ error: 'User not found.' });
  const password = String((req.body || {}).password || '');
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  users.updatePassword(id, bcrypt.hashSync(password, 10));
  res.json({ ok: true });
});

/* --------------------------- call requests (admin) --------------------------- */

app.get('/api/admin/call-requests', requireAdmin, (req, res) => {
  const list = callRequests.listAll().map((r) => {
    const u = users.findById(r.user_id);
    return { ...r, client: u ? { id: u.id, name: u.name, email: u.email } : null };
  });
  res.json({ callRequests: list });
});

app.put('/api/admin/call-requests/:id', requireAdmin, async (req, res) => {
  const request = callRequests.findById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found.' });
  const status = ['approved', 'declined'].includes((req.body || {}).status) ? req.body.status : null;
  if (!status) return res.status(400).json({ error: 'Status must be approved or declined.' });
  const note = String((req.body || {}).note || '').slice(0, 2000);

  callRequests.update(request.id, { status, admin_note: note, decided_at: new Date().toISOString() });
  const client = users.findById(request.user_id);
  if (client) {
    mailer
      .notifyCallDecision({
        client: { name: client.name, email: client.email },
        status,
        note,
        calendlyUrl: process.env.CALENDLY_URL || '',
      })
      .catch(() => {});
  }
  res.json({ ok: true, emailed: mailer.smtpConfigured });
});

app.put('/api/admin/project/:userId', requireAdmin, (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const client = users.findById(userId);
  if (!client || client.role !== 'client') return res.status(404).json({ error: 'Client not found.' });

  const b = req.body || {};
  const project = projects.update(userId, {
    site_name: String(b.site_name || '').slice(0, 200),
    site_url: String(b.site_url || '').slice(0, 300),
    package: String(b.package || '').slice(0, 120),
    status: String(b.status || 'Onboarding').slice(0, 60),
    progress: clampProgress(b.progress),
    stage_note: String(b.stage_note || '').slice(0, 2000),
    monthly_fee: Number(b.monthly_fee) || 0,
    currency: cur(b.currency),
    next_payment_date: String(b.next_payment_date || '').slice(0, 40),
  });
  res.json({ ok: true, project });
});

app.post('/api/admin/invoices', requireAdmin, (req, res) => {
  const b = req.body || {};
  const userId = parseInt(b.user_id, 10);
  const client = users.findById(userId);
  if (!client || client.role !== 'client') return res.status(404).json({ error: 'Client not found.' });

  const row = invoices.create({
    user_id: userId,
    number: String(b.number || '').slice(0, 60),
    description: String(b.description || '').slice(0, 300),
    amount: Number(b.amount) || 0,
    currency: cur(b.currency),
    status: ['paid', 'due', 'overdue'].includes(b.status) ? b.status : 'due',
    issued_date: String(b.issued_date || '').slice(0, 40),
    due_date: String(b.due_date || '').slice(0, 40),
    link: String(b.link || '').slice(0, 500),
  });
  res.json({ ok: true, id: row.id });
});

app.put('/api/admin/invoices/:id', requireAdmin, (req, res) => {
  const inv = invoices.findById(req.params.id);
  if (!inv) return res.status(404).json({ error: 'Invoice not found.' });
  const status = ['paid', 'due', 'overdue'].includes((req.body || {}).status)
    ? req.body.status
    : inv.status;
  invoices.update(inv.id, { status });
  res.json({ ok: true });
});

app.delete('/api/admin/invoices/:id', requireAdmin, (req, res) => {
  invoices.remove(req.params.id);
  res.json({ ok: true });
});

app.get('/api/admin/enquiries', requireAdmin, (req, res) => {
  res.json({ enquiries: enquiries.list(500) });
});

/* --------------------------- marketing pages (server-rendered) --------------------------- */

const pages = require('./views/pages');
const { SITE } = require('./views/data');
const send = (html) => (req, res) => res.type('html').send(html());

app.get('/', send(pages.home));
app.get('/services', send(pages.services));
app.get('/work', send(pages.work));
app.get('/packages', send(pages.packages));
app.get('/process', send(pages.process));
app.get('/faq', send(pages.faq));
app.get('/news', send(pages.newsIndex));
app.get('/news/:slug', (req, res, next) => {
  const html = pages.article(req.params.slug);
  if (!html) return next();
  res.type('html').send(html);
});
app.get('/book', send(pages.book));
app.get('/contact', send(pages.contact));

/* --------------------------- portal pages (static) --------------------------- */

const file = (name) => (req, res) => res.sendFile(path.join(PUBLIC_DIR, name));
app.get('/login', file('login.html'));
app.get('/register', file('register.html'));
app.get('/dashboard', file('dashboard.html'));
app.get('/admin', file('admin.html'));
app.get('/privacy', file('privacy.html'));
app.get('/terms', file('terms.html'));

/* --------------------------- SEO helpers --------------------------- */

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /admin\n\nSitemap: ${SITE.baseUrl}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const urls = ['/', '/services', '/work', '/packages', '/process', '/faq', '/news', '/book', '/contact', '/privacy', '/terms']
    .concat(pages.NEWS.map((n) => '/news/' + n.slug));
  const body = urls
    .map((u) => `  <url><loc>${SITE.baseUrl}${u === '/' ? '/' : u}</loc><changefreq>weekly</changefreq></url>`)
    .join('\n');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
});

app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.status(404).type('html').send(pages.home());
});

app.listen(PORT, () => {
  console.log(`West Web Foundry running on http://localhost:${PORT}`);
});
