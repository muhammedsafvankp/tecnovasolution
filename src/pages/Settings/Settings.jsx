import React, { useState, useEffect } from 'react';
import { useData } from '../../store/SupabaseDataStore';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { Users, KeyRound } from 'lucide-react';

const Settings = () => {
  const { settings, setSettings } = useData();
  const [formData, setFormData] = useState(settings);
  const [successMsg, setSuccessMsg] = useState('');

  // Team Access State
  const [role, setRole] = useState(null);
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({ email: '', password: '', role: 'Sales executive' });
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    // Keep form synced with context if it loads late
    setFormData(settings);
  }, [settings]);

  useEffect(() => {
    const checkRoleAndFetchStaff = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data, error } = await supabase.from('user_roles').select('*').eq('id', session.user.id).single();
      if (data) {
        setRole(data.role);
        if (data.role === 'Super admin') fetchStaff();
      } else {
        // Auto-bootstrap: If no roles exist in the DB, make this first user a Super admin
        const { count } = await supabase.from('user_roles').select('*', { count: 'exact', head: true });
        if (count === 0) {
          await supabase.from('user_roles').insert([{ id: session.user.id, email: session.user.email, role: 'Super admin' }]);
          setRole('Super admin');
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

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formData);
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage shop profile, team access, and configurations.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '48rem' }}>
        <div className="card">
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>Company Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div className="form-group mb-0">
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-input" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label">Contact Phone</label>
                    <input type="text" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Business Address</label>
                  <input type="text" className="form-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>Billing Configurations</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group mb-0">
                  <label className="form-label">Default GST Rate (%)</label>
                  <input type="number" className="form-input" value={formData.gstRate} onChange={e => setFormData({...formData, gstRate: Number(e.target.value)})} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button type="submit" className="btn-primary">Save Changes</button>
              {successMsg && <span style={{ color: 'var(--status-success)', fontSize: '0.875rem', fontWeight: 500 }}>{successMsg}</span>}
            </div>
          </form>
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
    </div>
  );
};

export default Settings;
