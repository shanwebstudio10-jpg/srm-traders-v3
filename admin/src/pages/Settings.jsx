import { useEffect, useState } from 'react';
import { api } from '../api.js';

const FIELDS = [
  ['business_name', 'Business name'], ['phone', 'Phone'], ['whatsapp', 'WhatsApp number with country code (91XXXXXXXXXX)'],
  ['email', 'Email'], ['upi_id', 'UPI ID'], ['address', 'Address'], ['gst_percent', 'Default GST %'],
];

export default function Settings() {
  const [f, setF] = useState({});
  const [msg, setMsg] = useState('');
  useEffect(() => { api('/settings').then(setF); }, []);
  async function save(e) {
    e.preventDefault(); setMsg('');
    await api('/settings', { method: 'PUT', body: f }); setMsg('Settings saved.');
  }
  return (
    <form className="form" onSubmit={save}>
      <h1>Settings</h1>
      {FIELDS.map(([k, l]) => <label key={k}>{l}<input value={f[k] || ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>)}
      {msg && <p className="ok">{msg}</p>}
      <button className="btn">Save settings</button>
    </form>
  );
}
