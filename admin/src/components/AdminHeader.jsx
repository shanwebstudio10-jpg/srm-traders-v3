import { SITE_URL } from '../api.js';

export default function AdminHeader({ onLogout }) {
  return (
    <header className="top">
      <b>Owner dashboard</b>
      <a className="link" href={SITE_URL} target="_blank" rel="noreferrer">View website</a>
      <button className="btn ghost" onClick={onLogout}>Log out</button>
    </header>
  );
}
