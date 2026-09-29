import { useEffect, useState } from 'react';
import { api, money } from '../api.js';

const blank = { customer_name: '', customer_phone: '', gst_percent: 18, notes: '', items: [{ desc: '', qty: 1, rate: 0 }] };

// Opens a print-ready page. Choose "Save as PDF" in the print window.
function printQuote(q, biz) {
  const sub = q.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const gst = sub * (q.gst_percent / 100);
  const rows = q.items.map((i, n) => `<tr><td>${n + 1}</td><td>${i.desc}</td><td>${i.qty}</td><td>${i.rate}</td><td>${(i.qty * i.rate).toFixed(2)}</td></tr>`).join('');
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>${q.quote_no}</title><style>
    body{font-family:Arial,sans-serif;padding:32px;color:#222}h1{margin:0}table{width:100%;border-collapse:collapse;margin:18px 0}
    th,td{border:1px solid #bbb;padding:8px;text-align:left}th{background:#eef}.r{text-align:right}</style></head><body>
    <h1>${biz.business_name || 'SRM Traders'}</h1><p>${biz.address || ''}<br>${biz.phone || ''} · ${biz.email || ''}</p>
    <h2>Quotation ${q.quote_no || ''}</h2><p>Date: ${(q.created_at || new Date().toISOString()).slice(0, 10)}<br>To: <b>${q.customer_name}</b> ${q.customer_phone || ''}</p>
    <table><tr><th>#</th><th>Item</th><th>Qty</th><th>Rate (₹)</th><th>Amount (₹)</th></tr>${rows}</table>
    <p class="r">Subtotal: ₹${sub.toFixed(2)}<br>GST ${q.gst_percent}%: ₹${gst.toFixed(2)}<br><b>Total: ₹${(sub + gst).toFixed(2)}</b></p>
    <p>${q.notes || ''}</p><p>This quotation is valid for 15 days.</p></body></html>`);
  w.document.close(); w.focus(); setTimeout(() => w.print(), 400);
}

export default function Quotations() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(blank);
  const [biz, setBiz] = useState({});
  const [error, setError] = useState('');
  const load = () => api('/quotations').then(setList);
  useEffect(() => { load(); api('/settings').then(setBiz); }, []);

  const setItem = (n, k, v) => setF({ ...f, items: f.items.map((it, i) => (i === n ? { ...it, [k]: v } : it)) });
  async function save(e) {
    e.preventDefault(); setError('');
    try {
      const items = f.items.map((i) => ({ ...i, qty: +i.qty, rate: +i.rate }));
      const r = await api('/quotations', { method: 'POST', body: { ...f, items } });
      setF(blank); await load();
      printQuote({ ...f, items, quote_no: r.quote_no }, biz);
    } catch (ex) { setError(ex.message); }
  }
  async function del(id) { if (confirm('Delete this quotation?')) { await api('/quotations/' + id, { method: 'DELETE' }); load(); } }

  return (
    <>
      <h1>Quotations</h1>
      <form className="form" onSubmit={save}>
        <label>Customer name<input required value={f.customer_name} onChange={(e) => setF({ ...f, customer_name: e.target.value })} /></label>
        <label>Customer phone<input value={f.customer_phone} onChange={(e) => setF({ ...f, customer_phone: e.target.value })} /></label>
        {f.items.map((it, n) => (
          <div className="qrow" key={n}>
            <input placeholder="Item" required value={it.desc} onChange={(e) => setItem(n, 'desc', e.target.value)} />
            <input type="number" min="1" placeholder="Qty" value={it.qty} onChange={(e) => setItem(n, 'qty', e.target.value)} />
            <input type="number" min="0" step="0.01" placeholder="Rate" value={it.rate} onChange={(e) => setItem(n, 'rate', e.target.value)} />
            <button type="button" className="link red" onClick={() => setF({ ...f, items: f.items.filter((_, i) => i !== n) })}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn ghost" onClick={() => setF({ ...f, items: [...f.items, { desc: '', qty: 1, rate: 0 }] })}>Add item</button>
        <label>GST %<input type="number" value={f.gst_percent} onChange={(e) => setF({ ...f, gst_percent: e.target.value })} /></label>
        <label>Notes<textarea rows="2" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
        {error && <p className="err">{error}</p>}
        <button className="btn">Save and create PDF</button>
      </form>
      <h2>Saved quotations</h2>
      <div className="scroll">
        <table>
          <thead><tr><th>No.</th><th>Customer</th><th>Total</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {list.map((q) => (
              <tr key={q.id}>
                <td>{q.quote_no}</td><td>{q.customer_name}</td><td>{money(q.total)}</td><td>{q.created_at.slice(0, 10)}</td>
                <td className="acts"><button className="link" onClick={() => printQuote(q, biz)}>PDF</button> <button className="link red" onClick={() => del(q.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
