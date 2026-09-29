import { json, err } from './utils.js';

async function hmacHex(secret, data) {
  const e = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', e.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, e.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function list(env) {
  const { results } = await env.DB.prepare(
    `SELECT p.*, o.order_no, c.name AS customer_name FROM payments p
     LEFT JOIN orders o ON o.id=p.order_id LEFT JOIN customers c ON c.id=o.customer_id ORDER BY p.id DESC LIMIT 200`
  ).all();
  return json(results);
}

export async function markPaid(env, id) {
  const p = await env.DB.prepare('SELECT order_id FROM payments WHERE id=?').bind(id).first();
  if (!p) return err('Payment not found', 404);
  await env.DB.batch([
    env.DB.prepare("UPDATE payments SET status='Paid' WHERE id=?").bind(id),
    env.DB.prepare("UPDATE orders SET status='Paid' WHERE id=? AND status IN ('Pending','Confirmed')").bind(p.order_id),
  ]);
  return json({ ok: true });
}

export async function razorpayOrder(req, env) {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) return err('Razorpay is not configured', 503);
  const { order_id } = await req.json();
  const order = await env.DB.prepare('SELECT * FROM orders WHERE id=?').bind(order_id).first();
  if (!order) return err('Order not found', 404);
  const r = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`) },
    body: JSON.stringify({ amount: Math.round(order.total * 100), currency: 'INR', receipt: order.order_no }),
  });
  const rp = await r.json();
  if (!r.ok) return err(rp.error?.description || 'Razorpay error', 502);
  await env.DB.prepare('UPDATE payments SET gateway_order_id=? WHERE order_id=?').bind(rp.id, order_id).run();
  return json({ key: env.RAZORPAY_KEY_ID, razorpay_order_id: rp.id, amount: rp.amount, order_no: order.order_no });
}

export async function razorpayVerify(req, env) {
  const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  const expected = await hmacHex(env.RAZORPAY_KEY_SECRET || '', `${razorpay_order_id}|${razorpay_payment_id}`);
  if (expected !== razorpay_signature) return err('Signature mismatch', 400);
  await env.DB.batch([
    env.DB.prepare("UPDATE payments SET status='Paid', gateway_payment_id=? WHERE order_id=?").bind(razorpay_payment_id, order_id),
    env.DB.prepare("UPDATE orders SET status='Paid' WHERE id=?").bind(order_id),
  ]);
  return json({ ok: true });
}
