import { useEffect, useState } from 'react';
import axios from '../api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const BNPL_SERVICES = ['Klarna', 'Afterpay', 'Affirm'];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function DashboardApp() {
  const [payments, setPayments] = useState([]);
  const [connectedServices, setConnectedServices] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [notes, setNotes] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [page, setPage] = useState('dashboard'); 

  const handleConnect = async (service) => {
    try {
      if (!connectedServices.includes(service)) {
        setConnectedServices(prev => [...prev, service]);

        const mockPurchases = getMockPurchases(service);
        await Promise.all(mockPurchases.map(p => axios.post('/payments', p)));
        fetchPayments();
      }
    } catch (err) {
      alert(`Failed to connect to ${service}`);
      console.error(err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const getMockPurchases = (service) => {
    const mockData = {
      Klarna: [{
        provider: 'Klarna', purchaseAmount: 120, installments: 4,
        firstDueDate: '2025-06-01', description: 'Sneakers from Klarna'
      }],
      Afterpay: [{
        provider: 'Afterpay', purchaseAmount: 80, installments: 4,
        firstDueDate: '2025-06-05', description: 'Headphones from Afterpay'
      }],
      Affirm: [{
        provider: 'Affirm', purchaseAmount: 200, installments: 6,
        firstDueDate: '2025-06-10', description: 'Monitor from Affirm'
      }]
    };
    return mockData[service] || [];
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/payments');
      setPayments(res.data);
    } catch (err) {
      alert('Error fetching payments');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getChartData = () => {
    const summary = {};
    payments.forEach(p => {
      summary[p.provider] = (summary[p.provider] || 0) + p.purchaseAmount;
    });
    return Object.entries(summary).map(([provider, value]) => ({ name: provider, value }));
  };

  const getFilteredPayments = () => {
    return activeTab === 'All' ? payments : payments.filter(p => p.provider === activeTab);
  };

  const getTotalBalance = () => payments.reduce((sum, p) => sum + p.purchaseAmount, 0);
  const getBalanceDueThisMonth = () => payments.reduce((sum, p) => {
    const dueDate = new Date(p.firstDueDate);
    const now = new Date();
    return (dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear())
      ? sum + p.purchaseAmount / p.installments
      : sum;
  }, 0);
  const getNextDueDate = () => {
    const dates = payments.map(p => new Date(p.firstDueDate)).sort((a, b) => a - b);
    return dates.length ? dates[0].toLocaleDateString() : 'N/A';
  };

  // Simple placeholder pages for demonstration:
  const renderContent = () => {
    if (page === 'dashboard') {
      return (
        <>
          <h2>TrackNowNotLater Dashboard</h2>

          {payments.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PieChart width={400} height={300}>
                <Pie
                  data={getChartData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {getChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                <div><strong>Total Owed:</strong> ${getTotalBalance().toFixed(2)}</div>
                <div><strong>Due This Month:</strong> ${getBalanceDueThisMonth().toFixed(2)}</div>
                <div><strong>Next Due:</strong> {getNextDueDate()}</div>
              </div>
            </div>
          )}

          <h3 style={{ marginTop: '2rem' }}>Connect Your BNPL Services</h3>
          {BNPL_SERVICES.map(service => (
            <button
              key={service}
              onClick={() => handleConnect(service)}
              disabled={connectedServices.includes(service)}
              style={{
                marginRight: '10px',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: connectedServices.includes(service) ? '#d3f9d8' : '#bee3f8',
                cursor: connectedServices.includes(service) ? 'default' : 'pointer'
              }}
            >
              {connectedServices.includes(service) ? `${service} Connected` : `Connect ${service}`}
            </button>
          ))}

          <h3 style={{ marginTop: '2rem' }}>Purchases</h3>
          <div style={{ marginBottom: '1rem' }}>
            {['All', ...BNPL_SERVICES].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  marginRight: '10px',
                  padding: '0.4rem 1rem',
                  borderRadius: '15px',
                  border: activeTab === tab ? '2px solid #333' : '1px solid #ccc',
                  backgroundColor: activeTab === tab ? '#f0f0f0' : '#fff',
                  fontWeight: activeTab === tab ? 'bold' : 'normal'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Provider</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Installments</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Amount</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Next Due Date</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Billing Cycle</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total Remaining</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Note</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Confirmation</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredPayments().map(p => {
                const paidCount = 1; // update as needed
                const remaining = p.purchaseAmount - (p.purchaseAmount / p.installments * paidCount);

                return (
                  <tr key={p._id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.provider}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{paidCount} of {p.installments}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>${p.purchaseAmount.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{new Date(p.firstDueDate).toLocaleDateString()}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>Every 2 weeks</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>${remaining.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      <input
                        type="text"
                        placeholder="..."
                        value={notes[p._id] || ''}
                        onChange={e => setNotes(prev => ({ ...prev, [p._id]: e.target.value }))}
                        style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                      <span
                        onClick={() => setConfirmed(prev => ({ ...prev, [p._id]: !prev[p._id] }))}
                        style={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: confirmed[p._id] ? 'green' : 'yellow',
                          cursor: 'pointer',
                          margin: '0 auto'
                        }}
                        title="Click to confirm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      );
    }

    if (page === 'bankAccounts') {
      return <h2>Bank Accounts Page - Connected Accounts here</h2>;
    }

    if (page === 'profile') {
      return <h2>Profile Page - User details and settings</h2>;
    }

    return null;
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{
        width: '220px',
        backgroundColor: '#282c34',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        gap: '1rem'
      }}>
        <button
          onClick={() => setPage('dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: page === 'dashboard' ? '#61dafb' : '#fff',
            fontSize: '1.1rem',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setPage('bankAccounts')}
          style={{
            background: 'none',
            border: 'none',
            color: page === 'bankAccounts' ? '#61dafb' : '#fff',
            fontSize: '1.1rem',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          Bank Accounts
        </button>
        <button
          onClick={() => setPage('profile')}
          style={{
            background: 'none',
            border: 'none',
            color: page === 'profile' ? '#61dafb' : '#fff',
            fontSize: '1.1rem',
            textAlign: 'left',
            cursor: 'pointer'
        }}
        >
          Profile
        </button>
    
        <button
          onClick={handleSignOut}
          style={{
            marginTop: 'auto',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#e55353',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </nav>
    
      <main style={{ flexGrow: 1, padding: '1.5rem', overflowY: 'auto' }}>
        {renderContent()}
      </main>
    </div>
  );
}    