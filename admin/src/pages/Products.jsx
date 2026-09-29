import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from '../api.js';

export default function Products() {
  const [list, setList] = useState([]);
  const load = () => api('/products?all=1').then(setList);
  useEffect(() => { load(); }, []);
  async function del(p) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await api('/products/' + p.id, { method: 'DELETE' }); load();
  }
  return (
    <>
      <div className="bar"><h1>Products</h1><Link className="btn" to="/products/new">Add product</Link></div>
      <div className="scroll">
        <table>
          <thead><tr><th>Photo</th><th>Name</th><th>Category</th><th>Price</th><th>Min qty</th><th>Live</th><th></th></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>{p.image ? <img className="thumb" src={p.image} alt="" /> : '-'}</td>
                <td>{p.name}</td><td>{p.category}</td><td>{money(p.price)}</td><td>{p.min_qty}</td><td>{p.active ? 'Yes' : 'Hidden'}</td>
                <td className="acts"><Link to={`/products/${p.id}/edit`}>Edit</Link> <button className="link red" onClick={() => del(p)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
