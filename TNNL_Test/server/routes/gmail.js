const express = require('express');
const { google } = require('googleapis');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { extractEmailBody } = require('../utils/emailBodyExtraction');
const { parseUpcomingPayments } = require('../utils/parseUpcomingPayments');


const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// Step 1: Auth route
router.get('/auth/google', (req, res) => {
  const userId = req.query.userId;  // get userId from query string
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: JSON.stringify({ userId }),  // pass it here
  });
  res.redirect(authUrl);
});

// // Step 2: Callback and parse Klarna emails with prices
// router.get('/oauth2callback', async (req, res) => {
//   const code = req.query.code;
//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
//     const profile = await gmail.users.getProfile({ userId: 'me' });

//     const resMessages = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'from:affirm.com',
//       // q: 'subject:(klarna OR "pay in 4" OR "payment due" OR installment OR "1st payment") OR ("klarna order reference" OR "1st payment of $")',
//       maxResults: 100,
//     });

//     const messages = resMessages.data.messages || [];
//     const BNPLEmails = [];

//     const paymentKeywords = [
//       'payment', 'due', 'amount', 'installment', 'balance',
//       'next payment', 'due date', '1st payment', '$'
//     ];

//     for (const msg of messages) {
//       const fullMsg = await gmail.users.messages.get({
//         userId: 'me',
//         id: msg.id,
//         format: 'full',
//       });
       
//       const headers = fullMsg.data.payload.headers;
//       const subject = headers.find(h => h.name === 'Subject')?.value || 'No subject';
//       const date = headers.find(h => h.name === 'Date')?.value || 'No date';

//       let bodyData = fullMsg.data.payload.parts?.find( // const prev
//         (part) => part.mimeType === 'text/plain'
//       )?.body?.data;

//       if (!bodyData) {
//         bodyData = fullMsg.data.payload.parts?.find(
//           (part) => part.mimeType === 'text/html'
//         )?.body?.data;
//       }

//       const bodyText = extractEmailBody(fullMsg.data.payload) || fullMsg.data.snippet;

//       const merchantMatch = bodyText.match(/Summary\s*([\s\S]*?)\s*Merchant order reference/i);
//       const merchantName = merchantMatch ? merchantMatch[1].trim().split('\n')[0].trim() : 'Unknown merchant';

//       const klarnaOrderMatch = bodyText.match(/Klarna order reference\s+([A-Z0-9]+)/i);
//       const klarnaOrderId = klarnaOrderMatch ? klarnaOrderMatch[1].trim() : 'Unknown';

//       const totalMatch = bodyText.match(/(?:Total to pay|Total|Amount)[^\d-]*(-?\$\s?[\d,]+(\.\d{2})?)/i);
//       const totalAmount = totalMatch ? totalMatch[1].trim() : 'Not found';

//       let installmentAmount = 'Not found';
//       let isFirstPayment = false;

//       const firstPaymentMatch = bodyText.match(/(?:1st|first)\s+payment[^$]*\$\s?([\d,]+(\.\d{2})?)/i);
//       if (firstPaymentMatch) {
//         installmentAmount = `$${firstPaymentMatch[1].trim()}`;
//         isFirstPayment = true;
//       } else {
//         const genericInstallmentMatch = bodyText.match(/installment[^$]*\$\s?([\d,]+(\.\d{2})?)/i);
//         if (genericInstallmentMatch) {
//           installmentAmount = `$${genericInstallmentMatch[1].trim()}`;
//         }
//       }

//       let paymentPlan = 'Not found';

//       const paymentPlanMatch = bodyText.match(/(?:Payment option|Payment plan)[^\S\r\n]*:?[^\S\r\n]*(Pay in \d+)/i);
//       if (paymentPlanMatch) {
//         paymentPlan = paymentPlanMatch[1].trim();
//       }

//       const orderDateMatch = bodyText.match(/Order placed\s+([A-Za-z]+\s\d{1,2},\s\d{4})/i);
//       const orderDate = orderDateMatch ? orderDateMatch[1].trim() : 'Not found';

//       const cardUsedMatch = bodyText.match(/Payment method\s+.*(\*{4}\s?\d{4})/i);
//       const cardUsed = cardUsedMatch ? cardUsedMatch[1].trim() : 'Not found';

