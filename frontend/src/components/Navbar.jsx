import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../cart.jsx';
import { useSettings, CATEGORIES } from '../api.js';

export default function Navbar() {
  const { count, setOpen } = useCart();
  const s = useSettings();
  const [menu, setMenu] = useState(false);
  const wa = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I need a quote for bulk products.')}`;
  const tel = 'tel:+91' + s.phone.split('/')[0].replace(/\D/g, '');
  return (
    <header className="hdr">
      <div className="topbar">
        <div className="wrap topbar-in">
          <span>📍 {s.address}</span>
          <span>📞 {s.phone}</span>
          <span>☎ {s.landline}</span>
          <span>✉ {s.email}</span>
        </div>
      </div>
      <div className="wrap nav-in">
        <Link to="/" className="brand">
          <img src="/logo/logo.png" alt="" width="60" height="60" />
          <span><b>S.R.M. TRADERS</b><small>{s.tagline}</small></span>
        </Link>
        <nav className={menu ? 'links open' : 'links'} onClick={() => setMenu(false)}>
          <NavLink to="/" end>Home</NavLink>
          <div className="dd">
            <NavLink to="/products">Products ▾</NavLink>
            <div className="dd-m">{CATEGORIES.map((c) => <Link key={c.slug} to={`/products?category=${c.slug}`}>{c.label}</Link>)}</div>
          </div>
          <NavLink to="/corporate-gifting">Corporate Gifting</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="nav-cta">
          <a className="btn btn-green" href={wa} target="_blank" rel="noreferrer">WhatsApp Enquiry</a>
          <a className="btn btn-navy" href={tel}>📞 Call Now</a>
          <button className="btn btn-cart" onClick={() => setOpen(true)} aria-label="Enquiry cart">🛒 {count}</button>
          <button className="burger" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button>
        </div>
      </div>
    </header>
  );
}
