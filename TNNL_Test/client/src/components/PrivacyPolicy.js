import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.7' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Privacy Policy</h2>
      <p><strong>Last updated:</strong> June 23, 2025</p>

      <p>
        At <strong>TrackNowNotLater</strong>, your privacy is our priority. This Privacy Policy outlines how we collect, use, and safeguard the information you provide when using our platform.
      </p>

      <h3>Information We Collect</h3>
      <p>
        When you connect your Google account, we request read-only access to your Gmail inbox through a secure OAuth flow. This access is used strictly to identify and extract relevant data from Buy Now Pay Later (BNPL) emails. The information includes:
      </p>
      <ul>
        <li>Merchant names, payment amounts, installment plans, and due dates</li>
        <li>Order IDs and details included in those transactional emails</li>
        <li>Manually entered purchases and payment schedules you choose to add</li>
      </ul>

      <h3>How Your Information Is Used</h3>
      <p>
        The data we collect is used solely to help you manage and track your BNPL purchases more effectively. This includes:
      </p>
      <ul>
        <li>Visualizing your current balances and upcoming payment dates</li>
        <li>Helping you avoid late payments by centralizing reminders</li>
        <li>Improving your dashboard experience based on how features are used (anonymously, if at all)</li>
      </ul>

      <h3>Security and Data Handling</h3>
      <p>
        Your data security is important to us. We use industry-standard HTTPS encryption to protect all data transmitted between your device and our servers.
      </p>
      <ul>
        <li>We do not sell, share, or monetize your data.</li>
        <li>Your Gmail content is never stored unless you choose to save parsed payment information to your dashboard.</li>
        <li>Only essential data for your tracking needs is stored in our secure database, associated with your authenticated user ID.</li>
      </ul>

      <h3>Google API Policy Compliance</h3>
      <p>
        Our use of Gmail data complies fully with the 
        <a 
          href="https://developers.google.com/terms/api-services-user-data-policy" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          &nbsp;Google API Services User Data Policy
        </a>, including its Limited Use requirements. We use Gmail data only for BNPL identification and display. No Gmail data is used for advertising or third-party analytics.
      </p>

      <h3>Your Control and Choices</h3>
      <p>
        You are in full control of your data:
      </p>
      <ul>
        <li>You can disconnect your Google account at any time in your settings.</li>
        <li>You can remove specific purchases or all data stored within the app.</li>
        <li>To request complete data deletion, email us at <a href="mailto:TrackNowNotLater@gmail.com">TrackNowNotLater@gmail.com</a>.</li>
      </ul>

      <h3>Contact Us</h3>
      <p>
        If you have any questions or concerns about how your data is handled, please feel free to reach out at 
        <a href="mailto:TrackNowNotLater@gmail.com"> TrackNowNotLater@gmail.com</a>. We're happy to help.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
