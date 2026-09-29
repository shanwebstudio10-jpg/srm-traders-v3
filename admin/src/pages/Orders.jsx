import { useEffect, useState } from 'react';
import { api, STATUSES, downloadCsv } from '../api.js';
import OrderTable from '../components/OrderTable.jsx';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('');
  const load = () => api('/orders' + (tab ? '?status=' + tab : '')).then(setOrders);
  useEffect(() => { load(); }, [tab]);
  async function setStatus(id, status) { await api('/orders/' + id, { method: 'PUT', body: { status } }); load(); }
  return (
    <>
      <div className="bar"><h1>Orders</h1>
        <button className="btn ghost" onClick={() => downloadCsv('orders.csv', [['Order', 'Date', 'Customer', 'Phone', 'Items', 'Total', 'Payment', 'Status'], ...orders.map((o) => [o.order_no, o.created_at, o.customer_name, o.customer_phone, (o.items || []).map((i) => `${i.name} x ${i.qty}`).join('; '), o.total, o.payment_method, o.status])])}>Download Excel (CSV)</button></div>
      <div className="tabs">
        {['', ...STATUSES].map((s) => <button key={s} className={tab === s ? 'on' : ''} onClick={() => setTab(s)}>{s || 'All'}</button>)}
      </div>
      <OrderTable orders={orders} onStatus={setStatus} />
    </>
  );
}
