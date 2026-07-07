'use strict';

// Email sending. Uses SMTP when SMTP_HOST is configured; otherwise it logs the
// message to the server console so nothing is silently lost in local/dev.

const nodemailer = require('nodemailer');

const HOST = process.env.SMTP_HOST || '';
const PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const USER = process.env.SMTP_USER || '';
const PASS = process.env.SMTP_PASS || '';
const SECURE = String(process.env.SMTP_SECURE || '') === 'true' || PORT === 465;
const FROM = process.env.MAIL_FROM || `West Web Foundry <${process.env.SMTP_USER || 'no-reply@west-web-foundry.com'}>`;

// Where new call requests / enquiries are sent for review.
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || '';

let transport = null;
if (HOST) {
  transport = nodemailer.createTransport({ host: HOST, port: PORT, secure: SECURE, auth: USER ? { user: USER, pass: PASS } : undefined });
}

async function sendMail({ to, subject, text, html }) {
  if (!to) return { ok: false, reason: 'no-recipient' };
  if (!transport) {
    console.log(`[mail:skipped] to=${to} subject="${subject}" (configure SMTP_* to actually send)`);
    return { ok: false, reason: 'smtp-not-configured' };
  }
  try {
    await transport.sendMail({ from: FROM, to, subject, text, html });
    return { ok: true };
  } catch (e) {
    console.error('[mail:error]', e.message);
    return { ok: false, reason: e.message };
  }
}

function esc(s) {
  return String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}

// Admin gets this when a client requests a call.
async function notifyNewCallRequest({ client, reason, preferred, dashboardUrl }) {
  if (!NOTIFY_EMAIL) return { ok: false, reason: 'no-notify-email' };
  const subject = `New call request from ${client.name || client.email}`;
  const text =
    `A client has requested a call.\n\n` +
    `Client: ${client.name} <${client.email}>\n` +
    (preferred ? `Preferred time: ${preferred}\n` : '') +
    `\nReason:\n${reason}\n\n` +
    `Approve or decline it in the admin panel: ${dashboardUrl}\n`;
  return sendMail({ to: NOTIFY_EMAIL, subject, text, html: `<p>${text.replace(/\n/g, '<br>')}</p>` });
}

// Client gets this when their call request is approved or declined.
async function notifyCallDecision({ client, status, note, calendlyUrl }) {
  const approved = status === 'approved';
  const subject = approved ? 'Your call request is approved ✅' : 'About your call request';
  let text = `Hi ${client.name || 'there'},\n\n`;
  if (approved) {
    text += `Good news — your call request has been approved.\n`;
    if (calendlyUrl) text += `\nPick a time that suits you here:\n${calendlyUrl}\n`;
    if (note) text += `\nA note from your account manager:\n${note}\n`;
  } else {
    text += `Thanks for your request. On this occasion we're not able to schedule a call.\n`;
    if (note) text += `\n${note}\n`;
    text += `\nYou can reply to this email or send another request from your dashboard any time.\n`;
  }
  text += `\n— West Web Foundry`;
  return sendMail({ to: client.email, subject, text, html: `<p>${esc(text).replace(/\n/g, '<br>')}</p>` });
}

module.exports = { sendMail, notifyNewCallRequest, notifyCallDecision, NOTIFY_EMAIL, smtpConfigured: !!transport };
