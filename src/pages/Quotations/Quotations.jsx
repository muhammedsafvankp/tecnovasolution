import React, { useState } from 'react';
import { useData } from '../../store/SupabaseDataStore';
import { Plus, Search, FileText, Trash2 } from 'lucide-react';

const Quotations = () => {
  const { quotes, customers, inventory, addQuote, deleteQuote } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Quote form state
  const [formData, setFormData] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });
  const [items, setItems] = useState([{ productId: '', qty: 1, price: 0 }]);

  const filteredQuotes = quotes.filter(q => 
    q.quoteNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'productId') {
      const product = inventory.find(p => p.id === Number(value));
      newItems[index] = { ...newItems[index], productId: Number(value), price: product ? product.price : 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: Number(value) };
    }
    setItems(newItems);
  };

  const addItemRow = () => setItems([...items, { productId: '', qty: 1, price: 0 }]);
  const removeItemRow = (index) => setItems(items.filter((_, i) => i !== index));

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.customerId && items.length > 0 && items[0].productId) {
      const newQuoteNo = `Q-100${quotes.length + 2}`;
      addQuote({
        ...formData,
        quoteNo: newQuoteNo,
        customerId: Number(formData.customerId),
        total: totalAmount,
        items
      });
      setIsModalOpen(false);
      setFormData({ customerId: '', date: new Date().toISOString().split('T')[0], status: 'Pending' });
      setItems([{ productId: '', qty: 1, price: 0 }]);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quotations</h1>
          <p className="page-subtitle">Create and manage client quotations.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Quote
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
         <div style={{ position: 'relative', width: '300px' }}>
           <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
           <input 
             type="text" 
             className="form-input" 
             style={{ paddingLeft: '2rem' }} 
             placeholder="Search by Quote No..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
         </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Quote No.</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Total Amount</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.length > 0 ? filteredQuotes.map(q => (
              <tr key={q.id}>
                <td style={{ fontWeight: 600, color: 'var(--brand-blue)' }}>{q.quoteNo}</td>
                <td>{q.date}</td>
                <td>{getCustomerName(q.customerId)}</td>
                <td>
                  <span className={`badge ${q.status === 'Accepted' ? 'badge-success' : q.status === 'Pending' ? 'badge-warning' : 'badge-neutral'}`}>
                    {q.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{q.total.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon-only text-muted"><FileText size={16} /></button>
                  <button className="btn-icon-only text-danger" onClick={() => deleteQuote(q.id)}><Trash2 size={16} color="var(--status-danger)"/></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No quotations found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-content" style={{ maxWidth: '42rem' }}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Quote</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label">Select Customer *</label>
                    <select className="form-input" required value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})}>
                      <option value="">-- Select --</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                    </select>
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Date *</label>
                    <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Line Items</h3>
                  {items.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'end' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Product</label>
                        <select className="form-input" required value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)}>
                          <option value="">-- Select Product --</option>
                          {inventory.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Qty</label>
                        <input type="number" min="1" className="form-input" required value={item.qty} onChange={e => handleItemChange(index, 'qty', e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Price (₹)</label>
                        <input type="number" className="form-input" required value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} />
                      </div>
                      <button type="button" className="btn-icon-only danger" style={{ height: '40px' }} onClick={() => removeItemRow(index)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary" style={{ marginTop: '0.5rem' }} onClick={addItemRow}>
                    <Plus size={16} /> Add Line Item
                  </button>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '1.25rem', fontWeight: 600 }}>
                    <span>Total:</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Generate Quote</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotations;
