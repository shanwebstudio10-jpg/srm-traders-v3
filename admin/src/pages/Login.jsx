import { useState } from 'react';
import { api, TOKEN_KEY } from '../api.js';

export default function Login({ onLogin }) {
  const [f, setF] = useState({ username: 'admin', password: '' });
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError('');
    try {
      const { token } = await api('/auth/login', { method: 'POST', body: f });
      localStorage.setItem(TOKEN_KEY, token); onLogin();
    } catch (ex) { setError(ex.message); }
  }
  return (
    <form className="login" onSubmit={submit}>
      <img src="/logo.png" alt="" width="64" height="64" style={{ justifySelf: "center" }} />
      <h1 className="brandh">S.R.M. TRADERS</h1>
      <p className="muted" style={{ margin: 0, textAlign: "center" }}>Owner login</p>
      <input placeholder="Username" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} />
      <input type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      {error && <p className="err">{error}</p>}
      <button className="btn">Log in</button>
    </form>
  );
}
