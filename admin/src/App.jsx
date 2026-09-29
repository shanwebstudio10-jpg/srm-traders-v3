import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TOKEN_KEY } from './api.js';
import Sidebar from './components/Sidebar.jsx';
import AdminHeader from './components/AdminHeader.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import AddProduct from './pages/AddProduct.jsx';
import Orders from './pages/Orders.jsx';
import Customers from './pages/Customers.jsx';
import Quotations from './pages/Quotations.jsx';
import Payments from './pages/Payments.jsx';
import Messages from './pages/Messages.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem(TOKEN_KEY));
  if (!authed) return <Login onLogin={() => setAuthed(true)} />;
  const logout = () => { localStorage.removeItem(TOKEN_KEY); setAuthed(false); };
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <AdminHeader onLogout={logout} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<AddProduct />} />
            <Route path="/products/:id/edit" element={<AddProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
