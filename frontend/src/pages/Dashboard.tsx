import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, ShieldCheck, ArrowRight, CheckCircle2, Loader2, Plus, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shipments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShipments(response.data);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchShipments();
  }, [token]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FUNDED':
        return <span className="status-badge status-funded"><ShieldCheck size={14} className="mr-1" style={{marginRight: '4px'}}/> Escrow Active</span>;
      case 'RELEASED':
      case 'VERIFIED':
        return <span className="status-badge status-verified"><CheckCircle2 size={14} className="mr-1" style={{marginRight: '4px'}}/> Verified & Paid</span>;
      case 'PENDING_PAYMENT':
        return <span className="status-badge status-pending"><Clock size={14} className="mr-1" style={{marginRight: '4px'}}/> Awaiting Funds</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 size={48} className="text-gradient" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Orders</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your Escrow shipments and verifications.</p>
        </div>
        {user?.role === 'buyer' && (
          <Link to="/new-order" className="btn-primary" style={{ padding: '0.875rem 1.5rem' }}>
            <Plus size={20} />
            New Order
          </Link>
        )}
      </div>

      {shipments.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Package size={64} style={{ margin: '0 auto 1.5rem auto', opacity: 0.2 }} />
          <h2 style={{ marginBottom: '1rem' }}>No orders found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven't created or received any shipments yet.</p>
          {user?.role === 'buyer' && (
            <Link to="/new-order" className="btn-primary">Create Your First Order</Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {shipments.map(shipment => (
            <div key={shipment._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                  <Package size={24} color="var(--accent-primary)" />
                </div>
                {getStatusBadge(shipment.status)}
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{shipment.productName}</h3>
                    <button 
                        onClick={() => handleCopyId(shipment._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }}
                        title="Copy Shipment ID"
                    >
                        {copiedId === shipment._id ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                        {copiedId === shipment._id ? 'Copied' : 'ID'}
                    </button>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {user?.role === 'buyer' ? `Supplier: ${shipment.supplierId?.businessName}` : `Buyer: ${shipment.buyerId?.businessName}`}
                </p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Amount</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit' }}>₦{shipment.amount.toLocaleString()}</p>
                </div>
                
                {shipment.status === 'FUNDED' && user?.role === 'buyer' ? (
                  <Link to={`/verify/${shipment._id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    Verify Delivery <ArrowRight size={16} />
                  </Link>
                ) : shipment.status === 'PENDING_PAYMENT' && user?.role === 'buyer' ? (
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    onClick={() => navigate('/smart-escrow', { state: { shipmentId: shipment._id } })}
                  >
                    Fund Escrow
                  </button>
                ) : null}

                {shipment.status === 'FUNDED' && user?.role === 'supplier' && (
                   <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Awaiting Verification</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}


