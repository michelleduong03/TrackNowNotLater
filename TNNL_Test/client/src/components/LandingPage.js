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
    transform: 'translateZ(0)',
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
      overflowX: 'hidden', // Prevent horizontal scroll from animations
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
          TNNL
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
            Track Now, Not Later
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: '#4a5568',
            marginBottom: '2.8rem',
            lineHeight: 1.6,
          }}>
            Take control of your Buy Now, Pay Later spending—
            automatically track and manage it all in one place.
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

      {/* --- All your BNPL accounts, in one place --- */}
      <section style={{
        padding: '6rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{
            fontWeight: 800,
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            color: '#1a202c',
          }}>
            All your BNPL accounts, <br />in one place
          </h2>
          <p style={{
            fontSize: '1.15rem',
            color: '#4a5568',
            lineHeight: 1.7,
          }}>
            Designed specifically to track, organize, and manage your Buy Now, Pay Later purchases —
            all in one place. No need for manually piecing together multiple BNPL providers, statements,
            and emails with incomplete visibility — TNNL will automatically pull and update your activity
            in one easy-to-use dashboard.
          </p>
        </div>
        <div style={{
          flex: 1,
          minWidth: '350px',
          height: '300px',
          backgroundColor: '#e0e7ff', // Placeholder for image
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          color: '#3b82f6',
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}>
          [Image: Transaction lists with different providers (Klarna, PayPal, Affirm)]
        </div>
      </section>

      {/* --- Free to Use --- */}
      <section style={{
        padding: '6rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse', // Reverse order for this section
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{
            fontWeight: 800,
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            color: '#1a202c',
          }}>
            Free to Use
          </h2>
          <p style={{
            fontSize: '1.15rem',
            color: '#4a5568',
            lineHeight: 1.7,
          }}>
            Enjoy at no cost — no hidden fees, no subscriptions, and no upsells. Effortlessly create
            your free TNNL account and securely link your Gmail — no complicated setup required.
          </p>
        </div>
        <div style={{
          flex: 1,
          minWidth: '350px',
          height: '300px',
          backgroundColor: '#ffeec2', // Placeholder for image
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          color: '#f59e0b',
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}>
          [Image: Pie chart and summary]
        </div>
      </section>

      {/* --- Take control of your BNPL purchases --- */}
      <section style={{
        padding: '6rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{
            fontWeight: 800,
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            color: '#1a202c',
          }}>
            Take control of your BNPL purchases
          </h2>
          <p style={{
            fontSize: '1.15rem',
            color: '#4a5568',
            lineHeight: 1.7,
          }}>
            TNNL automatically detects your BNPL purchases so you never lose track.
            Buy Now, Pay Later complicates your payments on purpose — We're here to put you back in control.
          </p>
        </div>
        <div style={{
          flex: 1,
          minWidth: '350px',
          height: '300px',
          backgroundColor: '#ccfbf1', // Placeholder for image
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          color: '#06b6d4',
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}>
          [Image: Transaction list]
        </div>
      </section>

      {/* --- Our Mission --- */}
      <section style={{
        padding: '6rem 4rem',
        maxWidth: '800px', // Narrower width for a more focused mission statement
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontWeight: 800,
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          lineHeight: 1.2,
          color: '#1a202c',
        }}>
          Our Mission
        </h2>
        <p style={{
          fontSize: '1.15rem',
          color: '#4a5568',
          lineHeight: 1.7,
          marginBottom: '1.5rem',
        }}>
          **Track Now, Not Later** was created to give users an easier, clearer way to manage Buy Now, Pay Later purchases.
          As BNPL services grow, many make it difficult on purpose to track payments or understand total balances.
          We built TNNL to change that with privacy-first tracking, simple insights, and a tool that works for you.
        </p>
        <p style={{
          fontSize: '1.15rem',
          color: '#4a5568',
          lineHeight: 1.7,
          fontWeight: '600',
        }}>
          We’re an independent project — always improving, always listening. Thanks for being part of it.
        </p>
      </section>
      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem auto', maxWidth: '1200px' }} />


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
            main, section {
              flex-direction: column;
              padding: 2rem;
              text-align: center; /* Center text for smaller screens */
            }
            main > div, section > div {
              padding-right: 0;
              margin-bottom: 2rem;
              min-width: unset; /* Remove min-width for mobile */
              width: 100%;
            }
            main h1, section h2 {
              font-size: 2.5rem;
            }
            main p, section p {
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
            section:nth-of-type(2) { /* For "Free to Use" section, reverse order on small screens */
              flex-direction: column;
            }
            section:nth-of-type(2) > div:first-child {
              order: 2;
            }
            section:nth-of-type(2) > div:last-child {
              order: 1;
            }
          }
        `}
      </style>
    </div>
  );
}