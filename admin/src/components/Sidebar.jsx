import { NavLink } from 'react-router-dom';

const LINKS = [['/', 'Dashboard'], ['/products', 'Products'], ['/orders', 'Orders'], ['/customers', 'Customers'], ['/messages', 'Messages'], ['/quotations', 'Quotations'], ['/payments', 'Payments'], ['/settings', 'Settings']];

export default function Sidebar() {
  return (
    <aside className="side">
      <div className="logo"><img src="/logo.png" alt="" width="40" height="40" /><span>S.R.M. TRADERS<small>Admin panel</small></span></div>
      {LINKS.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
    </aside>
  );
}
