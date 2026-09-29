const BASE = import.meta.env.VITE_API_URL || '';
export const TOKEN_KEY = 'srm_admin_token';
export const STATUSES = ['Pending', 'Confirmed', 'Paid', 'Shipped', 'Completed'];
export const CATEGORIES = [
  ['diary', 'Diaries'], ['calendar', 'Calendars'], ['jute-bag', 'Jute Bags'], ['net-bag', 'Net Bags'],
  ['travel-bag', 'Travel Bags'], ['files', 'Files'], ['corporate-gifts', 'Corporate Gifts'], ['promotional', 'Promotional Items'],
];

export async function api(path, opts = {}) {
  const r = await fetch(BASE + '/api' + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (localStorage.getItem(TOKEN_KEY) || '') },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== '/auth/login') { localStorage.removeItem(TOKEN_KEY); location.reload(); }
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}
export function downloadCsv(name, rows) {
  const esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const csv = '\ufeff' + rows.map((r) => r.map(esc).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = name; a.click();
}
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
export const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
