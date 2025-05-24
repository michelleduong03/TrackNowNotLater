const express = require('express');
const { google } = require('googleapis');
const Payment = require('../models/Payment');
const User = require('../models/User');

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
    state: JSON.stringify({ userId: req.userId }),
  });
  res.redirect(authUrl);
});

function extractEmailBody(payload) {
  if (!payload) return '';

  if (payload.mimeType === 'text/plain' || payload.mimeType === 'text/html') {
    const data = payload.body?.data;
    if (data) {
      const decoded = Buffer.from(data, 'base64').toString('utf-8');
      return payload.mimeType === 'text/html'
        ? decoded.replace(/<[^>]+>/g, '') // strip HTML tags
        : decoded;
    }
  }

  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      const result = extractEmailBody(part);
      if (result) return result; // return first found non-empty body
    }
  }

  return '';
}

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
      q: 'subject:(klarna OR "pay in 4" OR "payment due" OR installment OR "1st payment") OR ("klarna order reference" OR "1st payment of $")',
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

      let bodyData = fullMsg.data.payload.parts?.find( // const prev
        (part) => part.mimeType === 'text/plain'
      )?.body?.data;

      if (!bodyData) {
        bodyData = fullMsg.data.payload.parts?.find(
          (part) => part.mimeType === 'text/html'
        )?.body?.data;
      }

      const bodyText = extractEmailBody(fullMsg.data.payload) || fullMsg.data.snippet;


      const merchantMatch = bodyText.match(/Summary\s*([\s\S]*?)\s*Merchant order reference/i);
      const merchantName = merchantMatch ? merchantMatch[1].trim().split('\n')[0].trim() : 'Unknown merchant';

      const klarnaOrderMatch = bodyText.match(/Klarna order reference\s+([A-Z0-9]+)/i);
      const klarnaOrderId = klarnaOrderMatch ? klarnaOrderMatch[1].trim() : 'Unknown';

      const totalMatch = bodyText.match(/(?:Total to pay|Total|Amount)[^\d-]*(-?\$\s?[\d,]+(\.\d{2})?)/i);
      const totalAmount = totalMatch ? totalMatch[1].trim() : 'Not found';

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

      const merchantOrderMatch = bodyText.match(/Merchant order reference\s*[:\-]?\s*([\w\-]+)/i);
      const merchantOrder = merchantOrderMatch ? merchantOrderMatch[1].trim() : 'Unknown';

      const itemsMatch = bodyText.match(/Order details([\s\S]*?)\n\s*\n/i);
      let items = [];
      if (itemsMatch) {
        const lines = itemsMatch[1].split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('$') && !l.startsWith('-$'));
        items = lines;
      }

      // New parsing for payment confirmation email with payments and schedule
      let paymentConfirmed = false;
      let confirmedAmount = 'Not found';
      let nextPaymentAmount = 'Not found';
      let nextPaymentDate = 'Not found';
      let paymentSchedule = [];

      if (/payment.*successful/i.test(bodyText)) {
        paymentConfirmed = true;

        const confirmedMatch = bodyText.match(/payment of\s*\$([\d,.]+)/i);
        if (confirmedMatch) confirmedAmount = `$${confirmedMatch[1]}`;

        const nextPaymentMatch = bodyText.match(/next payment of\s*\$([\d,.]+)\s*will be charged on\s*([A-Za-z]+\s\d{1,2},?\s?\d{0,4})/i);
        if (nextPaymentMatch) {
          nextPaymentAmount = `$${nextPaymentMatch[1]}`;
          nextPaymentDate = nextPaymentMatch[2];
        }

        const scheduleRegex = /([A-Za-z]+\s\d{1,2})\s*\n\s*\$([\d,.]+)/g;
        let match;
        while ((match = scheduleRegex.exec(bodyText)) !== null) {
          paymentSchedule.push({ date: match[1], amount: `$${match[2]}` });
        }
      }

      // Filter for emails containing any payment-related keyword (case-insensitive)
      const foundKeywords = paymentKeywords.filter(keyword =>
        bodyText.toLowerCase().includes(keyword.toLowerCase())
      );

      const fromHeader = headers.find(h => h.name === 'From')?.value || 'Unknown';
      const provider = (() => {
        if (fromHeader.includes('klarna')) return 'Klarna';
        if (fromHeader.includes('affirm')) return 'Affirm';
        if (fromHeader.includes('afterpay')) return 'Afterpay';
        if (fromHeader.includes('zip')) return 'Zip';
        if (fromHeader.includes('sezzle')) return 'Sezzle';
        const match = fromHeader.match(/@([\w.-]+)\.com/);
        return match ? match[1] : 'Unknown';
      })();

      const isForwarded = subject.toLowerCase().startsWith('fwd:') || subject.toLowerCase().startsWith('fw:') 
      || bodyText.toLowerCase().includes('forwarded message') 
      || bodyText.toLowerCase().includes('---------- forwarded message ---------');
      
      const hasKeyInfo = installmentAmount !== 'Not found' && klarnaOrderId !== 'Unknown' && paymentPlan !== 'Not found';
      const hasFollowUpInfo = nextPaymentDate !== 'Not found' || nextPaymentAmount !== 'Not found';

      // const state = req.query.state;
      // let userId;
      // if(state) {
      //   try {
      //     userId = JSON.parse(state).userId;
      //   } catch(e) {
      //     console.error('Invalid OAuth state', e);
      //   }
      // }

      if (!isForwarded && (hasKeyInfo || hasFollowUpInfo)) {
        const hasValidData = totalAmount !== 'Not found';

        const emailPayment = {
          provider,
          subject,
          date,
          merchantName,
          merchantOrder,
          klarnaOrderId,
          totalAmount,
          installmentAmount,
          isFirstPayment,
          paymentPlan,
          orderDate,
          cardUsed,
          discount,
          status,
          nextPaymentDate,
          nextPaymentAmount,
          items,
          snippet: bodyText.substring(0, 300),
        };

        BNPLEmails.push(emailPayment);
      }
    }
 
    try {
      let userId;
      const stateStr = req.query.state || '{}';
      const state = JSON.parse(stateStr);
      userId = state.userId;
  
      await Payment.findOneAndUpdate(
        { user: userId, klarnaOrderId: emailPayment.klarnaOrderId },
          {
            user: userId,
            userEmail: profile.data.emailAddress,
            provider: emailPayment.provider,
            subject: emailPayment.subject,
            date: new Date(emailPayment.date),
            merchantName: emailPayment.merchantName,
            merchantOrder: emailPayment.merchantOrder,
            klarnaOrderId: emailPayment.klarnaOrderId,
            totalAmount: parseFloat(emailPayment.totalAmount.replace(/[^0-9.-]+/g, "")) || 0,
            installmentAmount: parseFloat(emailPayment.installmentAmount.replace(/[^0-9.-]+/g, "")) || 0,
            isFirstPayment: emailPayment.isFirstPayment,
            paymentPlan: emailPayment.paymentPlan,
            orderDate: emailPayment.orderDate,
            cardUsed: emailPayment.cardUsed,
            discount: emailPayment.discount,
            status: emailPayment.status,
            nextPaymentDate: emailPayment.nextPaymentDate === 'Not found' ? null : new Date(emailPayment.nextPaymentDate),
            nextPaymentAmount: parseFloat(emailPayment.nextPaymentAmount.replace(/[^0-9.-]+/g, "")) || 0,
            items: emailPayment.items || [],
            snippet: emailPayment.snippet,
          },
        { upsert: true, new: true }
      );
      } catch (err) {
        console.error('Error upserting payment:', err);
      }
    // res.json({
    //   message: 'Klarna email fetch complete!',
    //   email: profile.data.emailAddress,
    //   user: userId,
    //   tokens,
    //   BNPLEmails,
    // });
    res.redirect(`http://localhost:3000/dashboard?data=${encodeURIComponent(JSON.stringify(BNPLEmails))}`);
  } catch (err) {
    console.error('Error during OAuth callback', err);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;