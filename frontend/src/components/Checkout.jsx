import { useState } from 'react';
import { useCart } from '../cart.jsx';
import { api, useSettings } from '../api.js';
import PaymentOptions from './PaymentOptions.jsx';

function loadRazorpay() {
  return new Promise((res, rej) => {
    if (window.Razorpay) return res();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = res; s.onerror = () => rej(new Error('Could not load Razorpay'));
    document.body.appendChild(s);
  });
}

export default function Checkout({ onBack }) {
  const { items, total, clear } = useCart();
  const s = useSettings();
  const [f, setF] = useState({ name: '', phone: '', email: '', company: '', address: '', notes: '' });
  const [method, setMethod] = useState('whatsapp');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function payRazorpay(order) {
    await loadRazorpay();
    const rp = await api('/payments/razorpay-order', { method: 'POST', body: { order_id: order.id } });
    new window.Razorpay({
      key: rp.key, amount: rp.amount, currency: 'INR', order_id: rp.razorpay_order_id,
      name: s.business_name, description: order.order_no,
      prefill: { name: f.name, contact: f.phone, email: f.email },
      handler: async (r) => {
        await api('/payments/razorpay-verify', { method: 'POST', body: { ...r, order_id: order.id } });
        setDone(order); clear();
      },
    }).open();
  }

  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: { customer: f, notes: f.notes, payment_method: method, items: items.map((i) => ({ product_id: i.id, name: i.name, price: i.price, qty: i.qty })) },
      });
      if (method === 'razorpay') await payRazorpay(order);
      else {
        if (method === 'whatsapp') window.open(order.whatsapp_url, '_blank');
        setDone({ ...order, method }); clear();
      }
    } catch (ex) { setError(ex.message); } finally { setBusy(false); }
  }

  if (done) {
    const upi = `upi://pay?pa=${encodeURIComponent(s.upi_id)}&pn=${encodeURIComponent(s.business_name)}&am=${done.total}&cu=INR&tn=${done.order_no}`;
    return (
      <div className="done">
        <h3>Thank you. Your order {done.order_no} is received.</h3>
        <p>Total: ₹{done.total}</p>
        {done.method === 'upi' && (
          <>
            <img className="qr" src="/payment/upi-qr.png" alt="UPI QR code" />
            <p>UPI ID: <b>{s.upi_id}</b></p>
            <a className="btn btn-gold" href={upi}>Open UPI app</a>
            <p><a href={done.whatsapp_url} target="_blank" rel="noreferrer">Send payment screenshot on WhatsApp</a></p>
          </>
        )}
        {done.method === 'whatsapp' && <p>If WhatsApp did not open, <a href={done.whatsapp_url} target="_blank" rel="noreferrer">tap here to send your enquiry</a>.</p>}
        {done.method === 'razorpay' && <p>Payment received. We will confirm your order shortly.</p>}
        <button className="btn btn-ink" onClick={onBack}>Close</button>
      </div>
    );
  }

  return (
    <form className="checkout" onSubmit={submit}>
      <button type="button" className="link" onClick={onBack}>Back to cart</button>
      <h3>Your details</h3>
      <input className="input" required placeholder="Full name *" value={f.name} onChange={set('name')} />
      <input className="input" required placeholder="Phone number *" inputMode="tel" value={f.phone} onChange={set('phone')} />
      <input className="input" type="email" placeholder="Email" value={f.email} onChange={set('email')} />
      <input className="input" placeholder="Company name" value={f.company} onChange={set('company')} />
      <textarea className="input" rows="2" placeholder="Delivery address" value={f.address} onChange={set('address')} />
      <textarea className="input" rows="2" placeholder="Logo, colour or other notes" value={f.notes} onChange={set('notes')} />
      <PaymentOptions value={method} onChange={setMethod} />
      {error && <p className="err">{error}</p>}
      <button className="btn btn-gold" disabled={busy}>{busy ? 'Please wait...' : `Place order · ₹${total}`}</button>
    </form>
  );
}
