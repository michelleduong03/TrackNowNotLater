import React, { useState } from 'react';
import { updatePaymentOnServer } from '../utils/services';
import axios from '../api';

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

  const statusColors = {
    completed: '#28a745', 
    refunded: '#ffc107', 
    active: '#17a2b8'     
  };

  const [editRow, setEditRow] = useState(null);
  const [localPayments, setLocalPayments] = useState(payments);

  React.useEffect(() => {
    setLocalPayments(payments);
  }, [payments]);

  React.useEffect(() => {
    const initialNotes = {};
    payments.forEach((p) => {
      initialNotes[p._id] = p.note || '';
    });
    setNotes(initialNotes);
  }, [payments, setNotes]);

  const userId = localStorage.getItem('userId');


  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h3>🧾 Purchases</h3>

      {/* Tabs */}
      <div style={{ marginBottom: '1rem' }}>
        {[...BNPL_SERVICES].map((tab) => (
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
      {/* <div
        style={{
          display: 'flex',
          fontWeight: 'bold',
          borderBottom: '2px solid #ccc',
          paddingBottom: '8px'
        }}
      >
        <div style={{ flex: 7 }}>Purchase Info</div>
        <div style={{ flex: 3 }}>Payment Dates</div>
      </div> */}
      {/* Header */}
      <div
        style={{
          display: 'flex',
          fontWeight: 'bold',
          borderBottom: '2px solid #ccc',
          paddingBottom: '8px',
          position: 'relative'
        }}
      >
        <div style={{ flex: 7 }}>Purchase Info</div>
        <div style={{ flex: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Payment Dates
          <button
            onClick={() =>
              setEditRow({
                _id: `new-${Date.now()}`,
                provider: '',
                merchantName: '',
                paymentPlan: '',
                klarnaOrderId: '',
                orderDate: '',
                nextPaymentDate: '',
                nextPaymentAmount: '',
                status: 'active',
                note: '',
                paymentDates: [],
                user: userId
              })
            }
            style={{
              marginLeft: '10px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '0',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            title="Add New Purchase"
          >
            +
          </button>
        </div>
      </div>


      {localPayments.map((p, idx) => {
        const statusText =
          p.status === 'completed'
            ? 'Completed'
            : p.status === 'refunded'
            ? 'Refunded'
            : 'Active';

        return (
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
            <div
              style={{
                flex: 7,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <div>
                <strong>Provider:</strong> {p.provider || '—'}
              </div>
              <div>
                <strong>Merchant:</strong> {p.merchantName || '—'}
              </div>
              <div>
                <strong>Plan:</strong> {p.paymentPlan || '—'}
              </div>
              <div>
                <strong>Order ID:</strong> {p.klarnaOrderId || '—'}
              </div>
              <div>
                <strong>Order Date:</strong>{' '}
                {p.orderDate ? formatDate(p.orderDate) : '—'}
              </div>
              <div>
                <strong>Next:</strong>{' '}
                {p.status === 'refunded'
                  ? '—'
                  : p.nextPaymentDate
                  ? `${formatDate(p.nextPaymentDate)} ($${p.nextPaymentAmount})`
                  : '—'}
              </div>

              <div
                style={{
                  fontWeight: 'bold',
                  color: statusColors[p.status] || '#333',
                  textTransform: 'capitalize',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  backgroundColor: `${statusColors[p.status]}33`, 
                  textAlign: 'center',
                }}
              >
                {statusText}
              </div>

              {/* <div style={{ gridColumn: '1 / -1' }}>
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
                    fontSize: '0.85rem',
                    marginTop: '8px'
                  }}
                />
              </div> */}
              <div style={{ 
                gridColumn: '1 / -1', 
                marginTop: '8px', 
                fontStyle: notes[p._id] ? 'normal' : 'italic', 
                color: notes[p._id] ? '#000' : '#888' 
                }}>
                {notes[p._id] || 'No note'}
              </div>
              <button
                onClick={() => setEditRow(p)}
                style={{
                  marginTop: '8px',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #999',
                  backgroundColor: '#f0f0f0',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </div>

            {/* Payment bubbles (right) */}
            <div
              style={{
                flex: 3,
                paddingLeft: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              {Array.isArray(p.paymentDates) && p.paymentDates.length > 0 ? (
                p.paymentDates.map((pd) => {
                  const paymentDate = new Date(pd.date);
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  paymentDate.setHours(0, 0, 0, 0);

                  const isPast = paymentDate <= now;

                  const isRefunded = p.status === 'refunded';
                  const isCompleted = p.status === 'completed';


                  return (
                    <div
                      key={pd._id}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        backgroundColor: isCompleted
                          ? '#ffdddd' 
                          : isRefunded
                          ? '#bbb'    
                          : isPast
                          ? '#ffdddd'  
                          : '#e1f5fe', 
                        border: isCompleted
                          ? '1px solid #f28b82' 
                          : isRefunded
                          ? '1px solid #888'    
                          : isPast
                          ? '1px solid #f28b82' 
                          : '1px solid #81d4fa',
                        color: isRefunded ? '#555' : undefined,
                        opacity: isRefunded ? 0.8 : 1,
                      }}
                    >
                      {formatDate(pd.date)} — ${pd.amount}
                    </div>
                  );
                })
              ) : (
                <span style={{ color: '#aaa' }}>No payments</span>
              )}
            </div>
          </div>
        );
      })}
      {editRow && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setEditRow(null)}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '10px',
              width: '500px',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Purchase</h3>

            <label>
              Merchant:
              <input
                type="text"
                value={editRow.merchantName}
                onChange={(e) =>
                  setEditRow({ ...editRow, merchantName: e.target.value })
                }
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Payment Plan:
              <input
                type="text"
                value={editRow.paymentPlan}
                onChange={(e) =>
                  setEditRow({ ...editRow, paymentPlan: e.target.value })
                }
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Status:
              <select
                value={editRow.status}
                onChange={(e) =>
                  setEditRow({ ...editRow, status: e.target.value })
                }
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>

            <label>
              Note:
              <input
                type="text"
                value={editRow.note || ''}
                onChange={(e) =>
                  setEditRow({ ...editRow, note: e.target.value })
                }
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
              onClick={async () => {
                const paymentData = { ...editRow };

                try {
                  let saved;
                  if (paymentData._id.startsWith('new-')) {
                    // Add logic for creating a new payment
                    const token = localStorage.getItem('token');
                    const res = await axios.post('/payments', paymentData, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    saved = res.data;
                    setLocalPayments((prev) => [...prev, saved]);
                  } else {
                    // Update existing payment
                    saved = await updatePaymentOnServer(paymentData);
                    setLocalPayments((prev) =>
                      prev.map((p) => (p._id === saved._id ? saved : p))
                    );
                  }

                  setNotes((prev) => ({ ...prev, [saved._id]: saved.note || '' }));
                  setEditRow(null);
                } catch (err) {
                  console.error('Save failed:', err);
                  alert('Could not save changes. Please try again.');
                }
                // onClick={async () => {
                //   console.log('Save clicked with editRow:', editRow);
                //   const updatedPayment = { ...editRow };

                //   // if (updatedPayment.status === 'refunded') {
                //   //   updatedPayment.nextPaymentDate = null;
                //   // }

                //   try {
                //     const saved = await updatePaymentOnServer(updatedPayment);
                //     console.log('Server responded with:', saved);

                //     setLocalPayments((prev) =>
                //       prev.map((p) => (p._id === saved._id ? saved : p))
                //     );

                //     setNotes((prev) => ({ ...prev, [saved._id]: saved.note || '' }));

                //     setEditRow(null);
                //     // window.location.reload();
                //   } catch (error) {
                //     console.error('Save failed:', error);
                //     alert('Could not save changes. Please try again.');
                //   }
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none'
                }}
              >
                Save
              </button>
              <button
                onClick={() => setEditRow(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: '#ccc',
                  border: 'none'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BNPLTable;