import { useState } from 'react';
import { api, useSettings } from '../api.js';

export default function Contact() {
  const s = useSettings();
  const wa = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}`;
  const tel = 'tel:+91' + s.phone.split('/')[0].replace(/\D/g, '');
  const [f, setF] = useState({ name: '', phone: '', email: '', message: '' });
  const [state, setState] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function send(e) {
    e.preventDefault(); setState('sending');
    try { await api('/messages', { method: 'POST', body: f }); setState('sent'); setF({ name: '', phone: '', email: '', message: '' }); }
    catch { setState('error'); }
  }
  return (
    <section className="wrap section two">
      <div>
        <h1>Contact us</h1>
        <p><b>Phone:</b> <a href={tel}>{s.phone}</a></p>
        <p><b>Landline:</b> {s.landline}</p>
        <p><b>Email:</b> <a href={`mailto:${s.email}`}>{s.email}</a></p>
        <p><b>Address:</b> {s.address}</p>
        <a className="btn btn-green" href={wa} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
      </div>
      <form className="checkout" onSubmit={send}>
        <h3>Send us a message</h3>
        <input className="input" required placeholder="Your name *" value={f.name} onChange={set('name')} />
        <input className="input" placeholder="Phone number" inputMode="tel" value={f.phone} onChange={set('phone')} />
        <input className="input" type="email" placeholder="Email" value={f.email} onChange={set('email')} />
        <textarea className="input" required rows="4" placeholder="What do you need? (product, quantity, logo)" value={f.message} onChange={set('message')} />
        {state === 'sent' && <p style={{ color: '#12a150', fontWeight: 600 }}>Thank you. We will call you soon.</p>}
        {state === 'error' && <p className="err">Could not send. Please use WhatsApp.</p>}
        <button className="btn btn-navy" disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : 'Send message'}</button>
      </form>
    </section>
  );
}
