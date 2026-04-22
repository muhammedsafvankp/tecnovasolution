import React, { createContext, useState, useContext } from 'react';

const MockDataContext = createContext();

export const useData = () => useContext(MockDataContext);

export const MockDataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', phone: '+91 9876543210', email: 'john@example.com', gst: '29ABCDE1234F1Z5', address: '123 Main St' }
  ]);
  
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Luminous Inverter 1050VA', category: 'Inverter', sku: 'LUM-1050', price: 6500, stock: 15 },
    { id: 2, name: 'Solar Panel 330W', category: 'Solar', sku: 'SOL-330', price: 9000, stock: 40 },
    { id: 3, name: 'CP Plus 2MP Bullet Camera', category: 'CCTV', sku: 'CP-2MP-BL', price: 1200, stock: 50 },
    { id: 4, name: 'Kent RO Water Purifier', category: 'Water Purifier', sku: 'KNT-RO-01', price: 15500, stock: 8 }
  ]);

  const [quotes, setQuotes] = useState([
    { id: 1, quoteNo: 'Q-1001', customerId: 1, date: '2026-04-20', status: 'Pending', total: 15500, items: [{ productId: 1, qty: 1, price: 6500 }, { productId: 2, qty: 1, price: 9000 }] }
  ]);

  const [invoices, setInvoices] = useState([
    { id: 1, invoiceNo: 'INV-2001', customerId: 1, date: '2026-04-21', status: 'Partially Paid', total: 6500, paid: 3000, balance: 3500, items: [{ productId: 1, qty: 1, price: 6500 }] }
  ]);

  const [services, setServices] = useState([
    { id: 1, ticketNo: 'TKT-3001', customerId: 1, serviceType: 'Installation', technician: 'Ramesh', status: 'Open', scheduledDate: '2026-04-25', charges: 500, amcExpiry: '' }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, date: '2026-04-22', category: 'Fuel', amount: 800, description: 'Client visit fuel', vendor: 'Petrol Pump' }
  ]);

  const [settings, setSettings] = useState({
    companyName: 'Tecnova Solution',
    gstRate: 18,
    address: 'Smart energy center, Main Road',
    phone: '+91 88888 88888',
    email: 'info@tecnovasolution.com'
  });

  // Generic add/delete/update logic
  const addItem = (setter) => (item) => setter(prev => [...prev, { ...item, id: Date.now() }]);
  const deleteItem = (setter) => (id) => setter(prev => prev.filter(i => i.id !== id));
  const updateItem = (setter) => (id, data) => setter(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));

  const value = {
    customers, addCustomer: addItem(setCustomers), deleteCustomer: deleteItem(setCustomers), updateCustomer: updateItem(setCustomers),
    inventory, addProduct: addItem(setInventory), deleteProduct: deleteItem(setInventory), updateProduct: updateItem(setInventory),
    quotes, addQuote: addItem(setQuotes), deleteQuote: deleteItem(setQuotes), updateQuote: updateItem(setQuotes),
    invoices, addInvoice: addItem(setInvoices), deleteInvoice: deleteItem(setInvoices), updateInvoice: updateItem(setInvoices),
    services, addService: addItem(setServices), deleteService: deleteItem(setServices), updateService: updateItem(setServices),
    expenses, addExpense: addItem(setExpenses), deleteExpense: deleteItem(setExpenses), updateExpense: updateItem(setExpenses),
    settings, setSettings
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};
