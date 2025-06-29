import React from 'react';
import { Link } from 'react-router-dom';

const DataWidget = () => (
  <div style={{
    background: 'white',
    borderRadius: '1.5rem',
    padding: '1.75rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '220px',
    width: '100%',
    maxWidth: '320px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    transform: 'translateZ(0)', // trigger GPU for smooth transform
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
  }}>
    <div style={{
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #2563eb, #6366f1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.25rem',
      fontSize: '2.2rem',
      color: 'white',
      boxShadow: '0 8px 20px rgba(37,99,235,0.4)'
    }}>
      📈
    </div>
    <h3 style={{
      fontSize: '1.35rem',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '0.6rem'
    }}>
      Upcoming Payments
    </h3>
    <p style={{
      fontSize: '1.6rem',
      fontWeight: 800,
      color: '#2563eb'
    }}>
      $450.75
    </p>
    <p style={{
      fontSize: '0.9rem',
      color: '#6b7280'
    }}>
      Due in the next 30 days
    </p>
  </div>
);

export default function LandingPage({ onLogin, onRegister }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Inter", sans-serif',
      background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)',
      color: '#1f2937',
      overflow: 'hidden',
    }}>
      <header style={{
        padding: '1.75rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          fontSize: '1.9rem',
          fontWeight: 800,
          color: '#2563eb',
          letterSpacing: '-0.05em'
        }}>
          TrackNowNotLater
        </div>
        <div>
          <button
            onClick={onLogin}
            style={{
              padding: '0.7rem 1.6rem',
              fontSize: '0.95rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#4b5563',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'color 0.4s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
          >
            Log In
          </button>
          <button
            onClick={onRegister}
            style={{
              padding: '0.7rem 1.6rem',
              fontSize: '0.95rem',
              borderRadius: '9999px',
              border: '2px solid #2563eb',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: '1rem',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.4s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Get Started
          </button>
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        flexWrap: 'wrap',
      }}>
        <div style={{
          flex: 1,
          paddingRight: '3rem',
          minWidth: '300px',
          marginBottom: '2rem',
        }}>
          <h1 style={{
            fontWeight: 900,
            fontSize: '3.7rem',
            marginBottom: '1.4rem',
            lineHeight: 1.2,
            letterSpacing: '-0.04em',
            color: '#1a202c',
          }}>
            Take control of your <span style={{ color: '#2563eb' }}>Buy Now, Pay Later</span> payments.
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: '#4a5568',
            marginBottom: '2.8rem',
            lineHeight: 1.6,
          }}>
            TrackNowNotLater helps you organize BNPL purchases and upcoming dues from all your accounts—automatically or manually.
          </p>
          <div>
            <button
              onClick={onRegister}
              style={{
                padding: '1.1rem 2.7rem',
                marginRight: '1rem',
                fontSize: '1.15rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Started Now
            </button>
            <button
              onClick={onLogin}
              style={{
                padding: '1.1rem 2.7rem',
                fontSize: '1.15rem',
                borderRadius: '9999px',
                border: '2px solid #cbd5e0',
                backgroundColor: 'transparent',
                color: '#4a5568',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#edf2f7';
                e.currentTarget.style.borderColor = '#a0aec0';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#cbd5e0';
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: '400px',
          minWidth: '350px',
        }}>
          <div style={{
            position: 'absolute',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            opacity: 0.06,
            filter: 'blur(50px)',
            top: '15%',
            left: '5%',
            zIndex: 0,
            animation: 'pulse 4s infinite alternate',
          }}></div>
          <div style={{
            position: 'absolute',
            width: '270px',
            height: '270px',
            borderRadius: '50%',
            backgroundColor: '#6366f1',
            opacity: 0.06,
            filter: 'blur(35px)',
            bottom: '10%',
            right: '10%',
            zIndex: 0,
            animation: 'pulse 3.5s infinite alternate-reverse',
          }}></div>

          <DataWidget />
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        fontSize: '0.9rem',
        color: '#6b7280',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
      }}>
        <Link to="/privacy" style={{ marginRight: '1.5rem', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
          Privacy Policy
        </Link>
        <Link to="/terms" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
          Terms of Use
        </Link>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
          &copy; {new Date().getFullYear()} TrackNowNotLater. All rights reserved.
        </p>
      </footer>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
          }
          @media (max-width: 768px) {
            main {
              flex-direction: column;
              padding: 2rem;
            }
            main > div {
              padding-right: 0;
              margin-bottom: 2rem;
              text-align: center;
            }
            main h1 {
              font-size: 2.5rem;
            }
            main p {
              font-size: 1.1rem;
            }
            header {
              padding: 1rem 2rem;
              flex-direction: column;
              gap: 1rem;
            }
            header button {
              margin: 0.5rem 0.5rem;
            }
            main > div:first-child {
              order: 2;
            }
            main > div:last-child {
              order: 1;
            }
          }
        `}
      </style>
    </div>
  );
}
