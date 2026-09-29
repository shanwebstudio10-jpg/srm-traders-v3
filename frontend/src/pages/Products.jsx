import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import ProductSearch from '../components/ProductSearch.jsx';
import ProductFilter from '../components/ProductFilter.jsx';
import { getProducts } from '../api.js';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState([]);
  const [q, setQ] = useState('');
  const cat = params.get('category') || '';
  useEffect(() => { getProducts().then(setAll); }, []);
  const list = all.filter((p) => (!cat || p.category === cat) && (!q || (p.name + ' ' + p.description).toLowerCase().includes(q.toLowerCase())));
  return (
    <section className="wrap section">
      <h1>Products</h1>
      <ProductSearch value={q} onChange={setQ} />
      <ProductFilter value={cat} onChange={(c) => setParams(c ? { category: c } : {})} />
      {list.length === 0 ? <p className="muted">No products found. Try another word or category.</p> : <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </section>
  );
}
