import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Registration successful! You can now log in.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Logged in successfully!');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)', alignItems: 'center', justifyContent: 'center' }}>
      <Toaster position="top-right" />
      <div className="card" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img src="/logo.png" alt="Tecnova Solution Logo" style={{ height: '70px', objectFit: 'contain' }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Business Management Portal</p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tecnova.com"
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>{isSignUp ? 'Already have an account?' : 'Need an account?'}</span>{' '}
          <button 
            type="button" 
            style={{ color: 'var(--brand-blue)', fontWeight: 600 }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Register'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6' }}>
        &copy; {new Date().getFullYear()} Tecnova Solution<br/>
        Powered by <a href="https://muhammedsafvan.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-blue)', textDecoration: 'none', fontWeight: 600 }}>Muhammed Safvan</a>
      </div>
    </div>
  );
};

export default Login;
