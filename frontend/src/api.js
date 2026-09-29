import { useEffect, useState } from 'react';

const BASE = import.meta.env.VITE_API_URL || '';

export async function api(path, opts = {}) {
  const r = await fetch(BASE + '/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}

export const CATEGORIES = [
  { slug: 'diary', label: 'New Year Diaries', icon: '📒' },
  { slug: 'calendar', label: 'Calendars', icon: '📅' },
  { slug: 'jute-bag', label: 'Jute Bags', icon: '👜' },
  { slug: 'net-bag', label: 'Net Bags', icon: '🛍️' },
  { slug: 'travel-bag', label: 'Travel Bags', icon: '🧳' },
  { slug: 'files', label: 'Files', icon: '📁' },
  { slug: 'corporate-gifts', label: 'Corporate Gift Items', icon: '🎁' },
  { slug: 'promotional', label: 'Promotional Products', icon: '📣' },
];
export const coverOf = (slug) => `/products/${slug}/cover.jpg`;
export const featuredOf = (slug) => `/products/${slug}/featured.jpg`;
export const catOf = (slug) => CATEGORIES.find((c) => c.slug === slug) || { label: slug, icon: '📦' };

// Shown when the API is not running yet (so the site never looks empty while you set things up)
export const SAMPLE = [
  { id: 1, name: 'Executive Diary 2027', category: 'diary', price: 180, min_qty: 25, description: 'A5 size, 192 pages, PU cover, logo printing available', image: '' },
  { id: 2, name: 'Wall Calendar 2027', category: 'calendar', price: 65, min_qty: 100, description: '6-sheet wall calendar, custom company branding', image: '' },
  { id: 3, name: 'Jute Bag Standard', category: 'jute-bag', price: 95, min_qty: 50, description: 'Laminated jute bag with cotton handles', image: '' },
  { id: 4, name: 'Net Bag Foldable', category: 'net-bag', price: 35, min_qty: 100, description: 'Reusable net shopping bag, pouch fold', image: '' },
  { id: 5, name: 'Travel Bag 20 inch', category: 'travel-bag', price: 450, min_qty: 20, description: 'Water resistant polyester travel bag', image: '' },
  { id: 6, name: 'Office File Folder', category: 'files', price: 28, min_qty: 100, description: 'Printed file folder with your logo', image: '' },
  { id: 7, name: 'Corporate Gift Set', category: 'corporate-gifts', price: 650, min_qty: 20, description: 'Diary, pen and keychain in a gift box', image: '' },
  { id: 8, name: 'Promotional Pen', category: 'promotional', price: 8, min_qty: 500, description: 'Plastic pen with one colour logo print', image: '' },
];

export async function getProducts() {
  try { return await api('/products'); } catch { return SAMPLE; }
}

const DEFAULT_SETTINGS = {
  business_name: 'S.R.M. Traders', tagline: 'Corporate Gifts, Bags & Promotional Products',
  phone: '9444 534 944 / 7845 498 145', landline: '044 - 4005 9601 / 4203 8144', whatsapp: '919444534944',
  email: 'srmtraders1@yahoo.in', upi_id: 'srmtraders@upi',
  address: 'New No. 118, Old No. 66, Walltax Road, Near Moore Market Complex, Chennai - 600001',
};
let settingsPromise;
export function useSettings() {
  const [s, setS] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    settingsPromise ||= api('/settings').catch(() => ({}));
    settingsPromise.then((d) => setS({ ...DEFAULT_SETTINGS, ...d }));
  }, []);
  return s;
}
