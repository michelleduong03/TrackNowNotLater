// import React from 'react';

// const BNPLTable = ({
//   payments,
//   activeTab,
//   setActiveTab,
//   notes,
//   setNotes,
//   confirmed,
//   setConfirmed,
//   BNPL_SERVICES
// }) => {
//   return (
//     <div>
//       <h3 style={{ marginTop: '2rem' }}>Purchases</h3>

//       <div style={{ marginBottom: '1rem' }}>
//         {['All', ...BNPL_SERVICES].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             style={{
//               marginRight: '10px',
//               padding: '0.4rem 1rem',
//               borderRadius: '15px',
//               border: activeTab === tab ? '2px solid #333' : '1px solid #ccc',
//               backgroundColor: activeTab === tab ? '#f0f0f0' : '#fff',
//               fontWeight: activeTab === tab ? 'bold' : 'normal'
//             }}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr style={{ backgroundColor: '#eee' }}>
//             <th>Provider</th>
//             <th>Merchant</th>
//             <th>Total Amount</th>
//             <th>Discount</th>
//             <th>Payment Plan</th>
//             <th>Payment Dates</th>
//             <th>Order Date</th>
//             <th>Next Payment</th>
//             <th>Card Used</th>
//             <th>Note</th>
//             <th>Confirmation</th>
//             {/* <th>Email Snippet</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           {payments.map(p => (
//             <tr key={p._id} style={{ borderBottom: '1px solid #ccc' }}>
//               <td>{p.provider || '—'}</td>
//               <td>{p.merchantName || '—'}</td>
//               <td>{p.totalAmount || '—'}</td>
//               <td>{p.discount || '—'}</td>
//               <td>{p.paymentPlan || '—'}</td>
//               <td>
//                 {Array.isArray(p.paymentDates) && p.paymentDates.length > 0
//                   ? p.paymentDates.map((pd) => (
//                       <div key={pd._id}>
//                         {new Date(pd.date).toLocaleDateString()} – ${pd.amount}
//                       </div>
//                     ))
//                   : '—'}
//               </td>
//               <td>{p.orderDate || '—'}</td>
//               <td>{p.nextPaymentDate ? `${p.nextPaymentDate} (${p.nextPaymentAmount || '—'})` : '—'}</td>
//               <td>{p.cardUsed || '—'}</td>
//               <td>
//                 <input
//                   type="text"
//                   placeholder="Add note"
//                   value={notes[p._id] || ''}
//                   onChange={e => setNotes(prev => ({ ...prev, [p._id]: e.target.value }))}
//                   style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
//                 />
//               </td>
//               <td style={{ textAlign: 'center' }}>
//                 <span
//                   onClick={() => setConfirmed(prev => ({ ...prev, [p._id]: !prev[p._id] }))}
//                   style={{
//                     display: 'inline-block',
//                     width: '20px',
//                     height: '20px',
//                     borderRadius: '50%',
//                     backgroundColor: confirmed[p._id] ? 'green' : 'yellow',
//                     cursor: 'pointer'
//                   }}
//                   title="Click to confirm"
//                 />
//               </td>
//               {/* <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                 {p.snippet ? p.snippet.substring(0, 100) + (p.snippet.length > 100 ? '...' : '') : '—'}
//               </td> */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BNPLTable;
import React from 'react';

const BNPLTable = ({
  payments,
  activeTab,
  setActiveTab,
  notes,
  setNotes,
  confirmed,
  setConfirmed,
  BNPL_SERVICES
}) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h3>🧾 Purchases</h3>

      {/* Tabs */}
      <div style={{ marginBottom: '1rem' }}>
        {[ ...BNPL_SERVICES].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              marginRight: '10px',
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === tab ? '#333' : '#ddd',
              color: activeTab === tab ? '#fff' : '#333',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '2px solid #ccc', paddingBottom: '8px' }}>
        <div style={{ flex: 7 }}>Purchase Info</div>
        <div style={{ flex: 3 }}>Payment Dates</div>
      </div>

      {/* Each row */}
      {payments.map((p, idx) => (
        <div
          key={p._id}
          style={{
            display: 'flex',
            padding: '1rem 0',
            borderBottom: '1px solid #eee',
            backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa',
            alignItems: 'flex-start'
          }}
        >
          {/* Purchase info (left) */}
          <div style={{ flex: 7, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            <div><strong>Provider:</strong> {p.provider || '—'}</div>
            <div><strong>Merchant:</strong> {p.merchantName || '—'}</div>
            <div><strong>Plan:</strong> {p.paymentPlan || '—'}</div>
            {/* <div><strong>Order Date:</strong> {p.orderDate || '—'}</div> */}
            <div><strong>Order Date:</strong> {p.orderDate ? formatDate(p.orderDate) : '—'}</div>
            <div><strong>Next:</strong> {p.nextPaymentDate ? `${formatDate(p.nextPaymentDate)} ($${p.nextPaymentAmount})` : '—'}</div>
            <div>
              <input
                type="text"
                placeholder="Add note"
                value={notes[p._id] || ''}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [p._id]: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '5px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Payment bubbles (right) */}
          <div style={{ flex: 3, paddingLeft: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Array.isArray(p.paymentDates) && p.paymentDates.length > 0 ? (
              p.paymentDates.map((pd) => (
                <div
                  key={pd._id}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    backgroundColor: '#e1f5fe',
                    border: '1px solid #81d4fa',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {formatDate(pd.date)} — ${pd.amount}
                </div>
              ))
            ) : (
              <span style={{ color: '#aaa' }}>No payments</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BNPLTable;
