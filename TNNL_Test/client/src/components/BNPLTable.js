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
//   const groupedPayments = (() => {
//   const groups = {};

//   payments.forEach(p => {
//     const id = p.klarnaOrderId !== 'Unknown' ? p.klarnaOrderId : p.merchantOrder;

//     if (!groups[id]) {
//       groups[id] = {
//         id,
//         paymentDates: p.paymentDates?.length ? p.paymentDates : [],
//         entries: []
//       };
//     }

//     groups[id].entries.push(p);

//     if (p.paymentDates?.length) {
//       groups[id].paymentDates = p.paymentDates;
//     }
//   });

//   return Object.values(groups);
// })();

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
//             <th>Email Snippet</th>
//           </tr>
//         </thead>
//         <tbody>
//           {groupedPayments.map(group => (
//   group.entries.map((p, idx) => (
//     <tr key={`${group.id}-${idx}`} style={{ borderBottom: '1px solid #ccc' }}>
//       <td>{p.provider || '—'}</td>
//       <td>{p.merchantName || '—'}</td>
//       <td>{p.totalAmount || '—'}</td>
//       <td>{p.discount || '—'}</td>
//       <td>{p.paymentPlan || '—'}</td>
//       {/* Show dates only for the first row in the group */}
//       <td>
//         {idx === 0 && group.paymentDates.length > 0 ? (
//           <ul style={{ margin: 0, paddingLeft: '1em' }}>
//             {group.paymentDates.map((d, i) => (
//               <li key={i}>{new Date(d.date).toLocaleDateString()} - ${d.amount}</li>
//             ))}
//           </ul>
//         ) : '—'}
//       </td>
//       <td>{p.orderDate || '—'}</td>
//       <td>{p.nextPaymentDate ? `${p.nextPaymentDate} (${p.nextPaymentAmount || '—'})` : '—'}</td>
//       <td>{p.cardUsed || '—'}</td>
//       <td>
//         <input
//           type="text"
//           placeholder="Add note"
//           value={notes[p._id] || ''}
//           onChange={e => setNotes(prev => ({ ...prev, [p._id]: e.target.value }))}
//           style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
//         />
//       </td>
//       <td style={{ textAlign: 'center' }}>
//         <span
//           onClick={() => setConfirmed(prev => ({ ...prev, [p._id]: !prev[p._id] }))}
//           style={{
//             display: 'inline-block',
//             width: '20px',
//             height: '20px',
//             borderRadius: '50%',
//             backgroundColor: confirmed[p._id] ? 'green' : 'yellow',
//             cursor: 'pointer'
//           }}
//           title="Click to confirm"
//         />
//       </td>
//       <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//         {p.snippet ? p.snippet.substring(0, 100) + (p.snippet.length > 100 ? '...' : '') : '—'}
//       </td>
//     </tr>
//   ))
// ))}

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
  return (
    <div>
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
            <th>Provider</th>
            <th>Merchant</th>
            <th>Total Amount</th>
            <th>Discount</th>
            <th>Payment Plan</th>
            <th>Payment Dates</th>
            <th>Order Date</th>
            <th>Next Payment</th>
            <th>Card Used</th>
            <th>Note</th>
            <th>Confirmation</th>
            <th>Email Snippet</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p._id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>{p.provider || '—'}</td>
              <td>{p.merchantName || '—'}</td>
              <td>{p.totalAmount || '—'}</td>
              <td>{p.discount || '—'}</td>
              <td>{p.paymentPlan || '—'}</td>
              <td>
                {Array.isArray(p.paymentDates) && p.paymentDates.length > 0
                  ? p.paymentDates.map((pd) => (
                      <div key={pd._id}>
                        {new Date(pd.date).toLocaleDateString()} – ${pd.amount}
                      </div>
                    ))
                  : '—'}
              </td>
              <td>{p.orderDate || '—'}</td>
              <td>{p.nextPaymentDate ? `${p.nextPaymentDate} (${p.nextPaymentAmount || '—'})` : '—'}</td>
              <td>{p.cardUsed || '—'}</td>
              <td>
                <input
                  type="text"
                  placeholder="Add note"
                  value={notes[p._id] || ''}
                  onChange={e => setNotes(prev => ({ ...prev, [p._id]: e.target.value }))}
                  style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </td>
              <td style={{ textAlign: 'center' }}>
                <span
                  onClick={() => setConfirmed(prev => ({ ...prev, [p._id]: !prev[p._id] }))}
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: confirmed[p._id] ? 'green' : 'yellow',
                    cursor: 'pointer'
                  }}
                  title="Click to confirm"
                />
              </td>
              <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.snippet ? p.snippet.substring(0, 100) + (p.snippet.length > 100 ? '...' : '') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BNPLTable;