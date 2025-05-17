// const express = require('express');
// const { google } = require('googleapis');

// const router = express.Router();

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

// // Gmail scopes
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// // Redirect to Google's OAuth 2.0 consent screen
// router.get('/auth/google', (req, res) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//     prompt: 'consent',
//   });
//   res.redirect(authUrl);
// });

// // Callback after OAuth consent
// router.get('/oauth2callback', async (req, res) => {
//   const code = req.query.code;
//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
//     const profile = await gmail.users.getProfile({ userId: 'me' });

//     const resMessages = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'subject:(Klarna OR Afterpay OR Affirm) purchase',
//       maxResults: 5,
//     });

//     const messages = resMessages.data.messages || [];
//     const parsedMessages = [];

//     for (const msg of messages) {
//       const fullMsg = await gmail.users.messages.get({
//         userId: 'me',
//         id: msg.id,
//         format: 'full',
//       });

//       // Extract plain text content
//       const bodyData = fullMsg.data.payload.parts?.find(
//         (part) => part.mimeType === 'text/plain'
//       )?.body?.data;

//       if (bodyData) {
//         const decodedBody = Buffer.from(bodyData, 'base64').toString('utf-8');
//         const parsed = parseBNPL(decodedBody);
//         if (parsed) parsedMessages.push(parsed);
//       }
//     }

//     res.json({
//       message: 'Authentication successful!',
//       email: profile.data.emailAddress,
//       tokens,
//       purchases: parsedMessages,
//     });
//   } catch (err) {
//     console.error('Error during OAuth callback', err);
//     res.status(500).send('Authentication failed');
//   }
// });

// // Helper: Extract BNPL info
// function parseBNPL(text) {
//   const provider = /Klarna|Afterpay|Affirm/i.exec(text)?.[0] || null;
//   const amount = /\$[\d,]+\.\d{2}/.exec(text)?.[0] || null;
//   const dueDate = /due\s+(on\s+)?([A-Z][a-z]{2,9} \d{1,2}, \d{4})/i.exec(text)?.[2] || null;

//   if (!provider || !amount) return null;

//   return {
//     provider,
//     amount,
//     dueDate: dueDate || "N/A",
//   };
// }

// module.exports = router;
const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// Step 1: Auth route
router.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  res.redirect(authUrl);
});

// Step 2: Callback and parse Klarna emails with prices
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });

    const resMessages = await gmail.users.messages.list({
      userId: 'me',
      q: 'from:@klarna.com',
      maxResults: 100,
    });

    const messages = resMessages.data.messages || [];
    const indeedEmails = [];

    const paymentKeywords = [
      'payment', 'due', 'amount', 'installment', 'balance',
      'next payment', 'due date', '1st payment', '$'
    ];

    // Regex to find price amounts like $12.34, $1,234.56 etc.
    const priceRegex = /\$\s?[\d,]+(\.\d{2})?/g;

    for (const msg of messages) {
      const fullMsg = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      });

      const headers = fullMsg.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No subject';
      const date = headers.find(h => h.name === 'Date')?.value || 'No date';

      const bodyData = fullMsg.data.payload.parts?.find(
        (part) => part.mimeType === 'text/plain'
      )?.body?.data;

      const bodyText = bodyData
        ? Buffer.from(bodyData, 'base64').toString('utf-8')
        : fullMsg.data.snippet;
      
      const merchantMatch = bodyText.match(/Summary\s*([\s\S]*?)\s*Merchant order reference/i);
      const merchantName = merchantMatch ? merchantMatch[1].trim().split('\n')[0].trim() : 'Unknown merchant';
        
      // Filter for emails containing any payment-related keyword (case-insensitive)
      const foundKeywords = paymentKeywords.filter(keyword =>
        bodyText.toLowerCase().includes(keyword.toLowerCase())
      );

      // Extract prices from the body text
      const prices = bodyText.match(priceRegex) || [];

      if (foundKeywords.length > 0) {
        indeedEmails.push({
          subject,
          date,
          snippet: bodyText.substring(0, 300),
          foundKeywords,
          prices,
          merchantName,
        });
      }
    }

    res.json({
      message: 'Klarna email fetch complete!',
      email: profile.data.emailAddress,
      tokens,
      indeedEmails,
    });
  } catch (err) {
    console.error('Error during OAuth callback', err);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