//       const discountMatch = bodyText.match(/Discount\s+(-?\$\s?[\d,]+(\.\d{2})?)/i);
//       const discount = discountMatch ? discountMatch[1].trim() : 'None';

//       const statusMatch = bodyText.match(/Status\s+([A-Za-z]+)/i);
//       const status = statusMatch ? statusMatch[1].trim() : 'Unknown';

//       const merchantOrderMatch = bodyText.match(/Merchant order reference\s*[:\-]?\s*([\w\-]+)/i);
//       const merchantOrder = merchantOrderMatch ? merchantOrderMatch[1].trim() : 'Unknown';

//       const itemsMatch = bodyText.match(/Order details([\s\S]*?)\n\s*\n/i);
//       let items = [];
//       if (itemsMatch) {
//         const lines = itemsMatch[1].split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('$') && !l.startsWith('-$'));
//         items = lines;
//       }

//       // New parsing for payment confirmation email with payments and schedule
//       // let paymentConfirmed = false;
//       // let confirmedAmount = 'Not found';
//       let nextPaymentAmount = 'Not found';
//       let nextPaymentDate = 'Not found';
//       let paymentSchedule = [];

//       if (/payment.*successful/i.test(bodyText)) {
//         paymentConfirmed = true;

//         const confirmedMatch = bodyText.match(/payment of\s*\$([\d,.]+)/i);
//         if (confirmedMatch) confirmedAmount = `$${confirmedMatch[1]}`;

//         const nextPaymentMatch = bodyText.match(/next payment of\s*\$([\d,.]+)\s*will be charged on\s*([A-Za-z]+\s\d{1,2},?\s?\d{0,4})/i);
//         if (nextPaymentMatch) {
//           nextPaymentAmount = `$${nextPaymentMatch[1]}`;
//           nextPaymentDate = nextPaymentMatch[2];
//         }

//         const scheduleRegex = /([A-Za-z]+\s\d{1,2})\s*\n\s*\$([\d,.]+)/g;
//         let match;
//         while ((match = scheduleRegex.exec(bodyText)) !== null) {
//           paymentSchedule.push({ date: match[1], amount: `$${match[2]}` });
//         }
//       }

//       // Filter for emails containing any payment-related keyword (case-insensitive)
//       const foundKeywords = paymentKeywords.filter(keyword =>
//         bodyText.toLowerCase().includes(keyword.toLowerCase())
//       );

//       const fromHeader = headers.find(h => h.name === 'From')?.value || 'Unknown';
//       const provider = (() => {
//         if (fromHeader.includes('klarna')) return 'Klarna';
//         if (fromHeader.includes('affirm')) return 'Affirm';
//         if (fromHeader.includes('afterpay')) return 'Afterpay';
//         if (fromHeader.includes('zip')) return 'Zip';
//         if (fromHeader.includes('sezzle')) return 'Sezzle';
//         const match = fromHeader.match(/@([\w.-]+)\.com/);
//         return match ? match[1] : 'Unknown';
//       })();

//       const isForwarded = subject.toLowerCase().startsWith('fwd:') || subject.toLowerCase().startsWith('fw:') 
//       || bodyText.toLowerCase().includes('forwarded message') 
//       || bodyText.toLowerCase().includes('---------- forwarded message ---------');
      
//       const hasKeyInfo = installmentAmount !== 'Not found' && klarnaOrderId !== 'Unknown' && paymentPlan !== 'Not found';
//       const hasFollowUpInfo = nextPaymentDate !== 'Not found' || nextPaymentAmount !== 'Not found';

//      if (!isForwarded && (hasKeyInfo || hasFollowUpInfo)) {

//       let upcomingPayments = parseUpcomingPayments(bodyText, new Date(date).getFullYear());
//       if (upcomingPayments.length > 0) {
//         console.log(`UPCOMING PAYMENTS ${JSON.stringify(upcomingPayments, null, 2)}`);
//       }
//       if (typeof upcomingPayments === 'string') {
//         upcomingPayments = JSON.parse(upcomingPayments);
//       }

