import { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import BNPLCallback from './BNPLCallback';
import BNPLTable from './BNPLTable';

const BNPL_SERVICES = ['Klarna', 'Afterpay', 'Affirm'];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function DashboardApp() {
  const [payments, setPayments] = useState([]);
  const [connectedServices, setConnectedServices] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [notes, setNotes] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [page, setPage] = useState('dashboard'); 
  const userId = localStorage.getItem('userId');
  console.log('userId from localStorage:', userId);

  const handleConnect = async (service) => {
    try {
      if (!connectedServices.includes(service)) {
        setConnectedServices(prev => [...prev, service]);

        // await axios.post(`/gmail/parse?service=${service}`);
        window.location.href = `/gmail/auth/google`;
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

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/payments');
      console.log('Fetched payments:', res.data);
      setPayments(res.data);
    } catch (err) {
      alert('Error fetching payments');
      console.error(err);
    }
  };

  const parseAmount = (amount) => {
  if (!amount) return 0;
  if (typeof amount === 'number') return amount;
  const num = parseFloat(amount.toString().replace(/[$,]/g, ''));
  return isNaN(num) ? 0 : num;
  };

  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  useEffect(() => {
    fetchPayments();
  }, []);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchSavedPurchases = async () => {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');

      if (!userEmail || !token) return;

      try {
        const res = await fetch(`http://localhost:5001/api/payments/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setPurchases(data);
        setPayments(data);
      } catch (err) {
        console.error('Failed to fetch saved purchases', err);
      }
    };

    fetchSavedPurchases();
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

  const params = new URLSearchParams(window.location.search);
  const showBNPLImport = params.has('data');
  const uniqueProviders = [...new Set(payments.map(p => p.provider))].filter(Boolean);

  // Simple placeholder pages for demonstration:
  const renderContent = () => {
    if (page === 'dashboard') {
      console.log(payments)
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
                <div><strong>Total Owed:</strong> ${getTotalBalance()}</div>
                <div><strong>Due This Month:</strong> ${getBalanceDueThisMonth()}</div>
                <div><strong>Next Due:</strong> {getNextDueDate()}</div>
              </div>
            </div>
          )}

          <button
            onClick={() => window.open('http://localhost:5001/api/gmail/auth/google', '_blank')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#db4437',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Connect Gmail
          </button>

          {/* Show Gmail parsed purchases */}
          {/* <BNPLCallback /> */}
          
          {showBNPLImport && <BNPLCallback />}

            <BNPLTable
              payments={getFilteredPayments()}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              notes={notes}
              setNotes={setNotes}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              BNPL_SERVICES={uniqueProviders}
            />

          {/* <h3 style={{ marginTop: '2rem' }}>Purchases</h3>
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
          </div> */}

          {/* <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                const purchaseAmount = parseAmount(p.purchaseAmount);
                const installments = parseInt(p.installments) || 1; // fallback 1 to avoid div by zero
                const paidCount = 1; // update as needed
                const remaining = purchaseAmount - (purchaseAmount / installments * paidCount);
                const firstDueDate = parseDate(p.firstDueDate);

                return (
                  <tr key={p._id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.provider}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{paidCount} of {installments}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>${purchaseAmount.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      {firstDueDate ? firstDueDate.toLocaleDateString() : '—'}
                    </td>
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
          </table> */}
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