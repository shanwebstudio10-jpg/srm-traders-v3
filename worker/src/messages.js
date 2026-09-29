import { json, err } from './utils.js';

export async function create(req, env) {
  const b = await req.json();
  if (!b.name || !b.message) return err('Name and message are required');
  await env.DB.prepare('INSERT INTO messages (name,phone,email,message) VALUES (?,?,?,?)')
    .bind(String(b.name).slice(0, 100), String(b.phone || '').slice(0, 30), String(b.email || '').slice(0, 100), String(b.message).slice(0, 2000)).run();
  return json({ ok: true }, 201);
}

export async function list(env) {
  const { results } = await env.DB.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 300').all();
  return json(results);
}

export async function update(req, env, id) {
  const { status } = await req.json();
  if (!['New', 'Contacted', 'Done'].includes(status)) return err('Invalid status');
  await env.DB.prepare('UPDATE messages SET status=? WHERE id=?').bind(status, id).run();
  return json({ ok: true });
}

export async function remove(env, id) {
  await env.DB.prepare('DELETE FROM messages WHERE id=?').bind(id).run();
  return json({ ok: true });
}
