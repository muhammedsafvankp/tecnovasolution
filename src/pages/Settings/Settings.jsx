import React, { useState } from 'react';
import { useData } from '../../store/SupabaseDataStore';

const Settings = () => {
  const { settings, setSettings } = useData();
  const [formData, setFormData] = useState(settings);
  const [successMsg, setSuccessMsg] = useState('');

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
          <p className="page-subtitle">Manage shop profile, GST rates, and configurations.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '48rem' }}>
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
    </div>
  );
};

export default Settings;
