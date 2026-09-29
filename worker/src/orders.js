import { json, err } from './utils.js';
import { getSettings, buildOrderMessage, whatsappUrl } from './whatsapp.js';

export const STATUSES = ['Pending', 'Confirmed', 'Paid', 'Shipped', 'Completed'];

export async function create(req, env) {
  const b = await req.json();
  const { customer, items, payment_method = 'whatsapp', notes = '' } = b;
  if (!customer?.name || !customer?.phone || !items?.length) return err('Name, phone and at least one item are required');

  // customer upsert by phone
  const existing = await env.DB.prepare('SELECT id FROM customers WHERE phone=?').bind(customer.phone).first();
  let cid;
  if (existing) {
    cid = existing.id;
    await env.DB.prepare('UPDATE customers SET name=?,email=?,company=?,address=? WHERE id=?')
      .bind(customer.name, customer.email || '', customer.company || '', customer.address || '', cid).run();
  } else {
    const r = await env.DB.prepare('INSERT INTO customers (name,phone,email,company,address) VALUES (?,?,?,?,?)')
      .bind(customer.name, customer.phone, customer.email || '', customer.company || '', customer.address || '').run();
    cid = r.meta.last_row_id;
  }

  // trust DB price, not browser price
  const clean = [];
  for (const it of items) {
    const p = it.product_id ? await env.DB.prepare('SELECT id,name,price FROM products WHERE id=?').bind(it.product_id).first() : null;
    clean.push({ product_id: p?.id ?? null, name: p?.name ?? it.name, price: p?.price ?? (+it.price || 0), qty: Math.max(1, +it.qty || 1) });
  }
  const total = clean.reduce((s, i) => s + i.price * i.qty, 0);
  const order_no = 'SRM' + Date.now().toString().slice(-8);

  const o = await env.DB.prepare('INSERT INTO orders (order_no,customer_id,total,payment_method,notes) VALUES (?,?,?,?,?)')
    .bind(order_no, cid, total, payment_method, notes).run();
  const oid = o.meta.last_row_id;
  await env.DB.batch([
    ...clean.map((i) => env.DB.prepare('INSERT INTO order_items (order_id,product_id,name,price,qty) VALUES (?,?,?,?,?)').bind(oid, i.product_id, i.name, i.price, i.qty)),
    env.DB.prepare('INSERT INTO payments (order_id,method,amount) VALUES (?,?,?)').bind(oid, payment_method, total),
  ]);

  const settings = await getSettings(env);
  const order = { id: oid, order_no, total, payment_method, notes };
  const whatsapp_url = whatsappUrl(settings, buildOrderMessage(order, clean, customer, settings));
  return json({ ...order, whatsapp_url }, 201);
}

export async function list(env, url) {
  const status = url.searchParams.get('status');
  let sql = `SELECT o.*, c.name AS customer_name, c.phone AS customer_phone FROM orders o LEFT JOIN customers c ON c.id=o.customer_id`;
  const args = [];
  if (status) { sql += ' WHERE o.status=?'; args.push(status); }
  sql += ' ORDER BY o.id DESC LIMIT 200';
  const { results } = await env.DB.prepare(sql).bind(...args).all();
  if (results.length) {
    const ids = results.map((r) => r.id).join(',');
    const { results: items } = await env.DB.prepare(`SELECT * FROM order_items WHERE order_id IN (${ids})`).all();
    results.forEach((o) => (o.items = items.filter((i) => i.order_id === o.id)));
  }
  return json(results);
}

export async function update(req, env, id) {
  const { status } = await req.json();
  if (!STATUSES.includes(status)) return err('Invalid status');
  await env.DB.prepare('UPDATE orders SET status=? WHERE id=?').bind(status, id).run();
  if (status === 'Paid') await env.DB.prepare("UPDATE payments SET status='Paid' WHERE order_id=?").bind(id).run();
  return json({ ok: true });
}
