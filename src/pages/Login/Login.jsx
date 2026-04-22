import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/';
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.href = '/';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isForgotPassword) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent! Check your inbox.');
        setIsForgotPassword(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-app)', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <Toaster position="top-right" />
      
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="Tecnova Solution Logo" style={{ maxWidth: '100%', maxHeight: '60px', marginBottom: '1.5rem', objectFit: 'contain' }} />
          <h2 style={{ color: 'var(--brand-blue)', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.02em' }}>Business Management Portal</h2>
        </div>

        <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group mb-0">
            <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@tecnova.com"
            />
          </div>
          
          {!isForgotPassword && (
            <div className="form-group mb-0">
              <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required={!isForgotPassword}
                placeholder="••••••••"
              />
            </div>
          )}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => setIsForgotPassword(!isForgotPassword)}
            style={{ background: 'none', border: 'none', color: 'var(--brand-blue)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}
          >
            {isForgotPassword ? 'Back to Sign In' : 'Forgot password?'}
          </button>
        </div>
        
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6' }}>
          &copy; {new Date().getFullYear()} Tecnova Solution. All rights reserved.<br/>
          Powered by <a href="https://muhammedsafvan.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-blue)', textDecoration: 'none', fontWeight: 600 }}>Muhammed Safvan</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
