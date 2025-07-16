import React, { useState } from 'react';

export default function InfoToolTip() {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }}>
      {/* Info Circle */}
      <div
        onClick={() => setVisible(true)}
        onMouseEnter={() => setVisible(true)}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: '1.1rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          fontFamily: 'Lora, serif',
        }}
        title="Info"
      >
        i
      </div>

      {/* Tooltip / Popup */}
      {visible && (
        <div
          onMouseLeave={() => setVisible(false)}
          style={{
            marginTop: '0.5rem',
            width: '280px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '0.9rem',
            color: '#374151',
            position: 'relative',
            fontFamily: 'Lora, serif',
          }}
        >
          <p style={{ marginBottom: '1rem', fontStyle: 'italic', fontFamily: 'Lora, serif', }}>
            This app is currently in development. Feel free to send feedback or suggestions!
          </p>
          <button
            onClick={() => setVisible(false)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              fontFamily: 'Lora, serif',
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
