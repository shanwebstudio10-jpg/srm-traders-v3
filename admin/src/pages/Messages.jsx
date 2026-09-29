import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Messages() {
  const [list, setList] = useState([]);
  const load = () => api('/messages').then(setList);
  useEffect(() => { load(); }, []);
  async function setStatus(id, status) { await api('/messages/' + id, { method: 'PUT', body: { status } }); load(); }
  async function del(id) { if (confirm('Delete this message?')) { await api('/messages/' + id, { method: 'DELETE' }); load(); } }
  return (
    <>
      <h1>Messages</h1>
      {!list.length && <p className="muted">No messages yet. Messages from the Contact and Corporate Gifting forms appear here.</p>}
      <div className="scroll">
        <table>
          <thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Message</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td>{m.created_at.slice(0, 10)}</td><td>{m.name}<br /><small>{m.email}</small></td>
                <td>{m.phone ? <a href={`https://wa.me/91${m.phone.replace(/\D/g, '').slice(-10)}`} target="_blank" rel="noreferrer">{m.phone}</a> : '-'}</td>
                <td style={{ whiteSpace: 'pre-wrap' }}>{m.message}</td>
                <td><select value={m.status} onChange={(e) => setStatus(m.id, e.target.value)}>{['New', 'Contacted', 'Done'].map((s) => <option key={s}>{s}</option>)}</select></td>
                <td><button className="link red" onClick={() => del(m.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
