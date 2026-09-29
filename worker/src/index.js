import { json, err } from './utils.js';
import { login, isAuthed } from './auth.js';
import * as products from './products.js';
import * as orders from './orders.js';
import * as customers from './customers.js';
import * as payments from './payments.js';
import * as quotations from './quotations.js';
import * as messages from './messages.js';
import { getSettings, updateSettings } from './whatsapp.js';

export default {
  async fetch(req, env) {
    // ALLOWED_ORIGIN can be "*" or a comma separated list: https://srmtraders.in,https://admin.srmtraders.in
    const list = (env.ALLOWED_ORIGIN || '*').split(',').map((x) => x.trim().replace(/\/$/, '')).filter(Boolean);
    const origin = req.headers.get('Origin') || '';
    const allow = list.includes('*') ? '*' : list.includes(origin) || origin.startsWith('http://localhost') ? origin : list[0];
    const cors = {
      'Access-Control-Allow-Origin': allow,
      Vary: 'Origin',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    let res;
    try { res = await route(req, env); } catch (e) { res = err(e.message || 'Server error', 500); }
    const h = new Headers(res.headers);
    Object.entries(cors).forEach(([k, v]) => h.set(k, v));
    return new Response(res.body, { status: res.status, headers: h });
  },
};

async function route(req, env) {
  const url = new URL(req.url);
  const seg = url.pathname.split('/').filter(Boolean);
  const m = req.method;
  if (seg[0] !== 'api') return json({ ok: true, service: 'SRM Traders API' });
  const [, res, id] = seg;

  // ---- public ----
  if (res === 'auth' && id === 'login' && m === 'POST') return require_login(req, env);
  if (res === 'settings' && m === 'GET') return json(await getSettings(env));
  if (res === 'products' && m === 'GET') return id ? products.get(env, id) : products.list(env, url, url.searchParams.get('all') === '1' && (await isAuthed(req, env)));
  if (res === 'messages' && m === 'POST') return messages.create(req, env);
  if (res === 'orders' && m === 'POST' && !id) return orders.create(req, env);
  if (res === 'payments' && id === 'razorpay-order' && m === 'POST') return payments.razorpayOrder(req, env);
  if (res === 'payments' && id === 'razorpay-verify' && m === 'POST') return payments.razorpayVerify(req, env);

  // ---- admin only ----
  if (!(await isAuthed(req, env))) return err('Unauthorized', 401);
  switch (res) {
    case 'stats': return stats(env);
    case 'products':
      if (m === 'POST') return products.create(req, env);
      if (m === 'PUT') return products.update(req, env, id);
      if (m === 'DELETE') return products.remove(env, id);
      break;
    case 'orders':
      if (m === 'GET') return orders.list(env, url);
      if (m === 'PUT') return orders.update(req, env, id);
      break;
    case 'customers': if (m === 'GET') return customers.list(env); break;
    case 'payments':
      if (m === 'GET') return payments.list(env);
      if (m === 'PUT') return payments.markPaid(env, id);
      break;
    case 'quotations':
      if (m === 'GET') return quotations.list(env);
      if (m === 'POST') return quotations.create(req, env);
      if (m === 'DELETE') return quotations.remove(env, id);
      break;
    case 'messages':
      if (m === 'GET') return messages.list(env);
      if (m === 'PUT') return messages.update(req, env, id);
      if (m === 'DELETE') return messages.remove(env, id);
      break;
    case 'settings': if (m === 'PUT') return updateSettings(req, env); break;
  }
  return err('Not found', 404);
}

const require_login = (req, env) => login(req, env);

async function stats(env) {
  const one = async (sql) => (await env.DB.prepare(sql).first())?.n ?? 0;
  return json({
    products: await one('SELECT COUNT(*) n FROM products'),
    enquiries: await one("SELECT COUNT(*) n FROM orders WHERE status='Pending'"),
    orders: await one('SELECT COUNT(*) n FROM orders'),
    messages: await one("SELECT COUNT(*) n FROM messages WHERE status='New'"),
    payments: await one("SELECT COALESCE(SUM(amount),0) n FROM payments WHERE status='Paid'"),
  });
}
