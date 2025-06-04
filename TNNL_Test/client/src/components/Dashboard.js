// import { useEffect, useState} from 'react';
// import axios from '../api';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
// import BNPLCallback from './BNPLCallback';
// import BNPLTable from './BNPLTable';

// const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

// export default function DashboardApp() {
//   const [payments, setPayments] = useState([]);
//   // const [connectedServices, setConnectedServices] = useState([]);
//   const [activeTab, setActiveTab] = useState('All');
//   const [notes, setNotes] = useState({});
//   const [confirmed, setConfirmed] = useState({});
//   const [page, setPage] = useState('dashboard'); 

//   const userId = localStorage.getItem('userId');

//   console.log('userId:', userId);

//   const handleSignOut = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/';
//   };

//   const fetchPayments = async () => {
//     try {
//       const res = await axios.get('/payments');
//       console.log('Fetched payments:', res.data);
//       setPayments(res.data);
//     } catch (err) {
//       alert('Error fetching payments');
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   useEffect(() => {
//     const fetchSavedPurchases = async () => {
//       const token = localStorage.getItem('token');
//       const userEmail = localStorage.getItem('userEmail');

//       if (!userEmail || !token) return;

//       try {
//         const res = await fetch(`http://localhost:5001/api/payments/user/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         // setPurchases(data);
//         setPayments(data);
//       } catch (err) {
//         console.error('Failed to fetch saved purchases', err);
//       }
//     };

//     fetchSavedPurchases();
//   }, []);

//   const getChartData = () => {
//     const summary = {};
//     payments.forEach(p => {
//       summary[p.provider] = (summary[p.provider] || 0) + p.purchaseAmount;
//     });
//     return Object.entries(summary).map(([provider, value]) => ({ name: provider, value }));
//   };

//   const getFilteredPayments = () => {
//     return activeTab === 'All' ? payments : payments.filter(p => p.provider === activeTab);
//   };

//   const getTotalBalance = () => payments.reduce((sum, p) => sum + p.purchaseAmount, 0);
//   const getBalanceDueThisMonth = () => payments.reduce((sum, p) => {
//     const dueDate = new Date(p.firstDueDate);
//     const now = new Date();
//     return (dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear())
//       ? sum + p.purchaseAmount / p.installments
//       : sum;
//   }, 0);

//   const getNextDueDate = () => {
//     const dates = payments.map(p => new Date(p.firstDueDate)).sort((a, b) => a - b);
//     return dates.length ? dates[0].toLocaleDateString() : 'N/A';
//   };

//   // removing data after processing from url
//   const [showBNPLImport, setShowBNPLImport] = useState(() => {
//     const params = new URLSearchParams(window.location.search);
//     return params.has('data');
//   });

//   useEffect(() => {
//     if (showBNPLImport) {
//       const cleanUrl = window.location.origin + window.location.pathname;
//       window.history.replaceState(null, '', cleanUrl);
//       setShowBNPLImport(false); // hide BNPLCallback after cleaning
//     }
//   }, [showBNPLImport]);

//   const uniqueProviders = [...new Set(payments.map(p => p.provider))].filter(Boolean);
 
//   const renderContent = () => {
//     if (page === 'dashboard') {
//       console.log(payments)
//       return (
//         <>
//           <h2>TrackNowNotLater Dashboard</h2>

//           {payments.length > 0 && (
//             <div className="dashboard-container">
//               <PieChart width={400} height={300}>
//                 <Pie
//                   data={getChartData()}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   label
//                 >
//                   {getChartData().map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>

//               <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
//                 <div><strong>Total Owed:</strong> ${getTotalBalance()}</div>
//                 <div><strong>Due This Month:</strong> ${getBalanceDueThisMonth()}</div>
//                 <div><strong>Next Due:</strong> {getNextDueDate()}</div>
//               </div>
//             </div>
//           )}

//           <button
//             onClick={() => { const gmailAuthUrl = `http://localhost:5001/api/gmail/auth/google?userId=${userId}`;
//               window.location.href = gmailAuthUrl; }}
//             style={{
//               marginTop: '1rem',
//               padding: '0.5rem 1rem',
//               borderRadius: '20px',
//               border: 'none',
//               backgroundColor: '#db4437',
//               color: 'white',
//               cursor: 'pointer',
//             }}
//           >
//             Connect Gmail
//           </button>

//           {/* Show Gmail parsed purchases */}
          
//           {showBNPLImport && <BNPLCallback />}

//             <BNPLTable
//               payments={getFilteredPayments()}
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               notes={notes}
//               setNotes={setNotes}
//               confirmed={confirmed}
//               setConfirmed={setConfirmed}
//               BNPL_SERVICES={uniqueProviders}
//             />
//         </>
//       );
//     }
//     if (page === 'bankAccounts') {
//       return <h2>Bank Accounts Page - Connected Accounts here</h2>;
//     }

//     if (page === 'profile') {
//       return <h2>Profile Page - User details and settings</h2>;
//     }

//     return null;
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
//       <nav style={{
//         width: '220px',
//         backgroundColor: '#282c34',
//         color: '#fff',
//         display: 'flex',
//         flexDirection: 'column',
//         padding: '1rem',
//         gap: '1rem'
//       }}>
//         <button
//           onClick={() => setPage('dashboard')}
//           style={{
//             background: 'none',
//             border: 'none',
//             color: page === 'dashboard' ? '#61dafb' : '#fff',
//             fontSize: '1.1rem',
//             textAlign: 'left',
//             cursor: 'pointer'
//           }}
//         >
//           Dashboard
//         </button>
//         <button
//           onClick={() => setPage('bankAccounts')}
//           style={{
//             background: 'none',
//             border: 'none',
//             color: page === 'bankAccounts' ? '#61dafb' : '#fff',
//             fontSize: '1.1rem',
//             textAlign: 'left',
//             cursor: 'pointer'
//           }}
//         >
//           Account Info
//         </button>
//         <button
//           onClick={() => setPage('profile')}
//           style={{
//             background: 'none',
//             border: 'none',
//             color: page === 'profile' ? '#61dafb' : '#fff',
//             fontSize: '1.1rem',
//             textAlign: 'left',
//             cursor: 'pointer'
//         }}
//         >
//           Profile
//         </button>
    
//         <button
//           onClick={handleSignOut}
//           style={{
//             marginTop: 'auto',
//             padding: '0.5rem 1rem',
//             borderRadius: '8px',
//             border: 'none',
//             backgroundColor: '#e55353',
//             color: '#fff',
//             cursor: 'pointer'
//           }}
//         >
//           Sign Out
//         </button>
//       </nav>
    
//       <main style={{ flexGrow: 1, padding: '1.5rem', overflowY: 'auto' }}>
//         {renderContent()}
//       </main>
//     </div>
//   );
// }    
import { useEffect, useState } from 'react';
import axios from '../api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import BNPLCallback from './BNPLCallback';
import BNPLTable from './BNPLTable';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

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

  // Unique providers for tabs plus "All"
  const BNPL_SERVICES = ['All', ...new Set(payments.map(p => p.provider).filter(Boolean))];

  // Filter payments by active tab (provider)
  const filteredPayments = activeTab === 'All'
    ? payments
    : payments.filter(p => p.provider === activeTab);

  // Chart data based on filtered payments
  const getChartData = () => {
  const summary = {};
  payments.forEach(p => {
    const amount = parseFloat(p.totalAmount) || 0;
    if (p.provider) {
      summary[p.provider] = (summary[p.provider] || 0) + amount;
    }
  });
  return Object.entries(summary).map(([provider, value]) => ({ name: provider, value }));
};

const getTotalBalance = () => 
  payments.reduce((sum, p) => sum + (parseFloat(p.totalAmount) || 0), 0);

const getBalanceDueThisMonth = () => {
  const now = new Date();
  return payments.reduce((sum, p) => {
    const dueDate = new Date(p.nextPaymentDate);
    if (
      dueDate.getMonth() === now.getMonth() &&
      dueDate.getFullYear() === now.getFullYear()
    ) {
      return sum + (parseFloat(p.nextPaymentAmount) || 0);
    }
    return sum;
  }, 0);
};

const getNextDueDate = () => {
  const dates = payments
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

          {/* Tabs for filtering providers */}
          {/* <div style={{ marginBottom: '1rem' }}>
            {BNPL_SERVICES.map(service => (
              <button
                key={service}
                onClick={() => setActiveTab(service)}
                style={{
                  marginRight: '0.5rem',
                  padding: '0.3rem 0.7rem',
                  backgroundColor: activeTab === service ? '#61dafb' : '#eee',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: 'pointer',
                }}
              >
                {service}
              </button>
            ))}
          </div> */}

          {filteredPayments.length > 0 ? (
            <>
              {/* Pie Chart */}
              <div
                className="dashboard-container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',   // stack vertically
                  alignItems: 'center',      // center horizontally
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
                    {getChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
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
          {showBNPLImport && <BNPLCallback />}
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
        <button
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
        </button>
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
