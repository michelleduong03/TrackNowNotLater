import React from 'react';

const TermsOfUse = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", lineHeight: '1.7', color: '#333' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#222' }}>Terms of Use</h2>
      <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.5rem' }}><em>Last updated: June 25, 2025</em></p>

      <p>
        Welcome to <strong>TrackNowNotLater</strong>. By using our app, you agree to the following terms. If you do not agree, please do not use the app.
      </p>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Use of Our Service</h3>
      <p>
        TrackNowNotLater allows users to track Buy Now, Pay Later (BNPL) purchases by extracting payment details from Gmail (with permission) or through manual input. You must be at least 13 years old to use the app.
      </p>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>User Responsibilities</h3>
      <ul style={{ paddingLeft: '1.2rem' }}>
        <li>Keep your login credentials private and secure.</li>
        <li>Do not use the app for illegal or unauthorized purposes.</li>
        <li>Ensure any manually entered data is truthful and lawful.</li>
      </ul>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Google Account Connection</h3>
      <p>
        When you connect your Gmail account, you authorize us (via secure OAuth) to read only BNPL-related emails. We do not store full email contents unless explicitly saved by you, and your data is used only to enhance your experience.
      </p>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Account Termination</h3>
      <p>
        You can delete your account at any time from your profile page. We reserve the right to suspend or terminate accounts that violate these terms or misuse the app.
      </p>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Intellectual Property</h3>
      <p>
        The TrackNowNotLater name, logo, features, and source code are protected intellectual property. You may not reproduce or repurpose any part of the app without written permission.
      </p>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Limitation of Liability</h3>
      <p>
        We work hard to provide accurate data, but we can’t guarantee every detail. You are responsible for managing your own finances. We are not liable for missed payments, financial loss, or reliance on automated data.
      </p>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Updates to These Terms</h3>
      <p>
        These Terms may change as our app evolves. We will notify you of major updates. Continued use of the app after changes indicates your acceptance.
      </p>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Contact Us</h3>
      <p>
        Have questions? Email us at <a href="mailto:TrackNowNotLater@gmail.com">TrackNowNotLater@gmail.com</a>.
      </p>
    </div>
  );
};

export default TermsOfUse;
