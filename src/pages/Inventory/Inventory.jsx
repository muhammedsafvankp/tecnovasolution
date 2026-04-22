import React, { useState } from 'react';
import { useData } from '../../store/MockDataStore';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const Inventory = () => {
  const { inventory, addProduct, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Inverter', sku: '', price: '', stock: '' });

  const filteredItems = inventory.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.name && formData.price) {
      addProduct({ ...formData, price: Number(formData.price), stock: Number(formData.stock) });
      setIsModalOpen(false);
      setFormData({ name: '', category: 'Inverter', sku: '', price: '', stock: '' });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">Manage products, pricing, and stock levels.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
         <div style={{ position: 'relative', width: '300px' }}>
           <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
           <input 
             type="text" 
             className="form-input" 
             style={{ paddingLeft: '2rem' }} 
             placeholder="Search products/SKU..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
         </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? filteredItems.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>{p.sku}</td>
                <td><span className="badge badge-neutral">{p.category}</span></td>
                <td>₹{p.price.toLocaleString()}</td>
                <td>
                  {p.stock < 10 ? <span style={{ color: 'var(--status-danger)', fontWeight: 600 }}>{p.stock} (Low)</span> : p.stock}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon-only text-muted"><Edit size={16} /></button>
                  <button className="btn-icon-only text-danger" onClick={() => deleteProduct(p.id)}><Trash2 size={16} color="var(--status-danger)"/></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Inverter</option>
                      <option>Solar</option>
                      <option>CCTV</option>
                      <option>Water Purifier</option>
                      <option>Home Automation</option>
                      <option>Electrical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">SKU</label>
                    <input type="text" className="form-input" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹) *</label>
                    <input type="number" className="form-input" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Initial Stock</label>
                    <input type="number" className="form-input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
