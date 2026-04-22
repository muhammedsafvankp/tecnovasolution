import React from 'react';
import { useData } from '../../store/SupabaseDataStore';
import { IndianRupee, FileText, Wrench, AlertTriangle, Box, Users } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon, trend }) => {
  return (
    <div className="card stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</h3>
        <div style={{ color: 'var(--brand-blue)' }}>{icon}</div>
      </div>
      <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>{value}</div>
      {subtext && <div style={{ fontSize: '0.75rem', color: trend === 'up' ? 'var(--status-success)' : 'var(--text-muted)' }}>{subtext}</div>}
    </div>
  );
};

const Dashboard = () => {
  const { customers, inventory, quotes, invoices, services } = useData();

  // Basic aggregations
  const totalRevenue = invoices.reduce((acc, inv) => acc + Number(inv.paid || 0), 0);
  const outstanding = invoices.reduce((acc, inv) => acc + Number(inv.balance || 0), 0);
  const pendingQuotes = quotes.filter(q => q.status === 'Pending').length;
  const openServices = services.filter(s => s.status === 'Open' || s.status === 'In Progress').length;
  const lowStock = inventory.filter(i => i.stock < 10).length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of sales, billing and service activity.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ backgroundColor: 'var(--brand-blue)', color: 'white', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>This month revenue</h3>
           <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>₹{totalRevenue.toLocaleString()}</div>
        </div>
        
        <StatCard title="Outstanding" value={`₹${outstanding.toLocaleString()}`} icon={<IndianRupee size={20}/>} />
        <StatCard title="Pending quotes" value={pendingQuotes} icon={<FileText size={20}/>} />
        <StatCard title="Open services" value={openServices} icon={<Wrench size={20}/>} />
        <StatCard title="Customers" value={customers.length} icon={<Users size={20}/>} />
        <StatCard title="Products" value={inventory.length} icon={<Box size={20}/>} />
        <StatCard title="Low stock alerts" value={lowStock} icon={<AlertTriangle size={20} color="var(--status-danger)"/>} trend="down" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent invoices</h3>
            <a href="/invoices" style={{ color: 'var(--brand-blue)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>View all ↗</a>
          </div>
          {(!invoices || invoices.length === 0) ? (
            <div className="empty-state">No invoices yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {invoices.slice(0, 3).map(inv => (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{inv.invoiceNo}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{inv.date}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>₹{Number(inv.total).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent service tickets</h3>
            <a href="/services" style={{ color: 'var(--brand-blue)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>View all ↗</a>
          </div>
          {(!services || services.length === 0) ? (
            <div className="empty-state">No service tickets yet</div>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {services.slice(0, 3).map(srv => (
                <div key={srv.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{srv.ticketNo}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{srv.serviceType}</div>
                  </div>
                  <div>
                    <span className={`status-badge status-${srv.status?.toLowerCase().replace(' ', '-')}`}>{srv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
