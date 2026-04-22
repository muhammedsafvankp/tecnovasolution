import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileText, FileSpreadsheet, Wrench, Wallet, Settings, LogOut, Zap } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Quotations', path: '/quotations', icon: <FileText size={20} /> },
    { name: 'Invoices', path: '/invoices', icon: <FileSpreadsheet size={20} /> },
    { name: 'Services', path: '/services', icon: <Wrench size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <Wallet size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <img src="/logo.png" alt="Tecnova Solution Logo" style={{ maxWidth: '100%', maxHeight: '45px', objectFit: 'contain' }} />
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            to={item.path} 
            key={item.name}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-hint">Admin User</div>
        <button className="logout-btn" onClick={() => supabase.auth.signOut()}>
          <LogOut size={16} /> Sign out
        </button>
        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5' }}>
          &copy; {new Date().getFullYear()} Tecnova Solution<br/>
          Powered by <a href="https://muhammedsafvan.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-blue)', textDecoration: 'none', fontWeight: 500 }}>Muhammed Safvan</a>
        </div>
      </div>
    </aside>
  );
};

const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
