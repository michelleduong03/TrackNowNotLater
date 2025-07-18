import React from 'react';

const TermsOfUse = () => {
  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '4rem auto',
        padding: '3rem 2rem',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Lora, serif',
        color: '#1a202c',
      }}
    >
      <h1 style={{ fontSize: '2.75rem', marginBottom: '1rem', color: '#1f2937', textAlign: 'center' }}>
        Terms of Use
      </h1>
      <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '1rem', marginBottom: '3rem' }}>
        <em>Last updated: June 25, 2025</em>
      </p>

      <section style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#374151' }}>
          Welcome to <strong>TrackNowNotLater</strong>. By using our app, you agree to the following terms. If you do not agree, please do not use the app.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#111827' }}>Use of Our Service</h2>
        <p style={{ fontSize: '1.05rem', color: '#374151' }}>
          TrackNowNotLater allows users to track Buy Now, Pay Later (BNPL) purchases by extracting payment details from Gmail (with permission) or through manual input. You must be at least 13 years old to use the app.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#111827' }}>User Responsibilities</h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '1.05rem', color: '#374151' }}>
          <li>Keep your login credentials private and secure.</li>
          <li>Do not use the app for illegal or unauthorized purposes.</li>
          <li>Ensure any manually entered data is truthful and lawful.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#111827' }}>Google Account Connection</h2>
        <p style={{ fontSize: '1.05rem', color: '#374151' }}>
          When you connect your Gmail account, you authorize us (via secure OAuth) to read only BNPL-related emails. We do not store full email contents unless explicitly saved by you, and your data is used only to enhance your experience.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#111827' }}>Account Termination</h2>
        <p style={{ fontSize: '1.05rem', color: '#374151' }}>
          You can delete your account at any time from your profile page. We reserve the right to suspend or terminate accounts that violate these terms or misuse the app.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#111827' }}>Intellectual Property</h2>
        <p style={{ fontSize: '1.05rem', color: '#374151' }}>
          The TrackNowNotLater name, logo, features, and source code are protected intellectual property. You may not reproduce or repurpose any part of the app without written permission.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#111827' }}>Limitation of Liability</h2>
        <p style={{ fontSize: '1.05rem', color: '#374151' }}>
          We work hard to provide accurate data, but we can’t guarantee every detail. You are responsible for managing your own finances. We are not liable for missed payments, financial loss, or reliance on automated data.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#111827' }}>Updates to These Terms</h2>
        <p style={{ fontSize: '1.05rem', color: '#374151' }}>
          These Terms may change as our app evolves. We will notify you of major updates. Continued use of the app after changes indicates your acceptance.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#111827' }}>Contact Us</h2>
        <p style={{ fontSize: '1.05rem', color: '#374151' }}>
          Have questions? Email us at
          <a
            href="mailto:tracknownotlater@gmail.com"
            style={{ color: '#3b82f6', textDecoration: 'none', marginLeft: '4px' }}
          >
            tracknownotlater@gmail.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default TermsOfUse;
