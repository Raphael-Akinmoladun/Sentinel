import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Building, Lock, LogOut, LogIn } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import VendorTrust from './pages/VendorTrust';
import SmartEscrow from './pages/SmartEscrow';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateOrder from './pages/CreateOrder';
import { AuthProvider, useAuth } from './context/AuthContext';


function NavLinks() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    transition: 'all 0.2s',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    background: isActive(path) ? 'var(--accent-primary)' : 'transparent',
    color: isActive(path) ? 'white' : 'var(--text-secondary)',
  });

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Link to="/" style={linkStyle('/')}>
        <LayoutDashboard size={18} />
        Dashboard
      </Link>
      <Link to="/vendor-trust" style={linkStyle('/vendor-trust')}>
        <Building size={18} />
        Vendor Trust
      </Link>
      <Link to="/smart-escrow" style={linkStyle('/smart-escrow')}>
        <Lock size={18} />
        Smart Escrow
      </Link>
    </div>
  );
}

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '0.5rem', borderRadius: '12px' }}>
            <ShieldCheck size={24} color="white" />
          </div>
          <h2 style={{ margin: 0 }}><span className="text-gradient">Sentinel</span></h2>
        </Link>
        
        <NavLinks />
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '50px', border: '1px solid var(--glass-border)' }}>
              <img src={`https://ui-avatars.com/api/?name=${user?.businessName}&background=6366f1&color=fff`} alt="User" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.businessName}</span>
              <span style={{ fontSize: '0.7rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '10px', textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <LogIn size={16} /> Log In
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          
          <main className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/new-order" element={<CreateOrder />} />
              <Route path="/verify/:shipmentId" element={<Verification />} />
              <Route path="/vendor-trust" element={<VendorTrust />} />
              <Route path="/smart-escrow" element={<SmartEscrow />} />
            </Routes>

          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

