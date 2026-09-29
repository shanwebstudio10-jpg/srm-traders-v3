import { useEffect, useState } from 'react';
import { api, money } from '../api.js';
import StatsCard from '../components/StatsCard.jsx';
import OrderTable from '../components/OrderTable.jsx';

export default function Dashboard() {
  const [s, setS] = useState({});
  const [orders, setOrders] = useState([]);
  useEffect(() => { api('/stats').then(setS).catch(() => {}); api('/orders').then((o) => setOrders(o.slice(0, 8))).catch(() => {}); }, []);
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <StatsCard label="Total products" value={s.products ?? '-'} />
        <StatsCard label="New enquiries" value={s.enquiries ?? '-'} />
        <StatsCard label="Orders" value={s.orders ?? '-'} />
        <StatsCard label="New messages" value={s.messages ?? '-'} />
        <StatsCard label="Payments received" value={money(s.payments)} />
      </div>
      <h2>Latest orders</h2>
      <OrderTable orders={orders} />
    </>
  );
}
