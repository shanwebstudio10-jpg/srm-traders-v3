import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('srm_cart')) || []; } catch { return []; }
  });
  const [open, setOpen] = useState(false);
  useEffect(() => { localStorage.setItem('srm_cart', JSON.stringify(items)); }, [items]);

  const add = (p, qty) => {
    const q = qty || p.min_qty || 1;
    setItems((a) => a.find((i) => i.id === p.id)
      ? a.map((i) => (i.id === p.id ? { ...i, qty: i.qty + q } : i))
      : [...a, { id: p.id, name: p.name, price: p.price, image: p.image, min_qty: p.min_qty || 1, qty: q }]);
    setOpen(true);
  };
  const setQty = (id, q) => setItems((a) => a.map((i) => (i.id === id ? { ...i, qty: Math.max(1, q || 1) } : i)));
  const remove = (id) => setItems((a) => a.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.length;

  return <Ctx.Provider value={{ items, add, setQty, remove, clear, total, count, open, setOpen }}>{children}</Ctx.Provider>;
}
