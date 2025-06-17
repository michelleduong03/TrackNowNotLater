import React from 'react';

export default function LandingPage({ onLogin, onRegister }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      fontFamily: '"Inter", sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      color: '#1f2937',
      padding: '4rem',
      boxSizing: 'border-box'
    }}>
      {/* Left side content */}
      <div style={{ flex: 1, maxWidth: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontWeight: 700, fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.2 }}>
          Take control of your Buy Now, Pay Later payments.
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem' }}>
          TrackNowNotLater helps you connect all your BNPL accounts and manage payments effortlessly—all in one place.
        </p>
        <div>
          <button
            onClick={onLogin}
            style={{
              padding: '0.75rem 2rem',
              marginRight: '1rem',
              fontSize: '1rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.39)',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Log In
          </button>
          <button
            onClick={onRegister}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              borderRadius: '9999px',
              border: '2px solid #2563eb',
              backgroundColor: 'transparent',
              color: '#2563eb',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, color 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#2563eb';
            }}
          >
            Register
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <circle cx="150" cy="150" r="140" fill="#2563eb" fillOpacity="0.1"/>
          <circle cx="150" cy="150" r="100" fill="#2563eb" fillOpacity="0.2"/>
          <circle cx="150" cy="150" r="60" fill="#2563eb" fillOpacity="0.3"/>
        </svg>
      </div>
    </div>
  );
}
