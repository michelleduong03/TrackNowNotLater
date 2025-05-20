import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const BNPLCallback = () => {
  const token = localStorage.getItem('token');
  let userId = 'guest';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || 'guest';
    } catch (e) {
      console.error('Failed to decode token', e);
    }
  }

  const storageKey = `gmailPurchases_${userId}`;

  const [gmailPurchases, setGmailPurchases] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');

    if (dataParam) {
      (async () => {
        try {
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          // Use token to authenticate API requests
          await Promise.all(parsed.map(purchase =>
            fetch('http://localhost:5001/api/payments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(purchase),
            })
          ));

          setGmailPurchases(parsed);
          localStorage.setItem(storageKey, JSON.stringify(parsed));

          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (err) {
          console.error('Failed to parse or save Gmail data', err);
        }
      })();
    }
  }, [storageKey, token]);

  useEffect(() => {
    if (gmailPurchases.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(gmailPurchases));
    }
  }, [gmailPurchases, storageKey]);

  if (gmailPurchases.length === 0) return null;

  return (
    <div>
      <h2>Imported from Gmail</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {gmailPurchases.map((purchase, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <strong>{purchase.merchantName || 'Unknown Merchant'}</strong>
            <p><b>Order Date:</b> {purchase.orderDate}</p>
            <p><b>Payment Plan:</b> {purchase.paymentPlan}</p>
            <p><b>Total:</b> {purchase.totalAmount}</p>
            <p><b>Installment:</b> {purchase.installmentAmount}</p>
            <p><b>Next Payment:</b> {purchase.nextPaymentDate} — {purchase.nextPaymentAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BNPLCallback;
