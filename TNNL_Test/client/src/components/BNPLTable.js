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
          <div
            style={{
              flex: 3,
              paddingLeft: '1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            {Array.isArray(p.paymentDates) && p.paymentDates.length > 0 ? (
              p.paymentDates.map((pd) => {
                const paymentDate = new Date(pd.date);
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                paymentDate.setHours(0, 0, 0, 0);

                const isPast = paymentDate < now;

                return (
                  <div
                    key={pd._id}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      backgroundColor: isPast ? '#ffdddd' : '#e1f5fe', 
                      border: isPast ? '1px solid #f28b82' : '1px solid #81d4fa',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
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
      ))}
    </div>
  );
};

export default BNPLTable;