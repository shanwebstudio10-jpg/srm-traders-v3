import { json, err } from './utils.js';
const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => atob(s.replace(/-/g, '+').replace(/_/g, '/'));

async function sign(data, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64u(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export async function login(req, env) {
  const { username, password } = await req.json();
  if (!env.ADMIN_PASSWORD || !env.JWT_SECRET) return err('Server secrets not configured', 500);
  if (username !== (env.ADMIN_USER || 'admin') || password !== env.ADMIN_PASSWORD) return err('Wrong username or password', 401);
  const body = b64u(enc.encode(JSON.stringify({ sub: username, exp: Date.now() + 7 * 24 * 3600 * 1000 })));
  return json({ token: body + '.' + (await sign(body, env.JWT_SECRET)) });
}

export async function isAuthed(req, env) {
  try {
    const token = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const [body, sig] = token.split('.');
    if (!body || !sig || (await sign(body, env.JWT_SECRET)) !== sig) return false;
    return JSON.parse(unb64u(body)).exp > Date.now();
  } catch { return false; }
}
