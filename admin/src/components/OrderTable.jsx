import { STATUSES, money } from '../api.js';

export default function OrderTable({ orders, onStatus }) {
  if (!orders.length) return <p className="muted">No orders here yet.</p>;
  return (
    <div className="scroll">
      <table>
        <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.order_no}</td>
              <td>{o.customer_name}<br /><small>{o.customer_phone}</small></td>
              <td>{(o.items || []).map((i) => `${i.name} × ${i.qty}`).join(', ')}</td>
              <td>{money(o.total)}</td>
              <td>{o.payment_method}</td>
              <td>{onStatus
                ? <select value={o.status} onChange={(e) => onStatus(o.id, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                : <span className={'tag ' + o.status}>{o.status}</span>}</td>
              <td>{(o.created_at || '').slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
