import { useEffect, useState } from 'react';
import { api, money, downloadCsv } from '../api.js';

export default function Customers() {
  const [list, setList] = useState([]);
  useEffect(() => { api('/customers').then(setList); }, []);
  return (
    <>
      <div className="bar"><h1>Customers</h1>
        <button className="btn ghost" onClick={() => downloadCsv('customers.csv', [['Name', 'Phone', 'Email', 'Company', 'Address', 'Orders', 'Spent'], ...list.map((c) => [c.name, c.phone, c.email, c.company, c.address, c.orders, c.spent])])}>Download Excel (CSV)</button></div>
      <div className="scroll">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Company</th><th>Address</th><th>Orders</th><th>Total spent</th></tr></thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td><a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{c.phone}</a></td>
                <td>{c.company}</td><td>{c.address}</td><td>{c.orders}</td><td>{money(c.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
