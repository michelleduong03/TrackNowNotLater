import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const BNPLCallback = ({ 
  payments, activeTab, setActiveTab, notes, setNotes, confirmed, setConfirmed 
}) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  console.log (`user id is ${userId}`)
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
              body: JSON.stringify({ userId, ...purchase }),
            })
          ));
          console.log("Parsed Gmail data:", parsed);

          sessionStorage.setItem(processedKey, 'true');

          window.location.href = '/dashboard';
        } catch (err) {
          console.error('Failed to process Gmail import', err);
        }
      })();
    }
  }, [token, userId, processedKey]);
};

export default BNPLCallback;
