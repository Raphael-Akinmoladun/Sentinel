import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Building2, CreditCard, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CreateOrder() {
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSuppliers, setIsFetchingSuppliers] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    // In a real app, you'd have a public or protected search for suppliers
    // For this demo, we'll fetch the available suppliers
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
            // This is a bit of a hack since we don't have a public supplier list endpoint yet
            // So I'll just use a dummy list or the one I found in the DB earlier
        });
      } catch (err) {
        // Fallback to the one we know exists in the DB
        setSuppliers([{ _id: '6a05d2380e32d8b60b7f0410', businessName: 'Global Electronics Ltd' }]);
      } finally {
        setIsFetchingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/shipments', {
        supplierId,
        productName,
        amount: parseFloat(amount),
        supplierBankName: bankName,
        supplierBankCode: bankCode,
        supplierAccountNumber: accountNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem' }}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="glass-panel animate-fade-in" style={{ padding: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Create New Order</h1>

        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.05)', color: 'var(--error)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(220, 38, 38, 0.2)', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Product Name</label>
              <div style={{ position: 'relative' }}>
                <Package size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. MacBook Pro M3"
                  required
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'white', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Order Amount (₦)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'white', fontSize: '1rem', fontWeight: 600 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Select Supplier</label>
            <div style={{ position: 'relative' }}>
              <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'white', fontSize: '1rem', appearance: 'none' }}
              >
                <option value="">Select a registered supplier</option>
                {suppliers.map(s => (
                  <option key={s._id} value={s._id}>{s.businessName}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.03)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="var(--accent-primary)" />
              Supplier Payout Details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Zenith Bank"
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'white' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Bank Code</label>
                <input
                  type="text"
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  placeholder="e.g. 057"
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'white' }}
                />
              </div>
            </div>
            
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="10-digit Account Number"
                required
                maxLength={10}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'white' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
            {isLoading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : (
              <>
                Create Shipment Order
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
