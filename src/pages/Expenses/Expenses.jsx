import React, { useState } from 'react';
import { useData } from '../../store/MockDataStore';
import { Plus, Search, Wallet, Trash2 } from 'lucide-react';

const Expenses = () => {
  const { expenses, addExpense, deleteExpense } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Material',
    amount: '',
    vendor: '',
    description: ''
  });

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.amount && formData.description) {
      addExpense({
        ...formData,
        amount: Number(formData.amount)
      });
      setIsModalOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0], category: 'Material', amount: '', vendor: '', description: ''
      });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track shop operations, vendor payouts, and overheads.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Record Expense
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
         <div style={{ position: 'relative', width: '300px' }}>
           <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
           <input 
             type="text" 
             className="form-input" 
             style={{ paddingLeft: '2rem' }} 
             placeholder="Search expenses..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
         </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Vendor</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? filteredExpenses.map(e => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td><span className="badge badge-neutral">{e.category}</span></td>
                <td style={{ fontWeight: 500 }}>{e.description}</td>
                <td>{e.vendor || '-'}</td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--status-danger)' }}>₹{e.amount.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon-only text-muted"><Wallet size={16} /></button>
                  <button className="btn-icon-only text-danger" onClick={() => deleteExpense(e.id)}><Trash2 size={16} color="var(--status-danger)"/></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No expenses recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(evt) => { if (evt.target === evt.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Record Expense</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label">Date *</label>
                    <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Material</option>
                      <option>Fuel/Travel</option>
                      <option>Salary/Labour</option>
                      <option>Office Supplies</option>
                      <option>Marketing</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Amount (₹) *</label>
                  <input type="number" className="form-input" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                
                <div className="form-group mb-0">
                  <label className="form-label">Description *</label>
                  <input type="text" className="form-input" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="What was this expense for?"/>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Vendor / Payee</label>
                  <input type="text" className="form-input" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} />
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
