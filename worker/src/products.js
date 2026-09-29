import { json, err } from './utils.js';

export async function list(env, url, admin = false) {
  const cat = url.searchParams.get('category');
  const q = url.searchParams.get('q');
  let sql = 'SELECT * FROM products WHERE 1=1';
  const args = [];
  if (!admin) sql += ' AND active=1';
  if (cat) { sql += ' AND category=?'; args.push(cat); }
  if (q) { sql += ' AND (name LIKE ? OR description LIKE ?)'; args.push(`%${q}%`, `%${q}%`); }
  sql += ' ORDER BY id DESC';
  const { results } = await env.DB.prepare(sql).bind(...args).all();
  return json(results);
}

export async function get(env, id) {
  const row = await env.DB.prepare('SELECT * FROM products WHERE id=?').bind(id).first();
  return row ? json(row) : err('Product not found', 404);
}

export async function create(req, env) {
  const b = await req.json();
  if (!b.name || !b.category) return err('Name and category required');
  const r = await env.DB.prepare(
    'INSERT INTO products (name,category,price,min_qty,description,image,active) VALUES (?,?,?,?,?,?,?)'
  ).bind(b.name, b.category, +b.price || 0, +b.min_qty || 1, b.description || '', b.image || '', b.active === 0 ? 0 : 1).run();
  return json({ id: r.meta.last_row_id }, 201);
}

export async function update(req, env, id) {
  const b = await req.json();
  await env.DB.prepare(
    'UPDATE products SET name=?,category=?,price=?,min_qty=?,description=?,image=?,active=? WHERE id=?'
  ).bind(b.name, b.category, +b.price || 0, +b.min_qty || 1, b.description || '', b.image || '', b.active === 0 ? 0 : 1, id).run();
  return json({ ok: true });
}

export async function remove(env, id) {
  await env.DB.prepare('DELETE FROM products WHERE id=?').bind(id).run();
  return json({ ok: true });
}
