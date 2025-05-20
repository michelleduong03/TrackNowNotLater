import { useEffect, useState } from 'react';

const BNPLCallback = () => {
  const [gmailPurchases, setGmailPurchases] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');

    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setGmailPurchases(parsed);

        // Clean up the URL after parsing
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (err) {
        console.error('Failed to parse Gmail data', err);
      }
    }
  }, []);

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
