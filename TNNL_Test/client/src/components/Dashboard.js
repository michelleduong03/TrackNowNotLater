import { useEffect, useState } from 'react';
import axios from '../api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import BNPLCallback from './BNPLCallback';
import BNPLTable from './BNPLTable';
import ProfilePage from './ProfilePage';
import { generatePastelColors } from '../utils/ColorGen';
import InfoToolTip from './InfoToolTip';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';

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

  const [hoveredNavItem, setHoveredNavItem] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('importGmail') === 'true') {
      const userId = localStorage.getItem('userId');
      const gmailAuthUrl = `http://localhost:5001/api/gmail/auth/google?userId=${userId}`;
      window.location.href = gmailAuthUrl;
    }
  }, []);

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

  const filteredPayments = activeTab === 'All'
    ? payments
    : payments.filter(p => p.provider === activeTab);

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
      } else if (p.nextPaymentDate && new Date(p.nextPaymentDate) >= now) {
        remaining = parseFloat(p.nextPaymentAmount?.toString().replace(/[^0-9.]/g, '')) || 0;
      } else if (p.totalAmount) {
        remaining = parseFloat(p.totalAmount.toString().replace(/[^0-9.]/g, '')) || 0;
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
      } else if (p.nextPaymentDate && new Date(p.nextPaymentDate) >= now) {
        remaining = parseFloat(p.nextPaymentAmount?.toString().replace(/[^0-9.]/g, '')) || 0;
      } else if (p.totalAmount) {
        remaining = parseFloat(p.totalAmount.toString().replace(/[^0-9.]/g, '')) || 0;
      }

      if (p.provider && remaining > 0) {
        summary[p.provider] = (summary[p.provider] || 0) + remaining;
      }
    });

    return Object.entries(summary).map(([provider, value]) => ({
      name: provider,
      value: parseFloat(value.toFixed(2))
    })).filter(data => data.value > 0);
  };

  const getDueThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalDue = 0;

    payments.forEach(p => {
      if (p.status === 'refunded' || p.status === 'completed') {
        return;
      }

      if (Array.isArray(p.paymentDates)) {
        for (const payment of p.paymentDates) {
          const dueDate = new Date(payment.date || payment.paymentDate);
          const isSameMonth = dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
          if (isSameMonth && dueDate >= now) {
            const amount = parseFloat(payment.amount?.toString().replace(/[^0-9.]/g, '')) || 0;
            totalDue += amount;
          }
        }
      } else if (Array.isArray(p.upcomingPayments)) {
        for (const payment of p.upcomingPayments) {
          const dueDate = new Date(payment.date);
          const isSameMonth = dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
          if (isSameMonth && dueDate >= now) {
            const amount = parseFloat(payment.amount?.toString().replace(/[^0-9.]/g, '')) || 0;
            totalDue += amount;
          }
        }
      } else if (p.nextPaymentDate) {
        const dueDate = new Date(p.nextPaymentDate);
        const isSameMonth = dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
        if (isSameMonth && dueDate >= now) {
          const amount = parseFloat(p.nextPaymentAmount?.toString().replace(/[^0-9.]/g, '')) || 0;
          totalDue += amount;
        }
      }
    });

    return parseFloat(totalDue.toFixed(2));
  };

  const getNextDueDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = [];

    payments.forEach(p => {
      if (p.status === 'refunded' || p.status === 'completed') {
        return;
      }

      if (Array.isArray(p.paymentDates)) {
        p.paymentDates.forEach(pay => {
          const dueDate = new Date(pay.date || pay.paymentDate);
          if (!isNaN(dueDate.getTime()) && dueDate >= today) {
            dates.push(dueDate);
          }
        });
      } else if (Array.isArray(p.upcomingPayments)) {
        p.upcomingPayments.forEach(pay => {
          const dueDate = new Date(pay.date);
          if (!isNaN(dueDate.getTime()) && dueDate >= today) {
            dates.push(dueDate);
          }
        });
      } else if (p.nextPaymentDate) {
        const dueDate = new Date(p.nextPaymentDate);
        if (!isNaN(dueDate.getTime()) && dueDate >= today) {
          dates.push(dueDate);
        }
      }
    });

    if (dates.length === 0) {
      return 'N/A';
    }

    dates.sort((a, b) => a - b);
    return dates[0].toLocaleDateString();
  };

  const getTotalTransactions = () => {
    let count = 0;
    payments.forEach(p => {
      if (Array.isArray(p.paymentDates)) {
        count += p.paymentDates.length;
      } else if (Array.isArray(p.upcomingPayments)) {
        count += p.upcomingPayments.length;
      } else if (p.totalAmount) {
        count += 1;
      }
    });
    return count;
  };

  const getTotalOverallSpending = () => {
    const now = new Date();
    let total = 0;

    payments.forEach(p => {
      if (Array.isArray(p.paymentDates)) {
        total += p.paymentDates.reduce((sum, pay) => {
          const dueDate = new Date(pay.date || pay.paymentDate);
          if (dueDate < now || p.status === 'completed' || p.status === 'refunded') {
            return sum + (parseFloat(pay.amount?.toString().replace(/[^0-9.]/g, '')) || 0);
          }
          return sum;
        }, 0);
      } else if (Array.isArray(p.upcomingPayments)) {
        total += p.upcomingPayments.reduce((sum, pay) => {
          const dueDate = new Date(pay.date);
          if (dueDate < now || p.status === 'completed' || p.status === 'refunded') {
            return sum + (parseFloat(pay.amount?.toString().replace(/[^0-9.]/g, '')) || 0);
          }
          return sum;
        }, 0);
      } else if (p.totalAmount && (p.status === 'completed' || p.status === 'refunded')) {
        total += parseFloat(p.totalAmount.toString().replace(/[^0-9.]/g, '')) || 0;
      } else if (p.nextPaymentDate && new Date(p.nextPaymentDate) < now && p.nextPaymentAmount) {
        total += parseFloat(p.nextPaymentAmount.toString().replace(/[^0-9.]/g, '')) || 0;
      }
    });
    return parseFloat(total.toFixed(2));
  };


  const renderContent = () => {
    if (page === 'dashboard') {
      const totalOwed = getTotalBalance();
      const nextDue = getNextDueDate();
      const dueThisMonth = getDueThisMonth();
      const totalTransactions = getTotalTransactions();
      const totalOverallSpending = getTotalOverallSpending();

      return (
        <>
          <InfoToolTip />

          <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
            <button
              onClick={() => {
                const gmailAuthUrl = `http://localhost:5001/api/gmail/auth/google?userId=${userId}`;
                window.location.href = gmailAuthUrl;
              }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#3498db',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                boxShadow: '0 3px 6px rgba(52, 152, 219, 0.15)',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              Connect Gmail
            </button>
          </div>

          {filteredPayments.length > 0 && (
            <div
              className="dashboard-container"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #eef7fa 0%, #ffffff 100%)',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e0e6eb',
                maxWidth: '900px',
                margin: '1.5rem auto',
              }}
            >
              <h2 style={{ marginBottom: '1.2rem', color: '#2c3e50', fontSize: '2rem', fontWeight: 'bold', letterSpacing: '-0.03em' }}>
                Total Owed: <span style={{ color: '#2563eb' }}>${totalOwed.toFixed(2)}</span>
              </h2>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%', gap: '2.5rem' }}>
                <div style={{ flexShrink: 0, padding: '1rem', borderRadius: '12px', background: '#ffffff', boxShadow: '0 5px 15px rgba(0,0,0,0.06)' }}>
                  <PieChart width={450} height={250}>
                    <Pie
                      data={getChartData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {getChartData().map((entry, index) => {
                        const colorIndex = BNPL_SERVICES.slice(1).indexOf(entry.name);
                        const fillColor = COLORS[colorIndex % COLORS.length] || '#8884d8';
                        return <Cell key={`cell-${index}`} fill={fillColor} />;
                      })}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${value.toFixed(2)}`}
                      contentStyle={{
                        borderRadius: '6px',
                        border: 'none',
                        boxShadow: '0 1px 8px rgba(0,0,0,0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        padding: '8px',
                        fontSize: '0.85rem'
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#333' }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: '10px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                  </PieChart>
                </div>

                <div
                  style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.06)',
                    minWidth: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: '1px solid #e0e6eb',
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.5rem', fontWeight: '700', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.8rem' }}>Financial Overview</h3>
                  <div style={{ marginBottom: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', padding: '0.3rem 0' }}>
                    <span style={{ color: '#555' }}>Next Due:</span> <span style={{ fontWeight: '600', color: '#2563eb' }}>{nextDue}</span>
                  </div>
                  <div style={{ marginBottom: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', padding: '0.3rem 0' }}>
                    <span style={{ color: '#555' }}>Due This Month:</span> <span style={{ fontWeight: '600', color: '#2563eb' }}>${dueThisMonth.toFixed(2)}</span>
                  </div>
                  <div style={{ marginBottom: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', padding: '0.3rem 0' }}>
                    <span style={{ color: '#555' }}>Total Transactions:</span> <span style={{ fontWeight: '600', color: '#2563eb' }}>{totalTransactions}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', padding: '0.3rem 0' }}>
                    <span style={{ color: '#555' }}>Total Spending:</span> <span style={{ fontWeight: '600', color: '#2563eb' }}>${totalOverallSpending.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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

          {showBNPLImport && <BNPLCallback onImportComplete={() => setRefreshFlag(flag => !flag)} />}
        </>
      );
    }

    if (page === 'profile') {
      const userName = localStorage.getItem('fname');
      return <ProfilePage userName={userName || 'there'} />;
    }

    // if (page === 'privacy policy') {
    //   return <PrivacyPolicy />;
    // }

    // if (page === 'terms of use') {
    //   return <TermsOfUse />;
    // }

    return null;
  };

  const baseNavItemStyle = {
    fontSize: '1rem',
    textAlign: 'left',
    padding: '0.6rem 0.8rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
    color: '#ecf0f1',
  };

  const navItemHoverStyle = {
    backgroundColor: '#4a657e',
    color: '#f8f9fa',
  };

  const navItemActiveStyle = {
    color: '#61dafb',
    backgroundColor: '#4a657e',
    fontWeight: '600',
  };

  const signOutButtonStyle = {
    marginTop: 'auto',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 3px 6px rgba(231, 76, 60, 0.15)',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
    boxSizing: 'border-box',
  };

  const signOutHoverStyle = {
    backgroundColor: '#c0392b',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(231, 76, 60, 0.25)',
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f8f9fa',
      }}
    >
      <nav
        style={{
          width: '300px',
          minWidth: '300px',
          maxWidth: '300px',
          backgroundColor: '#34495e',
          color: '#ecf0f1',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          gap: '0.8rem',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          overflowX: 'hidden',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #4a657e' }}>
          {/* No "WealthWatch" text here */}
        </div>

        <div
          onClick={() => setPage('dashboard')}
          onMouseEnter={() => setHoveredNavItem('dashboard')}
          onMouseLeave={() => setHoveredNavItem(null)}
          style={{
            ...baseNavItemStyle,
            ...(page === 'dashboard' ? navItemActiveStyle : {}),
            ...(hoveredNavItem === 'dashboard' && page !== 'dashboard' ? navItemHoverStyle : {})
          }}
        >
          Dashboard
        </div>

        <div
          onClick={() => setPage('profile')}
          onMouseEnter={() => setHoveredNavItem('profile')}
          onMouseLeave={() => setHoveredNavItem(null)}
          style={{
            ...baseNavItemStyle,
            ...(page === 'profile' ? navItemActiveStyle : {}),
            ...(hoveredNavItem === 'profile' && page !== 'profile' ? navItemHoverStyle : {})
          }}
        >
          Profile
        </div>

        {/* <div
          onClick={() => setPage('privacy policy')}
          onMouseEnter={() => setHoveredNavItem('privacy policy')}
          onMouseLeave={() => setHoveredNavItem(null)}
          style={{
            ...baseNavItemStyle,
            ...(page === 'privacy policy' ? navItemActiveStyle : {}),
            ...(hoveredNavItem === 'privacy policy' && page !== 'privacy policy' ? navItemHoverStyle : {})
          }}
        >
          Privacy Policy
        </div>

        <div
          onClick={() => setPage('terms of use')}
          onMouseEnter={() => setHoveredNavItem('terms of use')}
          onMouseLeave={() => setHoveredNavItem(null)}
          style={{
            ...baseNavItemStyle,
            ...(page === 'terms of use' ? navItemActiveStyle : {}),
            ...(hoveredNavItem === 'terms of use' && page !== 'terms of use' ? navItemHoverStyle : {})
          }}
        >
          Terms of Use
        </div> */}

        <button
          onClick={handleSignOut}
          onMouseEnter={() => setHoveredNavItem('signOut')}
          onMouseLeave={() => setHoveredNavItem(null)}
          style={{
            ...signOutButtonStyle,
            ...(hoveredNavItem === 'signOut' ? signOutHoverStyle : {})
          }}
        >
          Sign Out
        </button>
      </nav>

      <main style={{ flexGrow: 1, padding: '1.5rem 2rem', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
        {renderContent()}
      </main>
    </div>
  );
}