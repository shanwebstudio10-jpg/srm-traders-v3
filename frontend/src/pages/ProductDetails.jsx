import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, SAMPLE, catOf } from '../api.js';
import { useCart } from '../cart.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    api('/products/' + id).catch(() => SAMPLE.find((x) => String(x.id) === id) || null).then((d) => { setP(d); setQty(d?.min_qty || 1); });
  }, [id]);
  if (!p) return <section className="wrap section"><p>Product not found. <Link to="/products">Back to products</Link></p></section>;
  const c = catOf(p.category);
  return (
    <section className="wrap section detail">
      <div className="detail-img">{p.image ? <img src={p.image} alt={p.name} /> : <span className="ph">{c.icon}</span>}</div>
      <div>
        <small>{c.label}</small>
        <h1>{p.name}</h1>
        <p className="price big">₹{p.price} <span>per piece</span></p>
        <p>{p.description}</p>
        <p className="muted">Minimum order: {p.min_qty || 1} pieces. Logo printing available.</p>
        <div className="row">
          <input className="qty" type="number" min="1" value={qty} onChange={(e) => setQty(+e.target.value)} />
          <button className="btn btn-gold" onClick={() => add(p, qty)}>Add to enquiry · ₹{p.price * qty}</button>
        </div>
      </div>
    </section>
  );
}
