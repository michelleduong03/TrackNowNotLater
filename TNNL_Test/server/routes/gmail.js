const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// scopes for Gmail read-only access
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// redirect user to Google's OAuth 2.0 consent screen
router.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  res.redirect(authUrl);
});

// handle Google's callback and exchange code for tokens
router.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
  
      // use Gmail API now
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
      const profile = await gmail.users.getProfile({ userId: 'me' });
  
      // fetch BNPL-related emails here
      const resMessages = await gmail.users.messages.list({
        userId: 'me',
        q: 'subject:(Klarna OR Afterpay OR Affirm) purchase',
        maxResults: 5,
      });
  
      const messages = resMessages.data.messages || [];
  
      // Example: just get the snippet of each message to start
      const snippets = [];
      for (const msg of messages) {
        const fullMsg = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });
        snippets.push(fullMsg.data.snippet);
      }
  
      res.json({
        message: 'Authentication successful!',
        email: profile.data.emailAddress,
        tokens,
        snippets,
      });
    } catch (err) {
      console.error('Error during OAuth callback', err);
      res.status(500).send('Authentication failed');
    }
});  

module.exports = router;
