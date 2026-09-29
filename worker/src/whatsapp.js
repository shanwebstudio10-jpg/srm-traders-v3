import { json } from './utils.js';

export async function getSettings(env) {
  const { results } = await env.DB.prepare('SELECT key,value FROM settings').all();
  return Object.fromEntries(results.map((r) => [r.key, r.value]));
}

export async function updateSettings(req, env) {
  const b = await req.json();
  const stmts = Object.entries(b).map(([k, v]) =>
    env.DB.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(k, String(v ?? ''))
  );
  if (stmts.length) await env.DB.batch(stmts);
  return json({ ok: true });
}

export function buildOrderMessage(order, items, customer, settings) {
  const lines = items.map((i, n) => `${n + 1}. ${i.name} x ${i.qty} = ₹${i.price * i.qty}`);
  return [
    `*New Enquiry - ${settings.business_name || 'SRM Traders'}*`,
    `Order: ${order.order_no}`,
    '',
    ...lines,
    '',
    `*Total: ₹${order.total}*`,
    `Payment: ${order.payment_method}`,
    '',
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    customer.company ? `Company: ${customer.company}` : '',
    customer.address ? `Address: ${customer.address}` : '',
    order.notes ? `Notes: ${order.notes}` : '',
  ].filter((l) => l !== '' || true).join('\n');
}

export function whatsappUrl(settings, message) {
  return `https://wa.me/${(settings.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
