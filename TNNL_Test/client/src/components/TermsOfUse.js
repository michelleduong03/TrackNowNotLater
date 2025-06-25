import React from 'react';

const TermsOfUse = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Terms of Use</h2>
      <p><strong>Last updated:</strong> June 25, 2025</p>

      <p>
        Welcome to TrackNowNotLater. By accessing or using our app, you agree to be bound by these Terms of Use.
        Please read them carefully. If you do not agree with these terms, do not use the app.
      </p>

      <h3>Use of Our Service</h3>
      <p>
        TrackNowNotLater helps users track their Buy Now, Pay Later (BNPL) purchases by extracting payment details from connected Gmail accounts or through manual input. You must be at least 13 years old to use our services.
      </p>

      <h3>User Responsibilities</h3>
      <ul>
        <li>You are responsible for keeping your login credentials secure.</li>
        <li>You agree not to use the app for any illegal or unauthorized purposes.</li>
        <li>Any data you provide, including manual entries, must be accurate and lawful.</li>
      </ul>

      <h3>Google Account Connection</h3>
      <p>
        If you choose to connect your Gmail account, you grant us permission to access emails that relate to BNPL transactions.
        This is done via secure OAuth authorization. We only use this access to help you track your purchases.
      </p>

      <h3>Account Termination</h3>
      <p>
        You may delete your account at any time from your profile. We reserve the right to suspend or terminate accounts that
        violate these terms or are involved in malicious behavior.
      </p>

      <h3>Intellectual Property</h3>
      <p>
        All content, branding, and technology associated with TrackNowNotLater are the property of their respective owners.
        You may not copy, modify, or redistribute any part of the service without permission.
      </p>

      <h3>Limitation of Liability</h3>
      <p>
        We strive to provide accurate and helpful data, but we do not guarantee the completeness or accuracy of third-party information.
        You use the app at your own risk. We are not liable for any financial loss or missed payments due to reliance on the app.
      </p>

      <h3>Changes to These Terms</h3>
      <p>
        We may update these Terms of Use from time to time. If changes are significant, we’ll notify users. Your continued use of
        the service means you accept the revised terms.
      </p>

      <h3>Contact</h3>
      <p>
        If you have any questions about these terms, please reach out to us at <a href="mailto:TrackNowNotLater@gmail.com">TrackNowNotLater@gmail.com</a>.
      </p>
    </div>
  );
};

export default TermsOfUse;
