import { Link } from 'react-router-dom';
import { useSettings } from '../api.js';

export default function Hero() {
  const s = useSettings();
  const wa = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I need a quote for bulk products.')}`;
  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div className="hero-t">
          <p className="welcome">WELCOME TO</p>
          <h1>S.R.M. TRADERS</h1>
          <h2>Corporate Gifts, Bags & Promotional Products</h2>
          <p>Make your brand memorable with our high-quality customized gifts and promotional products.</p>
          <div className="row">
            <a className="btn btn-green lg" href={wa} target="_blank" rel="noreferrer">WhatsApp Enquiry →</a>
            <Link className="btn btn-outline lg" to="/products">View Products →</Link>
          </div>
        </div>
        <img className="hero-img" src="/hero/hero.jpg" alt="Customised diaries, calendars, bags and gifts with your logo" />
      </div>
    </section>
  );
}
