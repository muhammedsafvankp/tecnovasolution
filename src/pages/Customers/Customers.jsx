import React, { useState } from 'react';
import { useData } from '../../store/SupabaseDataStore';
import { Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';

const Customers = () => {
  const { customers, addCustomer, deleteCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', gst: '', address: '' });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.name && formData.phone) {
      addCustomer(formData);
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', email: '', gst: '', address: '' });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">Manage client directory and view history.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
         <div style={{ position: 'relative', width: '300px' }}>
           <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
           <input 
             type="text" 
             className="form-input" 
             style={{ paddingLeft: '2rem' }} 
             placeholder="Search customers..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
         </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>GST No.</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email || '-'}</td>
                <td>{c.gst || '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon-only text-muted"><Edit size={16} /></button>
                  <button className="btn-icon-only text-danger" onClick={() => deleteCustomer(c.id)}><Trash2 size={16} color="var(--status-danger)"/></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No customers found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Customer</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input type="text" className="form-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">GST Number</label>
                  <input type="text" className="form-input" value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
