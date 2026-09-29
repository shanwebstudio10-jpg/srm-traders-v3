import { useEffect, useState } from 'react';
import { api, money } from '../api.js';

export default function Payments() {
  const [list, setList] = useState([]);
  const load = () => api('/payments').then(setList);
  useEffect(() => { load(); }, []);
  async function paid(id) { await api('/payments/' + id, { method: 'PUT' }); load(); }
  return (
    <>
      <h1>Payments</h1>
      <div className="scroll">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Method</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>{p.order_no}</td><td>{p.customer_name}</td><td>{p.method}</td><td>{money(p.amount)}</td>
                <td><span className={'tag ' + p.status}>{p.status}</span></td><td>{p.created_at.slice(0, 10)}</td>
                <td>{p.status !== 'Paid' && <button className="link" onClick={() => paid(p.id)}>Mark as paid</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
