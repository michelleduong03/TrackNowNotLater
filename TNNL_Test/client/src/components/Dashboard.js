import { useEffect, useState } from 'react';
import axios from '../api';

const BNPL_SERVICES = ['Klarna', 'Afterpay', 'Affirm'];

export default function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [connectedServices, setConnectedServices] = useState([]);

  const handleConnect = async (service) => {
    try {
      if (!connectedServices.includes(service)) {
        // Add service using functional update
        setConnectedServices(prev => [...prev, service]);

        const mockPurchases = getMockPurchases(service);

        // Post all purchases concurrently
        await Promise.all(mockPurchases.map(purchase => axios.post('/payments', purchase)));

        // Fetch updated payments list once after posting all
        fetchPayments();
      }
    } catch (err) {
      alert(`Failed to connect to ${service}`);
      console.error(err);
    }
  };

  const getMockPurchases = (service) => {
    const mockData = {
      Klarna: [
        {
          provider: 'Klarna',
          purchaseAmount: 120,
          installments: 4,
          firstDueDate: '2025-06-01',
          description: 'Sneakers from Klarna'
        }
      ],
      Afterpay: [
        {
          provider: 'Afterpay',
          purchaseAmount: 80,
          installments: 4,
          firstDueDate: '2025-06-05',
          description: 'Headphones from Afterpay'
        }
      ],
      Affirm: [
        {
          provider: 'Affirm',
          purchaseAmount: 200,
          installments: 6,
          firstDueDate: '2025-06-10',
          description: 'Monitor from Affirm'
        }
      ]
    };
    return mockData[service] || [];
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

  return (
    <div>
      <h2>TrackNowNotLater Dashboard</h2>

      <h3>Connect Your BNPL Services</h3>
      {BNPL_SERVICES.map(service => (
        <button
          key={service}
          onClick={() => handleConnect(service)}
          disabled={connectedServices.includes(service)}
        >
          {connectedServices.includes(service) ? `${service} Connected` : `Connect ${service}`}
        </button>
      ))}

      <h3>Payments Summary</h3>
      <ul>
        {payments.length === 0 && <li>No payments tracked yet</li>}
        {payments.map(p => (
          <li key={p._id}>
            {p.provider} - ${p.purchaseAmount} - {p.installments} installments - First Due: {new Date(p.firstDueDate).toLocaleDateString()}
            <br />
            <small>{p.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
