// import React from 'react';
// import { Link } from 'react-router-dom';

// export default function LandingPage({ onLogin, onRegister }) {
//   return (
//     <div style={{
//       minHeight: '100vh',
//       display: 'flex',
//       flexDirection: 'column',
//       fontFamily: '"Inter", sans-serif',
//       background: 'linear-gradient(to right, #f8fafc, #ffffff)',
//       color: '#1f2937'
//     }}>
//       <main style={{
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '4rem',
//         maxWidth: '1200px',
//         margin: '0 auto'
//       }}>
//         {/* Left Section */}
//         <div style={{ flex: 1, paddingRight: '3rem' }}>
//           <h1 style={{
//             fontWeight: 700,
//             fontSize: '3rem',
//             marginBottom: '1.25rem',
//             lineHeight: 1.3,
//             letterSpacing: '-0.02em'
//           }}>
//             Take control of your Buy Now, Pay Later payments.
//           </h1>
//           <p style={{
//             fontSize: '1.25rem',
//             color: '#4b5563',
//             marginBottom: '2rem'
//           }}>
//             TrackNowNotLater helps you organize BNPL purchases and upcoming dues from all your accounts—automatically or manually.
//           </p>
//           <div>
//             <button
//               onClick={onLogin}
//               style={{
//                 padding: '0.75rem 2rem',
//                 marginRight: '1rem',
//                 fontSize: '1rem',
//                 borderRadius: '9999px',
//                 border: 'none',
//                 backgroundColor: '#2563eb',
//                 color: 'white',
//                 fontWeight: '600',
//                 cursor: 'pointer',
//                 boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
//               onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
//             >
//               Log In
//             </button>
//             <button
//               onClick={onRegister}
//               style={{
//                 padding: '0.75rem 2rem',
//                 fontSize: '1rem',
//                 borderRadius: '9999px',
//                 border: '2px solid #2563eb',
//                 backgroundColor: 'transparent',
//                 color: '#2563eb',
//                 fontWeight: '600',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={e => {
//                 e.currentTarget.style.backgroundColor = '#2563eb';
//                 e.currentTarget.style.color = 'white';
//               }}
//               onMouseLeave={e => {
//                 e.currentTarget.style.backgroundColor = 'transparent';
//                 e.currentTarget.style.color = '#2563eb';
//               }}
//             >
//               Register
//             </button>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <svg width="360" height="360" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" >
//             <circle cx="150" cy="150" r="140" fill="#2563eb" fillOpacity="0.08" />
//             <circle cx="150" cy="150" r="100" fill="#2563eb" fillOpacity="0.15" />
//             <circle cx="150" cy="150" r="60" fill="#2563eb" fillOpacity="0.3" />
//           </svg>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer style={{
//         textAlign: 'center',
//         padding: '1rem',
//         fontSize: '0.875rem',
//         color: '#6b7280',
//         borderTop: '1px solid #e5e7eb',
//         backgroundColor: '#f9fafb'
//       }}>
//         <Link to="/privacy" style={{ marginRight: '1rem', color: '#2563eb', textDecoration: 'none' }}>
//           Privacy Policy
//         </Link>
//         <Link to="/terms" style={{ marginRight: '1rem', color: '#2563eb', textDecoration: 'none' }}>
//           Terms of Use
//         </Link>
//       </footer>
//     </div>
//   );
// }
import React from 'react';
import { Link } from 'react-router-dom';

const DataWidget = () => (
  <div style={{
    background: 'white',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    width: '100%',
    maxWidth: '300px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#93c5fd', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem',
      fontSize: '2rem',
      color: '#2563eb'
    }}>
      📈
    </div>
    <h3 style={{
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1f2937',
      marginBottom: '0.5rem'
    }}>
      Upcoming Payments
    </h3>
    <p style={{
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#2563eb'
    }}>
      $450.75
    </p>
    <p style={{
      fontSize: '0.875rem',
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
      background: 'linear-gradient(to bottom right, #f0f4f8, #ffffff)',
      color: '#1f2937',
      overflow: 'hidden', 
    }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          fontSize: '1.75rem',
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
              padding: '0.6rem 1.5rem',
              fontSize: '0.9rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#4b5563',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
          >
            Log In
          </button>
          <button
            onClick={onRegister}
            style={{
              padding: '0.6rem 1.5rem',
              fontSize: '0.9rem',
              borderRadius: '9999px',
              border: '2px solid #2563eb',
              backgroundColor: '#2563eb', 
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: '1rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s ease'
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
        {/* Left Section - Content */}
        <div style={{
          flex: 1,
          paddingRight: '3rem',
          minWidth: '300px',
          marginBottom: '2rem', 
        }}>
          <h1 style={{
            fontWeight: 800, 
            fontSize: '3.5rem',
            marginBottom: '1.25rem',
            lineHeight: 1.2, 
            letterSpacing: '-0.04em',
            color: '#1a202c', 
          }}>
            Take control of your <span style={{ color: '#2563eb' }}>Buy Now, Pay Later</span> payments.
          </h1>
          <p style={{
            fontSize: '1.35rem', 
            color: '#4a5568',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
          }}>
            TrackNowNotLater helps you organize BNPL purchases and upcoming dues from all your accounts—automatically or manually.
          </p>
          <div>
            <button
              onClick={onRegister} 
              style={{
                padding: '1rem 2.5rem',
                marginRight: '1rem',
                fontSize: '1.1rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-2px)';
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
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                borderRadius: '9999px',
                border: '2px solid #cbd5e0', 
                backgroundColor: 'transparent',
                color: '#4a5568',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
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

        {/* Right Section - Visuals/Widgets */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: '400px', 
          minWidth: '350px',
        }}>
          {/* Decorative background shapes */}
          <div style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            opacity: 0.05,
            filter: 'blur(40px)',
            top: '20%',
            left: '10%',
            zIndex: 0,
            animation: 'pulse 4s infinite alternate',
          }}></div>
          <div style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            backgroundColor: '#6366f1',
            opacity: 0.05,
            filter: 'blur(30px)',
            bottom: '15%',
            right: '5%',
            zIndex: 0,
            animation: 'pulse 3.5s infinite alternate reverse',
          }}></div>

          <DataWidget />
        </div>
      </main>

      {/* Footer */}
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

      {/* pulse effect */}
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