//         const emailPayment = {
//           provider,
//           subject,
//           date,
//           upcomingPayments,
//           merchantName,
//           merchantOrder,
//           klarnaOrderId,
//           totalAmount,
//           installmentAmount,
//           isFirstPayment,
//           paymentPlan,
//           orderDate,
//           cardUsed,
//           discount,
//           status,
//           nextPaymentDate,
//           nextPaymentAmount,
//           items,
//           snippet: bodyText.substring(0, 300),
//         };

//         BNPLEmails.push(emailPayment);


//         // try {
//         //   let userId;
//         //   const stateStr = req.query.state || '{}';
//         //   const state = JSON.parse(stateStr);
//         //   userId = state.userId;

//         //   const identifier = klarnaOrderId !== 'Unknown' ? klarnaOrderId : merchantOrder;

//         //   const existing = await Payment.findOne({
//         //     user: userId,
//         //     $or: [
//         //       { klarnaOrderId },
//         //       { merchantOrder }
//         //     ]
//         //   });

//         //   const paymentData = {
//         //     user: userId,
//         //     userEmail: profile.data.emailAddress,
//         //     provider: emailPayment.provider,
//         //     subject: emailPayment.subject,
//         //     date: new Date(emailPayment.date),
//         //     paymentDates: upcomingPayments,
//         //     merchantName: emailPayment.merchantName,
//         //     merchantOrder: emailPayment.merchantOrder,
//         //     klarnaOrderId: emailPayment.klarnaOrderId,
//         //     totalAmount: parseFloat(emailPayment.totalAmount.replace(/[^0-9.-]+/g, "")) || 0,
//         //     installmentAmount: parseFloat(emailPayment.installmentAmount.replace(/[^0-9.-]+/g, "")) || 0,
//         //     isFirstPayment: emailPayment.isFirstPayment,
//         //     paymentPlan: emailPayment.paymentPlan,
//         //     orderDate: emailPayment.orderDate,
//         //     cardUsed: emailPayment.cardUsed,
//         //     discount: emailPayment.discount,
//         //     status: emailPayment.status,
//         //     nextPaymentDate: emailPayment.nextPaymentDate === 'Not found' ? null : new Date(emailPayment.nextPaymentDate),
//         //     nextPaymentAmount: parseFloat(emailPayment.nextPaymentAmount.replace(/[^0-9.-]+/g, "")) || 0,
//         //     items: emailPayment.items || [],
//         //     snippet: emailPayment.snippet,
//         //   };

//         //   if (existing) {
//         //     const shouldUpdate =
//         //       (paymentData.paymentDates?.length || 0) > (existing.paymentDates?.length || 0) ||
//         //       (!existing.nextPaymentDate && paymentData.nextPaymentDate) ||
//         //       (!existing.installmentAmount && paymentData.installmentAmount) ||
//         //       ((existing.items?.length || 0) < (paymentData.items?.length || 0));


//         //     if (shouldUpdate) {
//         //       await Payment.findByIdAndUpdate(existing._id, { $set: paymentData });
//         //       console.log(`Updated payment for ${identifier}`);
//         //     } else {
//         //       console.log(`Skipped update for ${identifier} – existing data is more complete`);
//         //     }
//         //   } else {
//         //     await Payment.create(paymentData);
//         //     console.log(`Created payment for ${identifier}`);
//         //   }

