import React, { useState, useEffect } from 'react';
import { useData } from '../../store/SupabaseDataStore';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { IndianRupee, FileText, Wrench, Users, KeyRound } from 'lucide-react';

const Dashboard = () => {
  const { invoices, quotes, services, customers } = useData();

  // Team Access State
  const [role, setRole] = useState(null);
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({ email: '', password: '', role: 'Sales executive' });
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    const checkRoleAndFetchStaff = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data } = await supabase.from('user_roles').select('*').eq('id', session.user.id).single();
      if (data) {
        setRole(data.role);
        if (data.role === 'Super admin') {
          fetchStaff();
        }
      }
    };
    checkRoleAndFetchStaff();
  }, []);

  const fetchStaff = async () => {
    const { data } = await supabase.from('user_roles').select('*').order('created_at', { ascending: true });
    if (data) setStaff(data);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoadingStaff(true);
    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Staff added successfully!');
      setNewStaff({ email: '', password: '', role: 'Sales executive' });
      fetchStaff();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleResetPassword = async (email) => {
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Password reset email sent to ' + email);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const totalRevenue = invoices?.reduce((acc, inv) => acc + Number(inv.paid || 0), 0) || 0;
  const outstanding = invoices?.reduce((acc, inv) => acc + Number(inv.balance || 0), 0) || 0;
  const pendingQuotes = quotes?.filter(q => q.status === 'Pending').length || 0;
  const openServices = services?.filter(s => s.status === 'Open' || s.status === 'In Progress').length || 0;

  return (
    <div className="page-animate">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of sales, billing and service activity.</p>
        </div>
      </div>
      
      <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-icon" style={{ color: 'var(--brand-blue)' }}>
            <IndianRupee size={24} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Total Revenue Collected</h3>
            <p className="metric-value">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#EF4444' }}>
            <IndianRupee size={24} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Outstanding Payments</h3>
            <p className="metric-value">₹{outstanding.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#F59E0B' }}>
            <FileText size={24} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Pending Quotes</h3>
            <p className="metric-value">{pendingQuotes}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#10B981' }}>
            <Wrench size={24} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Open Services</h3>
            <p className="metric-value">{openServices}</p>
          </div>
        </div>
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

      {role === 'Super admin' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Users size={20} color="var(--brand-blue)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Team access</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Super admin only · add staff and send password resets</p>
          
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2rem' }}>
            <form onSubmit={handleAddStaff} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" required value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} placeholder="name@tecnovasolution.in" />
              </div>
              <div>
                <label className="form-label">Temporary password</label>
                <input type="password" className="form-input" required minLength={8} value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} placeholder="Min 8 characters" />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select className="form-input" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                  <option>Sales executive</option>
                  <option>Admin</option>
                  <option>Super admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" disabled={loadingStaff}>{loadingStaff ? 'Adding...' : 'Add user'}</button>
            </form>
          </div>

          <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>CURRENT STAFF</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {staff.map(user => (
              <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>@</span> {user.email}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', backgroundColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <button type="button" onClick={() => handleResetPassword(user.email)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  <KeyRound size={16} /> Reset password
                </button>
              </div>
            ))}
            {staff.length === 0 && <div className="empty-state">No staff added yet</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
