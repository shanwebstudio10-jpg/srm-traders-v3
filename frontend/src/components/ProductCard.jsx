import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../cart.jsx';
import { catOf, featuredOf, useSettings } from '../api.js';

export default function ProductCard({ p, compact }) {
  const { add } = useCart();
  const s = useSettings();
  const [bad, setBad] = useState(false);
  const c = catOf(p.category);
  const src = p.image || featuredOf(p.category);
  const quote = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I need a quote for ' + p.name)}`;
  return (
    <article className="card">
      <Link to={`/products/${p.id}`} className="card-img">
        {!bad ? <img src={src} alt={p.name} loading="lazy" onError={() => setBad(true)} /> : <span className="ph">{c.icon}</span>}
      </Link>
      <div className="card-b">
        <h3><Link to={`/products/${p.id}`}>{p.name}</Link></h3>
        {!compact && <p className="price">₹{p.price} <span>per piece · min {p.min_qty || 1}</span></p>}
        <a className="btn btn-navy sm" href={quote} target="_blank" rel="noreferrer">Get Quote</a>
        {!compact && <button className="btn btn-outline sm" onClick={() => add(p)}>Add to enquiry</button>}
      </div>
    </article>
  );
}
