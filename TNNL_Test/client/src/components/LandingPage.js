import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import transactionsMultiProviderImage from './assets/listWName.png';
import pieChartSummaryImage from './assets/piechart.png';
import singleTransactionListImage from './assets/transactionList.png';
import dashboard from './assets/dashboard4.png';

const DataWidget = () => (
  <div style={{
    background: 'transparent',
    borderRadius: '0',
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    width: '100%',
    maxWidth: 'clamp(300px, 60vw, 600px)',
    textAlign: 'center',
    border: 'none',
    transform: 'translateZ(0)',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
  }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
    <img
      src={dashboard}
      alt="Dashboard preview"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        borderRadius: '1rem',
        display: 'block',
      }}
    />
  </div>
);

export default function LandingPage({ onLogin, onRegister }) {
  const benefits = [
    {
      title: 'Free to Use',
      description: 'Enjoy at no cost — no hidden fees, no subscriptions, and no upsells.'
    },
    {
      title: 'Automatic Tracking',
      description: 'Your BNPL purchases sync seamlessly and automatically without any manual input.'
    },
    {
      title: 'Privacy First',
      description: 'Your data belongs to you. TNNL only pulls information related to your BNPL purchases — nothing more.'
    },
    {
      title: 'All-in-One Dashboard',
      description: 'Easily see all BNPL plans in one clear, organized view across all services you use.'
    },
    {
      title: 'Payment Reminders',
      description: 'Get timely reminders before each payment is due — never miss a due date again.'
    },
    {
      title: 'Tailored Insights',
      description: 'Understand your BNPL spending with insights so you manage your budget smarter and stay in control.'
    },
  ];

  const faqItems = [
    {
      question: 'Is TNNL free to use?',
      answer: 'Yep! TNNL is completely free. No subscriptions, no hidden fees.'
    },
    {
      question: 'How does TNNL track my BNPL purchases?',
      answer: 'With official approval from Google, TNNL connects securely to your Gmail read-only account and automatically detects BNPL-related emails (purchase confirmations, payment reminders). We use this info to display your BNPL plans in one clear dashboard.'
    },
    {
      question: 'What BNPL services does TNNL support?',
      answer: 'TNNL works with major BNPL providers (like Affirm, Afterpay, Klarna, PayPal Pay in 4, and more), and we’re adding support for more all the time.'
    },
    {
      question: 'How long does it take to see results?',
      answer: 'Almost instantly. Once you connect your Gmail, TNNL quickly scans for past BNPL-related emails and displays your active plans, balances, and payment schedules in your dashboard within seconds.'
    },
    {
      question: 'Is my data safe?',
      answer: 'Absolutely. We only pull BNPL-related emails — nothing else. We do not store or share your email contents.'
    },
    {
      question: 'Does TNNL connect to my bank account?',
      answer: 'No, TNNL does not connect to your bank account. We only access BNPL-related emails from your Gmail to track purchases.'
    },
    {
      question: 'What if I don\'t fully trust TNNL?',
      answer: 'No problem — we get it! You can sign up and try TNNL with full control. If at any time you want to disconnect your Gmail, you can easily revoke access in your Google account settings. We only pull BNPL-related emails and never store or share your data.'
    },
  ];


  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  const [isSticky, setIsSticky] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Lora", serif',
      background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)',
      color: '#1f2937',
      overflowX: 'hidden',
    }}>
      <header style={{
        padding: 'clamp(1rem, 3vw, 1.75rem) clamp(1rem, 5vw, 4rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: isSticky ? 'rgba(255, 255, 255, 0.95)' : 'linear-gradient(to bottom right, #f1f5f9, #ffffff)',
        boxShadow: isSticky ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
        backdropFilter: isSticky ? 'blur(10px)' : 'none',
        transition: 'background 0.3s ease-in-out, box-shadow 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out',
      }}>
        <div style={{
          fontSize: 'clamp(1.5rem, 4vw, 1.9rem)',
          fontWeight: 800,
          color: '#2563eb',
          letterSpacing: '-0.05em',
          display: 'flex',
          alignItems: 'center',
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="clamp(1.5rem, 4vw, 1.9rem)"
            height="clamp(1.5rem, 4vw, 1.9rem)"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: '0.5rem' }}
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          TNNL
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <button
            onClick={() => scrollToSection('features')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
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
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
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
            How it works
          </button>
          <button
            onClick={() => scrollToSection('about-us')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
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
            About us
          </button>
          <button
            onClick={() => scrollToSection('FAQ')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
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
            FAQ
          </button>
          <button
            onClick={() => scrollToSection('contact-us')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
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
            Contact Us
          </button>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={onLogin}
            style={{
              padding: 'clamp(0.6rem, 1.5vw, 0.7rem) clamp(1rem, 3vw, 1.6rem)',
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
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
              padding: 'clamp(0.6rem, 1.5vw, 0.7rem) clamp(1rem, 3vw, 1.6rem)',
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
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
        padding: 'clamp(2rem, 5vw, 4rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        flexWrap: 'wrap',
      }}>
        <div style={{
          flex: 1,
          paddingRight: 'clamp(1rem, 4vw, 3rem)',
          minWidth: '300px',
          marginBottom: '2rem',
        }}>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 6vw, 3.7rem)',
            marginBottom: '1.4rem',
            lineHeight: 1.2,
            letterSpacing: '-0.04em',
            color: '#1a202c',
          }}>
            Track Now, Not Later
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
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
                padding: 'clamp(0.9rem, 2vw, 1.1rem) clamp(1.8rem, 4vw, 2.7rem)',
                marginRight: '1rem',
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
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
              Get Started
            </button>
            <button
              onClick={onLogin}
              style={{
                padding: 'clamp(0.9rem, 2vw, 1.1rem) clamp(1.8rem, 4vw, 2.7rem)',
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
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
            width: 'clamp(250px, 40vw, 380px)',
            height: 'clamp(250px, 40vw, 380px)',
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
            width: 'clamp(180px, 30vw, 270px)',
            height: 'clamp(180px, 30vw, 270px)',
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

      <section id="features" style={{
        padding: 'clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
          fontWeight: 800,
          color: '#2563eb',
          marginBottom: '0.5rem',
        }}>
          • Features
        </p>
        <h2 style={{
          fontWeight: 800,
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          marginBottom: '2.5rem',
          lineHeight: 1.2,
          color: '#1a202c',
        }}>
          Key benefits that set us apart
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          textAlign: 'left',
        }}>
          {benefits.map((benefit, index) => (
            <div key={index} style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
            }}>
              <h3 style={{
                fontWeight: 700,
                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                marginBottom: '0.8rem',
                color: '#2563eb',
              }}>
                {benefit.title}
              </h3>
              <p style={{
                fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
                color: '#4a5568',
                lineHeight: 1.6,
              }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{
        padding: 'clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
          fontWeight: 800,
          color: '#2563eb',
          marginBottom: '2.5rem',
          marginTop: '-1rem',
        }}>
          • How it works
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(2rem, 5vw, 4rem)',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              marginBottom: '1.5rem',
              lineHeight: 1.2,
              color: '#1a202c',
            }}>
              All your BNPL accounts, <br />in one place
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: '#4a5568',
              lineHeight: 1.7,
              textAlign: 'left',
            }}>
              Designed specifically to track, organize, and manage your Buy Now, Pay Later purchases —
              all in one place. No need for manually piecing together multiple BNPL providers, statements,
              and emails with incomplete visibility — TNNL will automatically pull and update your activity
              in one easy-to-use dashboard.
            </p>
          </div>
          <div style={{
            flex: 1,
            minWidth: '300px',
            height: 'auto',
            maxHeight: '450px',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}>
            <img
              src={transactionsMultiProviderImage}
              alt="Transaction lists with different BNPL providers like Klarna, PayPal, Affirm"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '1rem',
              }}
            />
          </div>
        </div>
      </section>

      <section style={{
        padding: 'clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(2rem, 5vw, 4rem)',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            color: '#1a202c',
          }}>
            Free to Use
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: '#4a5568',
            lineHeight: 1.7,
          }}>
            Enjoy at no cost — no hidden fees, no subscriptions, and no upsells. Effortlessly create
            your free TNNL account and securely link your Gmail — no complicated setup required.
          </p>
        </div>
        <div style={{
          flex: 1,
          minWidth: '300px',
          height: 'auto',
          maxHeight: '450px',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <img
            src={pieChartSummaryImage}
            alt="Pie chart illustrating BNPL spending and a summary of financial overview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '1rem',
            }}
          />
        </div>
      </section>

      <section style={{
        padding: 'clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(2rem, 5vw, 4rem)',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            color: '#1a202c',
          }}>
            Take control of your BNPL purchases
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: '#4a5568',
            lineHeight: 1.7,
          }}>
            TNNL automatically detects your BNPL purchases so you never lose track.
            Buy Now, Pay Later complicates your payments on purpose — We're here to put you back in control.
          </p>
        </div>
        <div style={{
          flex: 1,
          minWidth: '300px',
          height: 'auto',
          maxHeight: '450px',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <img
            src={singleTransactionListImage}
            alt="Detailed list of individual BNPL transactions"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '1rem',
            }}
          />
        </div>
      </section>

      <section id="about-us" style={{
        padding: 'clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
          fontWeight: 800,
          color: '#2563eb',
          marginBottom: '0.5rem',
          marginTop: '-1rem'
        }}>
          • About us
        </p>
        <h2 style={{
          fontWeight: 800,
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          marginBottom: '1.5rem',
          lineHeight: 1.2,
          color: '#1a202c',
        }}>
          Our Mission
        </h2>
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
          color: '#4a5568',
          lineHeight: 1.7,
          marginBottom: '1.5rem',
        }}>
          Track Now, Not Later was created to give users an easier, clearer way to manage Buy Now, Pay Later purchases.
          As BNPL services grow, many make it difficult on purpose to track payments or understand total balances.
          We built TNNL to change that with privacy-first tracking, simple insights, and a tool that works for you.
        </p>
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
          color: '#4a5568',
          lineHeight: 1.7,
          fontWeight: '600',
        }}>
          We’re an independent project — always improving, always listening. Thanks for being part of it.
        </p>
      </section>

      <section id="FAQ" style={{
        padding: 'clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
          fontWeight: 800,
          color: '#2563eb',
          marginBottom: '2rem',
          marginTop: '-1rem'
        }}>
          • FAQ
        </p>
        <h2 style={{
          fontWeight: 800,
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          marginBottom: '2.5rem',
          lineHeight: 1.2,
          color: '#1a202c',
        }}>
          Answers to your most <br></br> common questions
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {faqItems.map((item, index) => (
            <div key={index} style={{
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: openFAQIndex === index ? '0.5rem' : '0',
            }}>
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 0',
                  fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                  fontWeight: 600,
                  color: '#1a202c',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                onMouseLeave={e => e.currentTarget.style.color = '#1a202c'}
              >
                {item.question}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: openFAQIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: '#2563eb',
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {openFAQIndex === index && (
                <div style={{
                  padding: '0 0 1rem 0',
                  fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
                  color: '#4a5568',
                  lineHeight: 1.6,
                  textAlign: 'left',
                }}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="contact-us" style={{
        padding: 'clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)',
        margin: '2rem auto 0 auto',
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#2563eb',
        color: 'white',
        boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)',
      }}>
        <p style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
          fontWeight: 800,
          color: 'white',
          marginBottom: '0.5rem',
          marginTop: '-1rem',
          textAlign: 'left',
          marginLeft: '9.5rem'
        }}>
          • Contact Us
        </p>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          fontWeight: '800',
          color: '#e0e7ff',
          marginBottom: '2.5rem',
          lineHeight: 1.6,
          textAlign: 'left',
          marginLeft: '9.5rem'
        }}>
          Get in touch with our team
        </h2>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '1200px',
            padding: '0 1rem',
            margin: '0 auto',
            textAlign: 'left',
          }}
          onSubmit={e => {
            e.preventDefault();

            const form = e.currentTarget;
            const firstName = form.querySelector('input[placeholder="First Name"]').value.trim();
            const lastName = form.querySelector('input[placeholder="Last Name"]').value.trim();
            const email = form.querySelector('input[placeholder="Your Email"]').value.trim();
            const message = form.querySelector('textarea[placeholder="How can we help?"]').value.trim();

            const subject = encodeURIComponent(`Contact Us Inquiry - ${firstName} ${lastName}`);
            const body = encodeURIComponent(`${message}`);

            const mailtoLink = `mailto:tracknownotlater@gmail.com?subject=${subject}&body=${body}`;

            window.location.href = mailtoLink;
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="First Name"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.8rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #93c5fd',
                backgroundColor: '#e0e7ff',
                color: '#1a202c',
                fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
              }}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.8rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #93c5fd',
                backgroundColor: '#e0e7ff',
                color: '#1a202c',
                fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
              }}
              required
            />
          </div>
          <input
            type="email"
            placeholder="Your Email"
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #93c5fd',
              backgroundColor: '#e0e7ff',
              color: '#1a202c',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
            }}
            required
          />
          <textarea
            placeholder="How can we help?"
            rows="5"
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #93c5fd',
              backgroundColor: '#e0e7ff',
              color: '#1a202c',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
              resize: 'vertical',
            }}
            required
          ></textarea>
          <button
            type="submit"
            style={{
              alignSelf: 'flex-start',
              padding: '0.6rem 1.4rem',
              fontSize: '1rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: 'white',
              color: '#2563eb',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              marginTop: '1rem',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#e0e7ff';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Submit your Form
          </button>
        </form>
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
          Buy Now Pay Later Expense Tracker
        </p>
      </footer>

      <style>
        {`
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow-y: scroll; /* Ensure vertical scrolling is enabled */
          }

          @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');

          @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
          }

          @media (max-width: 1024px) {
            header {
              padding: 1.5rem 3vw;
            }
            main, section {
              padding: 3rem 3vw;
              gap: 3rem;
            }
            main h1 {
              font-size: clamp(2.2rem, 5vw, 3.2rem);
            }
            main p {
              font-size: clamp(1rem, 1.8vw, 1.25rem);
            }
            section h2 {
              font-size: clamp(1.8rem, 3.5vw, 2.2rem);
            }
            section p {
              font-size: clamp(0.95rem, 1.6vw, 1.1rem);
            }
            main > div:first-child {
                padding-right: 2rem;
            }
            nav button {
              padding: 0.4rem 0.8rem;
              font-size: clamp(0.8rem, 1.2vw, 0.9rem);
            }
          }

          @media (max-width: 768px) {
            main, section {
              flex-direction: column;
              padding: 2rem 1.5rem;
              text-align: center;
              gap: 2rem;
            }
            main > div, section > div {
              padding-right: 0;
              margin-bottom: 0;
              min-width: unset;
              width: 100%;
            }
            main h1 {
              font-size: 2.2rem;
            }
            main p {
              font-size: 1rem;
            }
            section h2 {
              font-size: 1.8rem;
            }
            section p {
              font-size: 0.95rem;
            }
            header {
              padding: 1rem 1rem;
              flex-direction: column;
              gap: 1rem;
            }
            nav {
              flex-wrap: wrap;
              justify-content: center;
            }
            header button {
              padding: 0.5rem 0.8rem;
              font-size: 0.85rem;
              margin: 0.5rem 0.4rem;
            }
            main > div:first-child {
              order: 2;
            }
            main > div:last-child {
              order: 1;
              min-height: 300px;
              min-width: unset;
            }
            section:nth-of-type(2) {
              flex-direction: column;
            }
            section:nth-of-type(2) > div:first-child {
              order: 2;
            }
            section:nth-of-type(2) > div:last-child {
              order: 1;
            }
            .DataWidget {
                min-height: 300px;
            }
            footer {
                padding: 1rem;
            }
          }

          @media (max-width: 480px) {
              header {
                padding: 0.8rem 0.5rem;
              }
              header button {
                padding: 0.4rem 0.6rem;
                font-size: 0.8rem;
                margin: 0.3rem 0.3rem;
              }
              nav button {
                font-size: 0.75rem;
                padding: 0.3rem 0.6rem;
              }
              main, section {
                  padding: 1.5rem 0.8rem;
              }
              main h1 {
                  font-size: 2rem;
              }
              main p {
                  font-size: 0.9rem;
              }
              section h2 {
                  font-size: 1.6rem;
              }
              section p {
                  font-size: 0.85rem;
              }
          }
        `}
      </style>
    </div>
  );
}
