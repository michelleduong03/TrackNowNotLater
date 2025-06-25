import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: 'auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lineHeight: '1.7',
        color: '#333'
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#222' }}>Privacy Policy</h2>
      <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.5rem' }}>
        <em>Last updated: June 23, 2025</em>
      </p>

      <p>
        At <strong>TrackNowNotLater</strong>, your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, and how we keep it safe when you use our platform.
      </p>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>What We Collect</h3>
      <p>
        If you connect your Google account, we request secure, read-only access to your Gmail through OAuth. We only use this access to find Buy Now, Pay Later (BNPL) related emails. We may collect:
      </p>
      <ul style={{ paddingLeft: '1.2rem' }}>
        <li>Merchant names, order IDs, installment plans, and due dates</li>
        <li>Payment amounts and card info (if included in the email)</li>
        <li>Purchases or payments you manually enter into your dashboard</li>
      </ul>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>How We Use Your Information</h3>
      <ul style={{ paddingLeft: '1.2rem' }}>
        <li>To visualize and track your BNPL purchases and payment timelines</li>
        <li>To send helpful reminders and organize your payment history</li>
        <li>To improve the user experience through optional and anonymous usage insights</li>
      </ul>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Security & Data Handling</h3>
      <p>
        Your information is protected with encrypted connections (HTTPS) and secure backend storage. We only store the minimum data required to show your purchases.
      </p>
      <ul style={{ paddingLeft: '1.2rem' }}>
        <li>We never sell or share your data with third parties</li>
        <li>Your Gmail content is not stored unless you save it to your dashboard</li>
        <li>All stored data is tied only to your authenticated account</li>
      </ul>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Google API Compliance</h3>
      <p>
        We comply fully with the
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;Google API Services User Data Policy
        </a>, including the Limited Use requirements. Your Gmail data is used only to find and help you track BNPL activity — never for ads, analytics, or outside use.
      </p>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Your Control</h3>
      <ul style={{ paddingLeft: '1.2rem' }}>
        <li>You may disconnect your Gmail at any time from your profile</li>
        <li>You can remove specific purchases or request full account deletion</li>
        <li>For any data removal or help, email <a href="mailto:TrackNowNotLater@gmail.com">TrackNowNotLater@gmail.com</a></li>
      </ul>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>Contact Us</h3>
      <p>
        Have questions about your data? Email us at
        <a href="mailto:TrackNowNotLater@gmail.com"> TrackNowNotLater@gmail.com</a>. We’re here to help.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
