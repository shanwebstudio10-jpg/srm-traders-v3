import { json, err } from './utils.js';

export async function list(env) {
  const { results } = await env.DB.prepare('SELECT * FROM quotations ORDER BY id DESC LIMIT 200').all();
  return json(results.map((q) => ({ ...q, items: JSON.parse(q.items || '[]') })));
}

export async function create(req, env) {
  const b = await req.json();
  if (!b.customer_name || !b.items?.length) return err('Customer name and items required');
  const sub = b.items.reduce((s, i) => s + (+i.qty || 0) * (+i.rate || 0), 0);
  const gst = +b.gst_percent || 0;
  const total = Math.round(sub * (1 + gst / 100) * 100) / 100;
  const quote_no = 'QT' + Date.now().toString().slice(-8);
  const r = await env.DB.prepare('INSERT INTO quotations (quote_no,customer_name,customer_phone,items,gst_percent,total,notes) VALUES (?,?,?,?,?,?,?)')
    .bind(quote_no, b.customer_name, b.customer_phone || '', JSON.stringify(b.items), gst, total, b.notes || '').run();
  return json({ id: r.meta.last_row_id, quote_no, total }, 201);
}

export async function remove(env, id) {
  await env.DB.prepare('DELETE FROM quotations WHERE id=?').bind(id).run();
  return json({ ok: true });
}
