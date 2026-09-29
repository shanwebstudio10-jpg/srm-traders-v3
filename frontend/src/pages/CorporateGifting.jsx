import { useState } from 'react';
import { api, useSettings } from '../api.js';

export default function CorporateGifting() {
  const s = useSettings();
  const [f, setF] = useState({ name: '', company: '', qty: '', budget: '', details: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = (e) => {
    e.preventDefault();
    const msg = `Corporate gifting enquiry\nName: ${f.name}\nCompany: ${f.company}\nQuantity: ${f.qty}\nBudget per piece: ${f.budget}\nDetails: ${f.details}`;
    api('/messages', { method: 'POST', body: { name: f.name, message: msg } }).catch(() => {});
    window.open(`https://wa.me/${s.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };
  return (
    <section className="wrap section two">
      <div>
        <h1>Corporate gifting</h1>
        <p>Festival gifts, joining kits, client gifts and event giveaways. We match your budget, print your logo and deliver on time.</p>
        <ul className="ticks"><li>Gift sets with diary, pen and keychain</li><li>Jute and travel bags with company branding</li><li>Custom quotation with GST invoice</li></ul>
      </div>
      <form className="checkout" onSubmit={send}>
        <h3>Ask for a quotation</h3>
        <input className="input" required placeholder="Your name *" value={f.name} onChange={set('name')} />
        <input className="input" placeholder="Company" value={f.company} onChange={set('company')} />
        <input className="input" required placeholder="Quantity needed *" value={f.qty} onChange={set('qty')} />
        <input className="input" placeholder="Budget per piece (₹)" value={f.budget} onChange={set('budget')} />
        <textarea className="input" rows="3" placeholder="What do you need?" value={f.details} onChange={set('details')} />
        <button className="btn btn-gold">Send on WhatsApp</button>
      </form>
    </section>
  );
}
