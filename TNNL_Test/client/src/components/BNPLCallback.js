// import { useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';

// const BNPLCallback = () => {
//   const [gmailPurchases, setGmailPurchases] = useState([]);
//   const token = localStorage.getItem('token');
//   const decoded = token ? jwtDecode(token) : null;
//   const userId = decoded?.id;
//   const storageKey = `gmailData_${userId}`;
//   const processedKey = `gmailProcessed_${userId}`;

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const dataParam = params.get('data');

//     // const processedKey = `gmailProcessed_${userId}`;
//     const alreadyProcessed = sessionStorage.getItem(processedKey);

//     if (dataParam && !alreadyProcessed) {
//       (async () => {
//         try {
//           const parsed = JSON.parse(decodeURIComponent(dataParam));

//           await Promise.all(parsed.map(purchase =>
//             fetch('http://localhost:5001/api/payments', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//               },
//               body: JSON.stringify(purchase),
//             })
//           ));

//           setGmailPurchases(parsed);
//           localStorage.setItem(storageKey, JSON.stringify(parsed));
//           sessionStorage.setItem(processedKey, 'true');

//           const cleanUrl = window.location.origin + window.location.pathname;
//           window.history.replaceState({}, document.title, cleanUrl);
//         } catch (err) {
//           console.error('Failed to parse or save Gmail data', err);
//         }
//       })();
//     }
//   }, [storageKey, token, userId]);

//   // Optionally handle Gmail import on first visit
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const dataParam = params.get('data');

//     if (dataParam && token) {
//       (async () => {
//         try {
//           const parsed = JSON.parse(decodeURIComponent(dataParam));

//           await Promise.all(parsed.map(purchase =>
//             fetch('http://localhost:5001/api/payments', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//               },
//               body: JSON.stringify(purchase),
//             })
//           ));

//           // Refresh data from DB after insert
//           const res = await fetch('http://localhost:5001/api/payments', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           const refreshed = await res.json();
//           console.log('Fetched payments:', refreshed);
//           setGmailPurchases(refreshed);

//           // Clean URL
//           const cleanUrl = window.location.origin + window.location.pathname;
//           window.history.replaceState({}, document.title, cleanUrl);
//         } catch (err) {
//           console.error('Failed to process Gmail import', err);
//         }
//       })();
//     }
//   }, [token]);

//   if (gmailPurchases.length === 0) return null;

//   return (
//     <div>
//       <h2>Imported from Gmail</h2>
//       <div style={{ display: 'grid', gap: '1rem' }}>
//         {gmailPurchases.map((purchase, index) => (
//           <div
//             key={index}
//             style={{
//               border: '1px solid #ccc',
//               padding: '1rem',
//               borderRadius: '10px',
//               backgroundColor: '#f9f9f9',
//             }}
//           >
//             <strong>{purchase.merchantName || 'Unknown Merchant'}</strong>
//             <p><b>Provider:</b> {purchase.provider}</p>
//             <p><b>Order Date:</b> {purchase.orderDate}</p>
//             <p><b>Payment Plan:</b> {purchase.paymentPlan}</p>
//             <p><b>Total:</b> {purchase.totalAmount}</p>
//             <p><b>Installment:</b> {purchase.installmentAmount}</p>
//             <p><b>Next Payment:</b> {purchase.nextPaymentDate} — {purchase.nextPaymentAmount}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BNPLCallback;
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const BNPLCallback = () => {
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id;
  const processedKey = `gmailProcessed_${userId}`;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    const alreadyProcessed = sessionStorage.getItem(processedKey);

    if (dataParam && !alreadyProcessed) {
      (async () => {
        try {
          const parsed = JSON.parse(decodeURIComponent(dataParam));

          await Promise.all(parsed.map(purchase =>
            fetch('http://localhost:5001/api/payments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              // body: JSON.stringify(purchase),
              body: JSON.stringify({ userId, ...purchase }),
            })
          ));

          sessionStorage.setItem(processedKey, 'true');

          // Optional: redirect user to dashboard after import
          window.location.href = '/dashboard';
        } catch (err) {
          console.error('Failed to process Gmail import', err);
        }
      })();
    }
  }, [token, userId, processedKey]);

  return <p>Processing Gmail data...</p>;
};

export default BNPLCallback;
