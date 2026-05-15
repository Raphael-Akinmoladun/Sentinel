import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Building2, UserCircle } from 'lucide-react';
import axios from 'axios';

export default function Register() {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        businessName,
        email,
        password,
        role,
      });

      // After registration, send to login
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--accent-gradient)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)' }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Join the future of secure B2B commerce</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.05)', color: 'var(--error)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(220, 38, 38, 0.2)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <button 
              type="button" 
              onClick={() => setRole('buyer')}
              style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid', borderColor: role === 'buyer' ? 'var(--accent-primary)' : 'var(--glass-border)', background: role === 'buyer' ? 'rgba(99, 102, 241, 0.05)' : 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
            >
              <UserCircle size={24} color={role === 'buyer' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: role === 'buyer' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>I am a Buyer</span>
            </button>
            <button 
              type="button" 
              onClick={() => setRole('supplier')}
              style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid', borderColor: role === 'supplier' ? 'var(--accent-primary)' : 'var(--glass-border)', background: role === 'supplier' ? 'rgba(99, 102, 241, 0.05)' : 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
            >
              <Building2 size={24} color={role === 'supplier' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: role === 'supplier' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>I am a Supplier</span>
            </button>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Business Name</label>
            <div style={{ position: 'relative' }}>
              <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Global Electronics Ltd"
                required
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'white', fontSize: '1rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@business.com"
                required
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'white', fontSize: '1rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'white', fontSize: '1rem', outline: 'none' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}>
            {isLoading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : (
              <>
                Create Account
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Log In</Link>
        </div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
