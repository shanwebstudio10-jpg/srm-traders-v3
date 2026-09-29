import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, CATEGORIES } from '../api.js';

// Resize the chosen photo in the browser so it stays small in the database
function fileToDataUrl(file, max = 700) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = img.width * k; c.height = img.height * k;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.8));
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function AddProduct() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', category: 'diary', price: '', min_qty: 1, description: '', image: '', active: 1 });
  const [error, setError] = useState('');
  useEffect(() => { if (id) api('/products/' + id).then(setF); }, [id]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setError('');
    try {
      await api(id ? '/products/' + id : '/products', { method: id ? 'PUT' : 'POST', body: f });
      nav('/products');
    } catch (ex) { setError(ex.message); }
  }
  return (
    <form className="form" onSubmit={submit}>
      <h1>{id ? 'Edit product' : 'Add product'}</h1>
      <label>Name<input required value={f.name} onChange={set('name')} /></label>
      <label>Category<select value={f.category} onChange={set('category')}>{CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      <label>Price per piece (₹)<input required type="number" min="0" step="0.01" value={f.price} onChange={set('price')} /></label>
      <label>Minimum order quantity<input type="number" min="1" value={f.min_qty} onChange={set('min_qty')} /></label>
      <label>Description<textarea rows="3" value={f.description} onChange={set('description')} /></label>
      <label>Photo<input type="file" accept="image/*" onChange={async (e) => e.target.files[0] && setF({ ...f, image: await fileToDataUrl(e.target.files[0]) })} /></label>
      <label>Or photo link (for example /products/diary/1.jpg)<input value={f.image?.startsWith('data:') ? '' : f.image} onChange={set('image')} /></label>
      {f.image && <img className="preview" src={f.image} alt="Preview" />}
      <label className="inline"><input type="checkbox" checked={!!f.active} onChange={(e) => setF({ ...f, active: e.target.checked ? 1 : 0 })} /> Show on website</label>
      {error && <p className="err">{error}</p>}
      <button className="btn">Save product</button>
    </form>
  );
}
