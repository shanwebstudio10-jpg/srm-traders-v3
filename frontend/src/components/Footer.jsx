import { Link } from 'react-router-dom';
import { useSettings, CATEGORIES } from '../api.js';

export default function Footer() {
  const s = useSettings();
  const wa = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}`;
  const map = 'https://www.google.com/maps?q=' + encodeURIComponent(s.address);
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div className="fb"><img src="/logo/logo.png" alt="" width="56" height="56" /><div><b>S.R.M. TRADERS</b><small>{s.tagline}</small></div></div>
        <div><h4>Contact Details</h4><p>📍 {s.address}</p><p>📞 {s.phone}</p><p>☎ {s.landline}</p><p>✉ {s.email}</p></div>
        <div className="fl"><h4>Quick Links</h4><Link to="/">Home</Link><Link to="/products">Products</Link><Link to="/corporate-gifting">Corporate Gifting</Link><Link to="/about">About Us</Link><Link to="/contact">Contact</Link></div>
        <div><h4>Our Location</h4>
          <iframe title="Map" className="map" loading="lazy" src={`${map}&output=embed`} />
          <a href={map} target="_blank" rel="noreferrer">View on Google Maps →</a></div>
        <div><h4>Get in Touch</h4><a className="btn btn-green sm" href={wa} target="_blank" rel="noreferrer">WhatsApp Enquiry</a>
          <p>Send us a message for bulk orders and custom quotes.</p></div>
      </div>
      <div className="copy wrap"><span>© {new Date().getFullYear()} S.R.M. Traders. All rights reserved.</span>
        <span>{CATEGORIES.map((c) => c.label.replace('New Year ', '').replace(' Items', '')).join(' | ')}</span></div>
    </footer>
  );
}
