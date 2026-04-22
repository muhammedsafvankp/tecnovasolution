import React, { useState } from 'react';
import { useData } from '../../store/MockDataStore';
import { Plus, Search, FileSpreadsheet, Trash2 } from 'lucide-react';

const Invoices = () => {
  const { invoices, customers, inventory, addInvoice, deleteInvoice } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Invoice form state
  const [formData, setFormData] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    paid: 0
  });
  const [items, setItems] = useState([{ productId: '', qty: 1, price: 0 }]);

  const filteredInvoices = invoices.filter(i => 
    i.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
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
  const balanceAmount = totalAmount - formData.paid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.customerId && items.length > 0 && items[0].productId) {
      const newInvoiceNo = `INV-200${invoices.length + 2}`;
      let status = 'Unpaid';
      if (formData.paid >= totalAmount) status = 'Paid';
      else if (formData.paid > 0) status = 'Partially Paid';

      addInvoice({
        ...formData,
        invoiceNo: newInvoiceNo,
        customerId: Number(formData.customerId),
        total: totalAmount,
        paid: Number(formData.paid),
        balance: balanceAmount,
        status,
        items
      });
      setIsModalOpen(false);
      setFormData({ customerId: '', date: new Date().toISOString().split('T')[0], paid: 0 });
      setItems([{ productId: '', qty: 1, price: 0 }]);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-subtitle">Track payments, balances, and generate bills.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Invoice
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
         <div style={{ position: 'relative', width: '300px' }}>
           <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
           <input 
             type="text" 
             className="form-input" 
             style={{ paddingLeft: '2rem' }} 
             placeholder="Search by Invoice No..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
         </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice No.</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th style={{ textAlign: 'right' }}>Balance</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? filteredInvoices.map(i => (
              <tr key={i.id}>
                <td style={{ fontWeight: 600, color: 'var(--brand-blue)' }}>{i.invoiceNo}</td>
                <td>{i.date}</td>
                <td>{getCustomerName(i.customerId)}</td>
                <td>
                  <span className={`badge ${i.status === 'Paid' ? 'badge-success' : i.status === 'Unpaid' ? 'badge-danger' : 'badge-warning'}`}>
                    {i.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{i.total.toLocaleString()}</td>
                <td style={{ textAlign: 'right', color: i.balance > 0 ? 'var(--status-danger)' : 'var(--text-muted)' }}>₹{i.balance.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon-only text-muted"><FileSpreadsheet size={16} /></button>
                  <button className="btn-icon-only text-danger" onClick={() => deleteInvoice(i.id)}><Trash2 size={16} color="var(--status-danger)"/></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No invoices found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-content" style={{ maxWidth: '42rem' }}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Invoice</h2>
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
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', fontSize: '1rem' }}>
                    <span>Subtotal:</span>
                    <span style={{ fontWeight: 600 }}>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', alignItems: 'center' }}>
                    <span>Amount Paid:</span>
                    <input type="number" className="form-input" style={{ width: '120px', padding: '0.25rem 0.5rem' }} value={formData.paid} onChange={e => setFormData({...formData, paid: Number(e.target.value)})} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', fontSize: '1.25rem', fontWeight: 700, color: balanceAmount > 0 ? 'var(--status-danger)' : 'var(--text-main)' }}>
                    <span>Balance Due:</span>
                    <span>₹{Math.max(0, balanceAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
