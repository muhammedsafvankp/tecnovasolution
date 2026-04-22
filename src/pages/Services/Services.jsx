import React, { useState } from 'react';
import { useData } from '../../store/SupabaseDataStore';
import { Plus, Search, Wrench, Trash2 } from 'lucide-react';

const Services = () => {
  const { services, customers, addService, deleteService } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    customerId: '',
    serviceType: 'Installation',
    technician: '',
    status: 'Open',
    scheduledDate: new Date().toISOString().split('T')[0],
    charges: '',
    amcExpiry: ''
  });

  const filteredServices = services.filter(s => 
    s.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.technician.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.customerId) {
      const newTicketNo = `TKT-300${services.length + 2}`;
      addService({
        ...formData,
        ticketNo: newTicketNo,
        customerId: Number(formData.customerId),
        charges: formData.charges ? Number(formData.charges) : 0
      });
      setIsModalOpen(false);
      setFormData({
        customerId: '', serviceType: 'Installation', technician: '',
        status: 'Open', scheduledDate: new Date().toISOString().split('T')[0], charges: '', amcExpiry: ''
      });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Services & AMC</h1>
          <p className="page-subtitle">Installation jobs, repair tickets, and AMC tracking.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Ticket
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
         <div style={{ position: 'relative', width: '300px' }}>
           <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
           <input 
             type="text" 
             className="form-input" 
             style={{ paddingLeft: '2rem' }} 
             placeholder="Search tickets..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
         </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Scheduled</th>
              <th>Technician</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Charges</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? filteredServices.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600, color: 'var(--brand-blue)' }}>{s.ticketNo}</td>
                <td>{getCustomerName(s.customerId)}</td>
                <td>{s.serviceType}</td>
                <td>{s.scheduledDate}</td>
                <td>{s.technician || 'Unassigned'}</td>
                <td>
                  <span className={`badge ${s.status === 'Completed' ? 'badge-success' : s.status === 'In Progress' ? 'badge-warning' : 'badge-neutral'}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>{s.charges > 0 ? `₹${s.charges.toLocaleString()}` : '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon-only text-muted"><Wrench size={16} /></button>
                  <button className="btn-icon-only text-danger" onClick={() => deleteService(s.id)}><Trash2 size={16} color="var(--status-danger)"/></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No tickets yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create Service Ticket</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group mb-0">
                  <label className="form-label">Client *</label>
                  <select className="form-input" required value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})}>
                    <option value="">-- Select --</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label">Service Type</label>
                    <select className="form-input" value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})}>
                      <option>Installation</option>
                      <option>Repair/Maintenance</option>
                      <option>Inspection</option>
                      <option>AMC Visit</option>
                    </select>
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label">Scheduled Date *</label>
                    <input type="date" className="form-input" required value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Technician Assigned</label>
                    <input type="text" className="form-input" placeholder="Name" value={formData.technician} onChange={e => setFormData({...formData, technician: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label">Service Charges (₹)</label>
                    <input type="number" className="form-input" value={formData.charges} onChange={e => setFormData({...formData, charges: e.target.value})} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">AMC Expiry (Optional)</label>
                    <input type="date" className="form-input" value={formData.amcExpiry} onChange={e => setFormData({...formData, amcExpiry: e.target.value})} />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
