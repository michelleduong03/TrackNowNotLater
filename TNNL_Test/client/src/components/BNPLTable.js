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
  const [createRow, setCreateRow] = useState(null);

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
      <h3>Your Purchases</h3>

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
              setCreateRow({
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
      {/* {editRow && (
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
              Provider:
              <input
                type="text"
                value={editRow.provider}
                onChange={(e) => setEditRow({ ...editRow, provider: e.target.value })}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

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
              OrderId:
              <input
                type="text"
                value={editRow.klarnaOrderId}
                onChange={(e) =>
                  setEditRow({ ...editRow, klarnaOrderId: e.target.value })
                }
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Order Date:
              <input
                type="text"
                value={editRow.orderDate}
                onChange={(e) =>
                  setEditRow({ ...editRow, orderDate: e.target.value })
                }
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Next Payment Date:
              <input
                type="date"
                value={editRow.nextPaymentDate}
                onChange={(e) => setEditRow({ ...editRow, nextPaymentDate: e.target.value })}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Next Payment Amount:
              <input
                type="number"
                value={editRow.nextPaymentAmount}
                onChange={(e) => setEditRow({ ...editRow, nextPaymentAmount: e.target.value })}
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

            <div style={{ marginBottom: '1rem' }}>
              <strong>Payment Dates:</strong>
              {editRow.paymentDates?.map((pd, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <input
                    type="date"
                    value={pd.date?.slice(0, 10)}
                    onChange={(e) => {
                      const updated = [...editRow.paymentDates];
                      updated[idx].date = e.target.value;
                      setEditRow({ ...editRow, paymentDates: updated });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={pd.amount}
                    onChange={(e) => {
                      const updated = [...editRow.paymentDates];
                      updated[idx].amount = parseFloat(e.target.value);
                      setEditRow({ ...editRow, paymentDates: updated });
                    }}
                  />
                  <button
                    onClick={() => {
                      const updated = [...editRow.paymentDates];
                      updated.splice(idx, 1);
                      setEditRow({ ...editRow, paymentDates: updated });
                    }}
                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setEditRow({
                    ...editRow,
                    paymentDates: [...(editRow.paymentDates || []), { date: '', amount: '' }]
                  })
                }
                style={{
                  marginTop: '10px',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  backgroundColor: '#ddd',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + Add Payment
              </button>
            </div> */}
        {editRow && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
            onClick={() => setEditRow(null)}
          >
            <div
              style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                width: '500px',
                maxHeight: '85vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontFamily: 'Arial, sans-serif',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Edit Purchase</h2>

              {[
                { label: 'Provider', key: 'provider' },
                { label: 'Merchant', key: 'merchantName' },
                { label: 'Payment Plan', key: 'paymentPlan' },
                { label: 'Order ID', key: 'klarnaOrderId' },
              ].map(({ label, key }) => (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>{label}</label>
                  <input
                    type="text"
                    value={editRow[key] || ''}
                    onChange={(e) => setEditRow({ ...editRow, [key]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Order Date</label>
                <input
                  type="date"
                  value={editRow.orderDate}
                  onChange={(e) => setEditRow({ ...editRow, orderDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Next Payment Date</label>
                <input
                  type="date"
                  value={editRow.nextPaymentDate}
                  onChange={(e) => setEditRow({ ...editRow, nextPaymentDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Next Payment Amount</label>
                <input
                  type="number"
                  value={editRow.nextPaymentAmount}
                  onChange={(e) => setEditRow({ ...editRow, nextPaymentAmount: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Status</label>
                <select
                  value={editRow.status}
                  onChange={(e) => setEditRow({ ...editRow, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    background: '#fff',
                  }}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>Payment Dates:</label>
                {editRow.paymentDates?.map((pd, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input
                      type="date"
                      value={pd.date?.slice(0, 10)}
                      onChange={(e) => {
                        const updated = [...editRow.paymentDates];
                        updated[idx].date = e.target.value;
                        setEditRow({ ...editRow, paymentDates: updated });
                      }}
                      style={{
                        flex: 1,
                        padding: '0.4rem',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={pd.amount}
                      onChange={(e) => {
                        const updated = [...editRow.paymentDates];
                        updated[idx].amount = parseFloat(e.target.value);
                        setEditRow({ ...editRow, paymentDates: updated });
                      }}
                      style={{
                        width: '100px',
                        padding: '0.4rem',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                      }}
                    />
                    <button
                      onClick={() => {
                        const updated = [...editRow.paymentDates];
                        updated.splice(idx, 1);
                        setEditRow({ ...editRow, paymentDates: updated });
                      }}
                      style={{
                        backgroundColor: '#f56565',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '0.3rem 0.6rem',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  onClick={() =>
                    setEditRow({
                      ...editRow,
                      paymentDates: [...(editRow.paymentDates || []), { date: '', amount: '' }],
                    })
                  }
                  style={{
                    marginTop: '10px',
                    padding: '0.4rem 0.7rem',
                    borderRadius: '6px',
                    backgroundColor: '#e2e8f0',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  + Add Payment
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                  Note
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional note about this purchase"
                  value={editRow.note || ''}
                  onChange={(e) => setEditRow({ ...editRow, note: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    fontWeight: 'normal',
                  }}
                />
              </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '1.5rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={async () => {
                  const paymentData = { ...editRow };
                  try {
                    let saved;
                    if (paymentData._id.startsWith('new-')) {
                      const token = localStorage.getItem('token');
                      const res = await axios.post('/payments', paymentData, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      saved = res.data;
                      setLocalPayments((prev) => [...prev, saved]);
                    } else {
                      saved = await updatePaymentOnServer(paymentData);
                      setLocalPayments((prev) =>
                        prev.map((p) => (p._id === saved._id ? saved : p))
                      );
                    }
                    setNotes((prev) => ({ ...prev, [saved._id]: saved.note || '' }));
                    setEditRow(null);
                    window.location.reload();
                  } catch (err) {
                    console.error('Save failed:', err);
                    alert('Could not save changes. Please try again.');
                  }
                }}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  backgroundColor: '#3b82f6', 
                  color: '#fff',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
                  transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
                  fontSize: '15px',
                  minWidth: '90px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.3)';
                }}
              >
                Save
              </button>

              <button
                onClick={() => setEditRow(null)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  backgroundColor: '#f3f4f6', 
                  color: '#374151', 
                  border: '1px solid #d1d5db', 
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.25s ease, border-color 0.25s ease',
                  fontSize: '15px',
                  minWidth: '90px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!window.confirm('Are you sure you want to delete this purchase?')) return;
                  try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`/payments/${editRow._id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setLocalPayments((prev) => prev.filter((p) => p._id !== editRow._id));
                    setEditRow(null);
                    window.location.reload();
                  } catch (err) {
                    console.error('Delete failed:', err);
                    alert('Could not delete. Try again.');
                  }
                }}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  backgroundColor: '#ef4444', 
                  color: '#fff',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.25)',
                  transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
                  fontSize: '15px',
                  minWidth: '90px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(239, 68, 68, 0.25)';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* NEW PAYMENTS MANUAL INPUT */}
      {createRow && (
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
          onClick={() => setCreateRow(null)}
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
            <h3>Add New Purchase</h3>

            <label>
              Provider:
              <input
                type="text"
                value={createRow.provider}
                onChange={(e) => setCreateRow({ ...createRow, provider: e.target.value })}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Merchant:
              <input
                type="text"
                value={createRow.merchantName}
                onChange={(e) => setCreateRow({ ...createRow, merchantName: e.target.value })}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Plan:
              <input
                type="text"
                value={createRow.paymentPlan}
                onChange={(e) => setCreateRow({ ...createRow, paymentPlan: e.target.value })}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Order ID:
              <input
                type="text"
                value={createRow.klarnaOrderId}
                onChange={(e) => setCreateRow({ ...createRow, klarnaOrderId: e.target.value })}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Order Date:
              <input
                type="date"
                value={createRow.orderDate}
                onChange={(e) => setCreateRow({ ...createRow, orderDate: e.target.value })}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Next Payment Date:
              <input
                type="date"
                value={createRow.nextPaymentDate}
                onChange={(e) => setCreateRow({ ...createRow, nextPaymentDate: e.target.value })}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            <label>
              Next Payment Amount:
              <input
                type="number"
                value={createRow.nextPaymentAmount}
                onChange={(e) => setCreateRow({ ...createRow, nextPaymentAmount: e.target.value })}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </label>

            {/* Payment Dates */}
            <div style={{ marginBottom: '1rem' }}>
              <strong>Payment Dates:</strong>
              {createRow.paymentDates.map((pd, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <input
                    type="date"
                    value={pd.date}
                    onChange={(e) => {
                      const updated = [...createRow.paymentDates];
                      updated[idx].date = e.target.value;
                      setCreateRow({ ...createRow, paymentDates: updated });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={pd.amount}
                    onChange={(e) => {
                      const updated = [...createRow.paymentDates];
                      updated[idx].amount = parseFloat(e.target.value);
                      setCreateRow({ ...createRow, paymentDates: updated });
                    }}
                  />
                  <button
                    onClick={() => {
                      const updated = [...createRow.paymentDates];
                      updated.splice(idx, 1);
                      setCreateRow({ ...createRow, paymentDates: updated });
                    }}
                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setCreateRow({
                    ...createRow,
                    paymentDates: [...createRow.paymentDates, { date: '', amount: '' }]
                  })
                }
                style={{
                  marginTop: '10px',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  backgroundColor: '#ddd',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + Add Payment
              </button>
            </div>

            {/* Submit buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const res = await axios.post('/payments', createRow, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    const saved = res.data;
                    setLocalPayments((prev) => [...prev, saved]);
                    setCreateRow(null);
                    window.location.reload()
                  } catch (err) {
                    console.error('Save failed:', err);
                    alert('Could not save new row. Try again.');
                  }
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
                onClick={() => setCreateRow(null)}
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