import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../cart.jsx';
import Checkout from './Checkout.jsx';

export default function CartDrawer() {
  const { open, setOpen, items, setQty, remove, total } = useCart();
  const [step, setStep] = useState('cart');
  if (!open) return null;
  const close = () => { setOpen(false); setStep('cart'); };
  return (
    <div className="drawer-bg" onClick={close}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-h"><h2>Enquiry cart</h2><button className="x" onClick={close} aria-label="Close">×</button></div>
        {step === 'checkout' ? (
          <Checkout onBack={() => setStep('cart')} />
        ) : items.length === 0 ? (
          <div className="empty"><p>Your cart is empty. Add products to get a bulk price.</p><Link className="btn btn-ink" to="/products" onClick={close}>Browse products</Link></div>
        ) : (
          <>
            <ul className="lines">
              {items.map((i) => (
                <li key={i.id}>
                  <div><b>{i.name}</b><small>₹{i.price} per piece</small></div>
                  <input className="qty" type="number" min="1" value={i.qty} onChange={(e) => setQty(i.id, +e.target.value)} />
                  <span>₹{i.price * i.qty}</span>
                  <button className="x" onClick={() => remove(i.id)} aria-label="Remove">×</button>
                </li>
              ))}
            </ul>
            <div className="drawer-f">
              <p className="tot">Total <b>₹{total}</b></p>
              <button className="btn btn-gold" onClick={() => setStep('checkout')}>Continue</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
