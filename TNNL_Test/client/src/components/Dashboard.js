import { useEffect, useState } from 'react';
import axios from '../api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import BNPLCallback from './BNPLCallback';
import BNPLTable from './BNPLTable';
import ProfilePage from './ProfilePage';
import { generatePastelColors } from '../utils/ColorGen';

// const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function DashboardApp() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [notes, setNotes] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [page, setPage] = useState('dashboard');
  const [showBNPLImport, setShowBNPLImport] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('data');
  });

  // for refreshing emails for bnpl
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [refreshFlag]);


  const userId = localStorage.getItem('userId');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
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

  useEffect(() => {
    if (showBNPLImport) {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
      setShowBNPLImport(false);
    }
  }, [showBNPLImport]);


  // Filter payments by active tab 
  const filteredPayments = activeTab === 'All'
    ? payments
    : payments.filter(p => p.provider === activeTab);

  // Unique providers for tabs plus "All"
  const BNPL_SERVICES = ['All', ...Array.from(new Set(payments.map(p => p.provider).filter(Boolean)))];
  const COLORS = generatePastelColors(BNPL_SERVICES.length);

  const getTotalBalance = () => {
    const now = new Date();

    return payments.reduce((sum, p) => {
      if (p.status === 'refunded' || p.status === 'completed') {
        return sum;
      }

      let remaining = 0;

      if (Array.isArray(p.paymentDates)) {
        remaining = p.paymentDates.reduce((acc, pay) => {
          const dueDate = new Date(pay.date || pay.paymentDate);
          if (dueDate >= now) {
            return acc + (parseFloat(pay.amount?.toString().replace(/[^0-9.]/g, '')) || 0);
          }
          return acc;
        }, 0);
      } else if (Array.isArray(p.upcomingPayments)) {
        remaining = p.upcomingPayments.reduce((acc, pay) => {
          const dueDate = new Date(pay.date);
          if (dueDate >= now) {
            return acc + (parseFloat(pay.amount?.toString().replace(/[^0-9.]/g, '')) || 0);
          }
          return acc;
        }, 0);
      } else {
        remaining = parseFloat((p.totalAmount || '').toString().replace(/[^0-9.]/g, '')) || 0;
      }

      return sum + remaining;
    }, 0);
  };

  const getChartData = () => {
    const now = new Date();
    const summary = {};

    payments.forEach(p => {
      if (p.status === 'refunded' || p.status === 'completed') {
        return;
      }

      let remaining = 0;

      if (Array.isArray(p.paymentDates)) {
        remaining = p.paymentDates.reduce((acc, pay) => {
          const dueDate = new Date(pay.date || pay.paymentDate); 
          if (dueDate >= now) {
            return acc + (parseFloat(pay.amount?.toString().replace(/[^0-9.]/g, '')) || 0);
          }
          return acc;
        }, 0);
      } else if (Array.isArray(p.upcomingPayments)) {
        remaining = p.upcomingPayments.reduce((acc, pay) => {
          const dueDate = new Date(pay.date);
          if (dueDate >= now) {
            return acc + (parseFloat(pay.amount?.toString().replace(/[^0-9.]/g, '')) || 0);
          }
          return acc;
        }, 0);
      } else {
        remaining = parseFloat((p.totalAmount || '').toString().replace(/[^0-9.]/g, '')) || 0;
      }

      if (p.provider) {
        summary[p.provider] = (summary[p.provider] || 0) + remaining;
      }
    });

    return Object.entries(summary).map(([provider, value]) => ({
      name: provider,
      value: parseFloat(value.toFixed(2))
    }));
  };

  const getBalanceDueThisMonth = () => {
    const now = new Date();

    const totalDue = payments.reduce((sum, p) => {
      if (p.status === 'refunded' || p.status === 'completed') {
        return sum;
      }

      let total = 0;

      if (Array.isArray(p.paymentDates)) {
        for (const payment of p.paymentDates) {
          const dueDate = new Date(payment.date || payment.paymentDate);
          const isSameMonth = dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
          if (isSameMonth && dueDate >= now) {
            const amount = parseFloat(payment.amount?.toString().replace(/[^0-9.]/g, '')) || 0;
            total += amount;
          }
        }
      } else if (Array.isArray(p.upcomingPayments)) {
        for (const payment of p.upcomingPayments) {
          const dueDate = new Date(payment.date);
          const isSameMonth = dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
          if (isSameMonth && dueDate >= now) {
            const amount = parseFloat(payment.amount?.toString().replace(/[^0-9.]/g, '')) || 0;
            total += amount;
          }
        }
      } else if (p.nextPaymentDate) {
        const dueDate = new Date(p.nextPaymentDate);
        const isSameMonth = dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
        if (isSameMonth && dueDate >= now) {
          const amount = parseFloat(p.nextPaymentAmount?.toString().replace(/[^0-9.]/g, '')) || 0;
          total += amount;
        }
      }

      return sum + total;
    }, 0);

    return parseFloat(totalDue.toFixed(2));
  };

  const getNextDueDate = () => {
    const dates = payments
      .filter(p => p.status !== 'refunded' || p.status !== 'completed')
      .map(p => new Date(p.nextPaymentDate))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a - b);
    return dates.length ? dates[0].toLocaleDateString() : 'N/A';
  };

  const renderContent = () => {
    if (page === 'dashboard') {
      console.log('Payments:', payments);
      console.log('Chart Data:', getChartData());
      console.log('Total Balance:', getTotalBalance());
      console.log('Balance Due This Month:', getBalanceDueThisMonth());
      console.log('Next Due Date:', getNextDueDate());

      return (
        <>
          <h2>TrackNowNotLater Dashboard</h2>

          {filteredPayments.length > 0 ? (
            <>
              {/* Pie Chart */}
              <div
                className="dashboard-container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',   
                  alignItems: 'center',   
                  marginBottom: '1rem',
                }}
              >
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
                    {getChartData().map((entry, index) => {
                      const colorIndex = BNPL_SERVICES.slice(1).indexOf(entry.name);
                      const fillColor = COLORS[colorIndex % COLORS.length] || '#8884d8';
                      return <Cell key={`cell-${index}`} fill={fillColor} />;
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>

                {/* Metrics */}
                <div
                  style={{
                    marginTop: '1rem',
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center',
                    width: '100%', 
                    maxWidth: '400px',
                  }}
                >
                  <div><strong>Total Owed:</strong> ${getTotalBalance().toFixed(2)}</div>
                  <div><strong>Due This Month:</strong> ${getBalanceDueThisMonth().toFixed(2)}</div>
                  <div><strong>Next Due:</strong> {getNextDueDate()}</div>
                </div>
              </div>

              {/* Table */}
              <div style={{ marginTop: '2rem' }}>
                <BNPLTable
                  payments={filteredPayments}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  notes={notes}
                  setNotes={setNotes}
                  confirmed={confirmed}
                  setConfirmed={setConfirmed}
                  BNPL_SERVICES={BNPL_SERVICES}
                />
              </div>
            </>
          ) : (
            <p>No payments found for selected provider.</p>
          )}

          {/* Gmail Connect Button */}
          <button
            onClick={() => {
              const gmailAuthUrl = `http://localhost:5001/api/gmail/auth/google?userId=${userId}`;
              window.location.href = gmailAuthUrl;
            }}
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

          {/* Imported Gmail Data */}
          {/* {showBNPLImport && <BNPLCallback />} */}
          {showBNPLImport && <BNPLCallback onImportComplete={() => setRefreshFlag(flag => !flag)} />}
        </>
      );
    }

    // if (page === 'bankAccounts') {
    //   return <h2>Bank Accounts Page - Connected Accounts here</h2>;
    // }

    if (page === 'profile') {
      const userName = localStorage.getItem('fname'); 
    return <ProfilePage userName={userName || 'there'} />;
    }

    return null;
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <nav
        style={{
          width: '220px',
          backgroundColor: '#282c34',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => setPage('dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: page === 'dashboard' ? '#61dafb' : '#fff',
            fontSize: '1.1rem',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          Dashboard
        </button>
        {/* <button
          onClick={() => setPage('bankAccounts')}
          style={{
            background: 'none',
            border: 'none',
            color: page === 'bankAccounts' ? '#61dafb' : '#fff',
            fontSize: '1.1rem',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          Account Info
        </button> */}
        <button
          onClick={() => setPage('profile')}
          style={{
            background: 'none',
            border: 'none',
            color: page === 'profile' ? '#61dafb' : '#fff',
            fontSize: '1.1rem',
            textAlign: 'left',
            cursor: 'pointer',
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
            cursor: 'pointer',
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
