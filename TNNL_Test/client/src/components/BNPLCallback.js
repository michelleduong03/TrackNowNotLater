import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const BNPLCallback = ({ 
  payments, activeTab, setActiveTab, notes, setNotes, confirmed, setConfirmed 
}) => {
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

  return (
    <div>
      <h3>Purchases</h3>
      {/* Table rendering like before, using props */}
    </div>
  );
};

export default BNPLCallback;
