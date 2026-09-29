import { Link } from 'react-router-dom';
import { CATEGORIES, coverOf } from '../api.js';

export default function Categories() {
  return (
    <section className="wrap cats-s">
      <div className="cats">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to={`/products?category=${c.slug}`} className="cat">
            <img src={coverOf(c.slug)} alt="" loading="lazy" onError={(e) => (e.target.style.visibility = 'hidden')} />
            <span>{c.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
