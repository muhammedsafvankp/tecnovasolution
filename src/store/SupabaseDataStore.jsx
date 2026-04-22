import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const SupabaseDataContext = createContext();

export const useData = () => useContext(SupabaseDataContext);

export const SupabaseDataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [services, setServices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState({
    companyName: '', gstRate: 18, address: '', phone: '', email: ''
  });

  const fetchData = async () => {
    try {
      const { data: cData } = await supabase.from('customers').select('*').order('id', { ascending: false });
      if (cData) setCustomers(cData);

      const { data: iData } = await supabase.from('inventory').select('*').order('id', { ascending: false });
      if (iData) setInventory(iData);

      const { data: qData } = await supabase.from('quotes').select(`*, items:quote_items(*)`).order('id', { ascending: false });
      if (qData) {
        setQuotes(qData.map(q => ({
          ...q, quoteNo: q.quote_no, customerId: q.customer_id,
          items: q.items.map(i => ({ productId: i.product_id, qty: i.qty, price: i.price })) // map items specifically
        })));
      }

      const { data: invData } = await supabase.from('invoices').select(`*, items:invoice_items(*)`).order('id', { ascending: false });
      if (invData) {
        setInvoices(invData.map(i => ({
          ...i, invoiceNo: i.invoice_no, customerId: i.customer_id,
          items: i.items.map(it => ({ productId: it.product_id, qty: it.qty, price: it.price }))
        })));
      }

      const { data: sData } = await supabase.from('services').select('*').order('id', { ascending: false });
      if (sData) {
        setServices(sData.map(s => ({
          ...s, ticketNo: s.ticket_no, customerId: s.customer_id, serviceType: s.service_type, 
          scheduledDate: s.scheduled_date, amcExpiry: s.amc_expiry
        })));
      }

      const { data: eData } = await supabase.from('expenses').select('*').order('id', { ascending: false });
      if (eData) setExpenses(eData);

      const { data: setObj } = await supabase.from('settings').select('*').limit(1).single();
      if (setObj) {
        setSettings({
          companyName: setObj.company_name,
          gstRate: setObj.gst_rate,
          address: setObj.address,
          phone: setObj.phone,
          email: setObj.email
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Only fetch if session exists (user logged in). The App structure ensures this renders when authed, but it's safe to check.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if(session) fetchData();
    });
  }, []);

  // Generic Helpers
  const addItem = async (table, item, payloadModifier = null) => {
    const payload = payloadModifier ? payloadModifier(item) : item;
    const { error } = await supabase.from(table).insert([payload]);
    if (error) { toast.error(error.message); return; }
    toast.success('Successfully added!');
    fetchData();
  };

  const deleteItem = async (table, id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted successfully!');
    fetchData();
  };

  const updateItem = async (table, id, updates) => {
    const { error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Updated successfully!');
    fetchData();
  };

  // Complex Submissions (Quotes / Invoices)
  const addQuote = async (quoteData) => {
    const { items, customerId, quoteNo, date, status, total } = quoteData;
    const { data: insertedQuote, error } = await supabase.from('quotes')
      .insert([{ quote_no: quoteNo, customer_id: customerId, date, status, total }])
      .select().single();
      
    if (error) { toast.error(error.message); return; }
    
    // Insert line items
    const lineItems = items.map(item => ({
      quote_id: insertedQuote.id, product_id: item.productId, qty: Number(item.qty), price: Number(item.price)
    }));
    await supabase.from('quote_items').insert(lineItems);
    
    toast.success('Quote generated!');
    fetchData();
  };

  const addInvoice = async (invoiceData) => {
    const { items, customerId, invoiceNo, date, status, total, paid, balance } = invoiceData;
    const { data: insertedInvoice, error } = await supabase.from('invoices')
      .insert([{ invoice_no: invoiceNo, customer_id: customerId, date, status, total, paid, balance }])
      .select().single();
      
    if (error) { toast.error(error.message); return; }
    
    // Insert line items
    const lineItems = items.map(item => ({
      invoice_id: insertedInvoice.id, product_id: item.productId, qty: Number(item.qty), price: Number(item.price)
    }));
    await supabase.from('invoice_items').insert(lineItems);
    
    toast.success('Invoice generated!');
    fetchData();
  };

  const saveSettings = async (newSettings) => {
    // Optimistic UI update so it instantly persists across navigation
    setSettings(newSettings);
    
    const payload = {
      company_name: newSettings.companyName,
      gst_rate: newSettings.gstRate,
      address: newSettings.address,
      phone: newSettings.phone,
      email: newSettings.email
    };
    const { data: existing } = await supabase.from('settings').select('id').limit(1).single();
    if (existing) {
       await supabase.from('settings').update(payload).eq('id', existing.id);
    } else {
       await supabase.from('settings').insert([payload]);
    }
    fetchData();
    toast.success('Settings saved!');
  };

  const value = {
    customers, 
    addCustomer: (item) => addItem('customers', item), 
    deleteCustomer: (id) => deleteItem('customers', id), 
    updateCustomer: (id, data) => updateItem('customers', id, data),
    
    inventory, 
    addProduct: (item) => addItem('inventory', item), 
    deleteProduct: (id) => deleteItem('inventory', id), 
    updateProduct: (id, data) => updateItem('inventory', id, data),
    
    quotes, 
    addQuote, 
    deleteQuote: (id) => deleteItem('quotes', id), 
    updateQuote: (id, data) => updateItem('quotes', id, data),
    
    invoices, 
    addInvoice, 
    deleteInvoice: (id) => deleteItem('invoices', id), 
    updateInvoice: (id, data) => updateItem('invoices', id, data),
    
    services, 
    addService: (item) => addItem('services', item, (data) => ({
      ticket_no: data.ticketNo, customer_id: data.customerId, service_type: data.serviceType, 
      technician: data.technician, status: data.status, scheduled_date: data.scheduledDate, 
      charges: data.charges, amc_expiry: data.amcExpiry || null
    })), 
    deleteService: (id) => deleteItem('services', id), 
    updateService: (id, data) => updateItem('services', id, data),
    
    expenses, 
    addExpense: (item) => addItem('expenses', item), 
    deleteExpense: (id) => deleteItem('expenses', id), 
    updateExpense: (id, data) => updateItem('expenses', id, data),
    
    settings, 
    setSettings: saveSettings
  };

  return (
    <SupabaseDataContext.Provider value={value}>
      {children}
    </SupabaseDataContext.Provider>
  );
};
