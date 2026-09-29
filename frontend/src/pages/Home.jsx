import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Categories from '../components/Categories.jsx';
import WhyChoose from '../components/WhyChoose.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { getProducts } from '../api.js';

export default function Home() {
  const [list, setList] = useState([]);
  useEffect(() => { getProducts().then((d) => setList(d.slice(0, 8))); }, []);
  return (
    <>
      <Hero />
      <Categories />
      <WhyChoose />
      <section className="wrap feat">
        <div className="feat-h"><h2>Featured Products</h2><Link to="/products">View All Products →</Link></div>
        <div className="feat-g">{list.map((p) => <ProductCard key={p.id} p={p} compact />)}</div>
      </section>
    </>
  );
}
