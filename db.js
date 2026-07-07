'use strict';

// Tiny zero-dependency JSON datastore. No native modules — installs and runs
// anywhere Node runs, including Railway with no build toolchain. For production
// persistence on Railway, point DATABASE_PATH at a mounted volume so the file survives redeploys.

const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DATABASE_PATH
  ? (process.env.DATABASE_PATH.endsWith('.json')
      ? process.env.DATABASE_PATH
      : process.env.DATABASE_PATH.replace(/\.db$/, '') + '.json')
  : path.join(__dirname, 'data', 'wwf.json');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const empty = { users: [], projects: [], invoices: [], enquiries: [], seq: 0 };
let data;

function read() {
  try {
    data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    for (const k of Object.keys(empty)) if (!(k in data)) data[k] = empty[k];
  } catch {
    data = JSON.parse(JSON.stringify(empty));
  }
}
function write() {
  const tmp = DB_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_PATH);
}
function nextId() {
  data.seq += 1;
  return data.seq;
}
const now = () => new Date().toISOString();

read();

/* ------------------------- users ------------------------- */
const users = {
  findByEmail: (email) => data.users.find((u) => u.email === String(email).toLowerCase()) || null,
  findById: (id) => data.users.find((u) => u.id === Number(id)) || null,
  listClients: () =>
    data.users.filter((u) => u.role === 'client').sort((a, b) => b.id - a.id),
  create: ({ email, password_hash, name, role = 'client' }) => {
    const u = {
      id: nextId(),
      email: String(email).toLowerCase(),
      password_hash,
      name: name || '',
      role,
      created_at: now(),
    };
    data.users.push(u);
    write();
    return u;
  },
  setRole: (id, role) => {
    const u = users.findById(id);
    if (u) { u.role = role; write(); }
  },
};

/* ------------------------- projects ------------------------- */
const defaultProject = (userId) => ({
  id: nextId(),
  user_id: userId,
  site_name: '',
  site_url: '',
  package: '',
  status: 'Onboarding',
  progress: 0,
  stage_note: '',
  monthly_fee: 0,
  currency: 'USD',
  next_payment_date: '',
  updated_at: now(),
});

const projects = {
  get: (userId) => {
    let p = data.projects.find((x) => x.user_id === Number(userId));
    if (!p) {
      p = defaultProject(Number(userId));
      data.projects.push(p);
      write();
    }
    return p;
  },
  update: (userId, fields) => {
    const p = projects.get(userId);
    Object.assign(p, fields, { updated_at: now() });
    write();
    return p;
  },
};

/* ------------------------- invoices ------------------------- */
const invoices = {
  listByUser: (userId) =>
    data.invoices
      .filter((i) => i.user_id === Number(userId))
      .sort((a, b) => (b.issued_date || '').localeCompare(a.issued_date || '') || b.id - a.id),
  findById: (id) => data.invoices.find((i) => i.id === Number(id)) || null,
  create: (inv) => {
    const row = { id: nextId(), created_at: now(), ...inv };
    data.invoices.push(row);
    write();
    return row;
  },
  update: (id, fields) => {
    const row = invoices.findById(id);
    if (row) { Object.assign(row, fields); write(); }
    return row;
  },
  remove: (id) => {
    data.invoices = data.invoices.filter((i) => i.id !== Number(id));
    write();
  },
};

/* ------------------------- enquiries ------------------------- */
const enquiries = {
  create: (e) => {
    const row = { id: nextId(), created_at: now(), ...e };
    data.enquiries.push(row);
    write();
    return row;
  },
  list: (limit = 500) =>
    [...data.enquiries].sort((a, b) => b.id - a.id).slice(0, limit),
};

/* ------------------------- seed admin ------------------------- */
function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = process.env.ADMIN_NAME || 'Admin';
  if (!email || !password) return;

  const existing = users.findByEmail(email);
  if (existing) {
    if (existing.role !== 'admin') users.setRole(existing.id, 'admin');
    return;
  }
  users.create({ email, password_hash: bcrypt.hashSync(password, 10), name, role: 'admin' });
  console.log(`[db] Seeded admin account: ${email}`);
}
seedAdmin();

module.exports = { bcrypt, DB_PATH, users, projects, invoices, enquiries };
