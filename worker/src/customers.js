import { json } from './utils.js';

export async function list(env) {
  const { results } = await env.DB.prepare(
    `SELECT c.*, COUNT(o.id) AS orders, COALESCE(SUM(o.total),0) AS spent
     FROM customers c LEFT JOIN orders o ON o.customer_id=c.id GROUP BY c.id ORDER BY c.id DESC`
  ).all();
  return json(results);
}