//         // } catch (err) {
//         //   console.error('Error upserting payment:', err);
//         // }
//       }
//     }
//     let userId;
//           const stateStr = req.query.state || '{}';
//           const state = JSON.parse(stateStr);
//           userId = state.userId;
//     res.json({
//       message: 'Klarna email fetch complete!',
//       email: profile.data.emailAddress,
//       user: userId,
//       tokens,
//       BNPLEmails,
//     });
//     res.redirect(`http://localhost:3000/dashboard?data=${encodeURIComponent(JSON.stringify(BNPLEmails))}`);
//   } catch (err) {
//     console.error('Error during OAuth callback', err);
//     res.status(500).send('Authentication failed');
//   }
// });
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });

    const resMessages = await gmail.users.messages.list({
      userId: 'me',
      q: 'from:(klarna OR affirm OR afterpay OR zip OR sezzle) newer_than:30d',
      maxResults: 100,
    });

    const messages = resMessages.data.messages || [];
    const BNPLEmails = [];

    const paymentKeywords = ['payment', 'due', 'amount', 'installment', 'balance', 'next payment', '1st payment', '$'];
    const providers = ['klarna', 'affirm', 'afterpay', 'zip', 'sezzle'];

    for (const msg of messages) {
      const fullMsg = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      });

      const headers = fullMsg.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No subject';
      const date = headers.find(h => h.name === 'Date')?.value || 'No date';
      const fromHeader = headers.find(h => h.name === 'From')?.value || 'Unknown';

      const bodyText = extractEmailBody(fullMsg.data.payload) || fullMsg.data.snippet;

      const provider = providers.find(p => fromHeader.toLowerCase().includes(p)) || (fromHeader.match(/@([\w.-]+)\.com/)?.[1] || 'Unknown');

      // Try matching merchant in subject first
      const merchantMatchSubject = subject.match(
        /(Merchant|Store)\s*(Name|):\s*(.+)|(?:payment plan|payment received|payment recived|your payment plan for|payment received for)\s+([^\n.,]+)/i
      );

      // Try matching merchant in body text as fallback
      const merchantMatchBody = bodyText.match(
        /(Merchant|Store)\s*(Name|):\s*(.+?)$|(?:payment plan|payment received|payment recived|your payment plan for|payment received for)\s+(.+?)(?=[.,!\n]|$)/im
      );

      let merchantName = 'Unknown merchant';

      function extractMerchantName(match) {
        if (!match) return null;
        let name = null;
        if (match[3]) {
          name = match[3].trim().split('\n')[0];
        } else if (match[4]) {
          name = match[4].trim();
          if (name.toLowerCase().startsWith('for ')) {
            name = name.slice(4).trim();
          }
        }
        return name;
      }

      merchantName = extractMerchantName(merchantMatchBody) || 'Unknown merchant';

      // merchantName = extractMerchantName(merchantMatchSubject) || extractMerchantName(merchantMatchBody) || 'Unknown merchant';

      const orderIdMatch = bodyText.match(
        /(?:Klarna order reference|Your purchase ID is|Loan ID:)\s*[:\-]?\s*([A-Z0-9\-]+)/i
      );
      const orderId = orderIdMatch ? orderIdMatch[1].trim() : 'Unknown';
      
      const totalMatch = bodyText.match(/(?:Total (to pay|amount|):?)\s*(-?\$\s?[\d,.]+)/i);
      const totalAmount = totalMatch ? totalMatch[2].trim() : 'Not found';

      const installmentMatch =
        bodyText.match(/(?:installment|payment)\s*(amount|):?\s*\$([\d,.]+)/i) ||
        bodyText.match(/your payment of\s*\$([\d,.]+)/i);
      const installmentAmount = installmentMatch
        ? `$${(installmentMatch[2] || installmentMatch[1]).trim()}`
        : 'Not found';

      // const installmentAmount = installmentMatch ? `$${installmentMatch[2].trim()}` : 'Not found';

      const paymentPlanMatch = bodyText.match(/Pay in\s+(\d+)/i);
      const paymentPlan = paymentPlanMatch ? `Pay in ${paymentPlanMatch[1]}` : 'Pay in 4';

      // const nextPaymentMatch = bodyText.match(/next payment.*?\$([\d,.]+).*?on\s*([A-Za-z]+\s\d{1,2},?\s?\d{0,4})/i);
      // const nextPaymentAmount = nextPaymentMatch ? `$${nextPaymentMatch[1]}` : 'Not found';
      // const nextPaymentDate = nextPaymentMatch ? nextPaymentMatch[2] : 'Not found';

      const upcomingPayments = parseUpcomingPayments(bodyText, new Date(date).getFullYear());

      let nextPaymentAmount = 'Not found';
      let nextPaymentDate = 'Not found';

      // Try Klarna-style match first
      const klarnaNextMatch = bodyText.match(/next payment of\s*\$([\d,.]+).*?on\s*([A-Za-z]+\s\d{1,2},?\s?\d{0,4})/i);
      if (klarnaNextMatch) {
        nextPaymentAmount = `$${klarnaNextMatch[1]}`;
        nextPaymentDate = klarnaNextMatch[2];
      } else if (upcomingPayments.length > 0) {
        // Fallback to earliest upcoming payment
        const upcoming = upcomingPayments[0];
        nextPaymentAmount = `$${upcoming.amount}`;
        const d = new Date(upcoming.date);
        nextPaymentDate = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
      }

      const emailPayment = {
        provider,
        subject,
        date,
        merchantName,
        klarnaOrderId: orderId, // kept name for frontend compatibility
        merchantOrder: orderId,
        totalAmount,
        installmentAmount,
        paymentPlan,
        nextPaymentDate,
        nextPaymentAmount,
        upcomingPayments,
        snippet: bodyText.substring(0, 300),
      };

      // Only push if it's not a forwarded email and has useful info
      const isForwarded = subject.toLowerCase().startsWith('fwd:') || bodyText.toLowerCase().includes('forwarded message');
      const hasUsefulData = installmentAmount !== 'Not found' || upcomingPayments.length > 0;
      if (!isForwarded && hasUsefulData) {
        BNPLEmails.push(emailPayment);

        // const identifier = emailPayment.klarnaOrderId !== 'Unknown' ? emailPayment.klarnaOrderId : emailPayment.merchantOrder;

        // try {
        //   const existing = await Payment.findOne({
        //     user: userId,
        //     $or: [
        //       { klarnaOrderId: emailPayment.klarnaOrderId },
        //       { merchantOrder: emailPayment.merchantOrder }
        //     ]
        //   });

        //   const paymentData = {
        //     user: userId,
        //     userEmail: profile.data.emailAddress,
        //     provider: emailPayment.provider,
        //     subject: emailPayment.subject,
        //     date: new Date(emailPayment.date),
        //     paymentDates: emailPayment.upcomingPayments,
        //     merchantName: emailPayment.merchantName,
        //     merchantOrder: emailPayment.merchantOrder,
        //     klarnaOrderId: emailPayment.klarnaOrderId,
        //     totalAmount: parseFloat(emailPayment.totalAmount.replace(/[^0-9.-]+/g, "")) || 0,
        //     installmentAmount: parseFloat(emailPayment.installmentAmount.replace(/[^0-9.-]+/g, "")) || 0,
        //     isFirstPayment: emailPayment.isFirstPayment,
        //     paymentPlan: emailPayment.paymentPlan,
        //     orderDate: emailPayment.orderDate,
        //     cardUsed: emailPayment.cardUsed,
        //     discount: emailPayment.discount,
        //     status: emailPayment.status,
        //     nextPaymentDate: emailPayment.nextPaymentDate === 'Not found' ? null : new Date(emailPayment.nextPaymentDate),
        //     nextPaymentAmount: parseFloat(emailPayment.nextPaymentAmount.replace(/[^0-9.-]+/g, "")) || 0,
        //     items: emailPayment.items || [],
        //     snippet: emailPayment.snippet,
        //   };

        //   const shouldUpdate =
        //     (paymentData.paymentDates?.length || 0) > (existing?.paymentDates?.length || 0) ||
        //     (!existing?.nextPaymentDate && paymentData.nextPaymentDate) ||
        //     (!existing?.installmentAmount && paymentData.installmentAmount) ||
        //     ((existing?.items?.length || 0) < (paymentData.items?.length || 0));

        //   if (existing) {
        //     if (shouldUpdate) {
        //       await Payment.findByIdAndUpdate(existing._id, { $set: paymentData });
        //       console.log(`Updated payment for ${identifier}`);
        //     } else {
        //       console.log(`Skipped update for ${identifier} – existing data is more complete`);
        //     }
        //   } else {
        //     await Payment.create(paymentData);
        //     console.log(`Created payment for ${identifier}`);
        //   }

        // } catch (err) {
        //   console.error('Error upserting payment:', err);
        // }
      }
    }

    const stateStr = req.query.state || '{}';
    const userId = JSON.parse(stateStr).userId;

    res.json({
      message: 'BNPL email fetch complete!',
      email: profile.data.emailAddress,
      user: userId,
      tokens,
      BNPLEmails,
    });

    // You can keep or remove this line based on where you want to redirect
    res.redirect(`http://localhost:3000/dashboard?data=${encodeURIComponent(JSON.stringify(BNPLEmails))}`);
  } catch (err) {
    console.error('Error during OAuth callback', err);
    res.status(500).send('Authentication failed');
  }
});


module.exports = router;