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
    const BNPLEmails = [];

    const paymentKeywords = [
      'payment', 'due', 'amount', 'installment', 'balance',
      'next payment', 'due date', '1st payment', '$'
    ];

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

      const klarnaOrderMatch = bodyText.match(/Klarna order reference\s+([A-Z0-9]+)/i);
      const klarnaOrderId = klarnaOrderMatch ? klarnaOrderMatch[1].trim() : 'Unknown';

      const totalMatch = bodyText.match(/(?:Total to pay|Total|Amount)[^\d-]*(-?\$\s?[\d,]+(\.\d{2})?)/i);
      const totalAmount = totalMatch ? totalMatch[1].trim() : 'Not found';

      // const installmentMatch = bodyText.match(/(?:1st payment|installment|will be charged)[^\d-]*(-?\$\s?[\d,]+(\.\d{2})?)/i);
      // const installmentAmount = installmentMatch ? installmentMatch[1].trim() : 'Not found';
      let installmentAmount = 'Not found';
      let isFirstPayment = false;

      const firstPaymentMatch = bodyText.match(/(?:1st|first)\s+payment[^$]*\$\s?([\d,]+(\.\d{2})?)/i);
      if (firstPaymentMatch) {
        installmentAmount = `$${firstPaymentMatch[1].trim()}`;
        isFirstPayment = true;
      } else {
        const genericInstallmentMatch = bodyText.match(/installment[^$]*\$\s?([\d,]+(\.\d{2})?)/i);
        if (genericInstallmentMatch) {
          installmentAmount = `$${genericInstallmentMatch[1].trim()}`;
        }
      }

      let paymentPlan = 'Not found';

      const paymentPlanMatch = bodyText.match(/(?:Payment option|Payment plan)[^\S\r\n]*:?[^\S\r\n]*(Pay in \d+)/i);
      if (paymentPlanMatch) {
        paymentPlan = paymentPlanMatch[1].trim();
      }

      const orderDateMatch = bodyText.match(/Order placed\s+([A-Za-z]+\s\d{1,2},\s\d{4})/i);
      const orderDate = orderDateMatch ? orderDateMatch[1].trim() : 'Not found';

      const cardUsedMatch = bodyText.match(/Payment method\s+.*(\*{4}\s?\d{4})/i);
      const cardUsed = cardUsedMatch ? cardUsedMatch[1].trim() : 'Not found';

      const discountMatch = bodyText.match(/Discount\s+(-?\$\s?[\d,]+(\.\d{2})?)/i);
      const discount = discountMatch ? discountMatch[1].trim() : 'None';

      const statusMatch = bodyText.match(/Status\s+([A-Za-z]+)/i);
      const status = statusMatch ? statusMatch[1].trim() : 'Unknown';

      const itemsMatch = bodyText.match(/Order details([\s\S]*?)\n\s*\n/i);
      let items = [];
      if (itemsMatch) {
        const lines = itemsMatch[1].split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('$') && !l.startsWith('-$'));
        items = lines;
      }
        
      // Filter for emails containing any payment-related keyword (case-insensitive)
      const foundKeywords = paymentKeywords.filter(keyword =>
        bodyText.toLowerCase().includes(keyword.toLowerCase())
      );

      if (foundKeywords.length > 0) {
        BNPLEmails.push({
        subject,
        date,
        merchantName,
        klarnaOrderId,
        totalAmount,
        installmentAmount,
        isFirstPayment,
        paymentPlan,
        orderDate,
        cardUsed,
        discount,
        status,
        items,
        snippet: bodyText.substring(0, 300),
      });
      }
    }

    res.json({
      message: 'Klarna email fetch complete!',
      email: profile.data.emailAddress,
      tokens,
      BNPLEmails,
    });
  } catch (err) {
    console.error('Error during OAuth callback', err);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;