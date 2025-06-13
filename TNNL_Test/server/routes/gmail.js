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
    state: JSON.stringify({ userId }),
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

    // check for refund
    // const resMessages = await gmail.users.messages.list({
    //   userId: 'me',
    //   q: 'newer_than:60d (from:(klarna OR affirm OR afterpay OR zip OR sezzle) OR subject:("pay in 4" OR "payment due" OR installment OR "1st payment" OR "klarna order reference" OR "payment received" OR refund))',
    //   maxResults: 100,
    // });
    const resMessages = await gmail.users.messages.list({
  userId: 'me',
  q: 'newer_than:60d from:(klarna OR affirm OR afterpay OR zip OR sezzle)',
  maxResults: 200,
});


    const messages = resMessages.data.messages || [];
    const BNPLEmails = [];

    const paymentKeywords = ['payment', 'due', 'amount', 'installment', 'balance', 'next payment', '1st payment', '$'];
    const providers = ['Klarna', 'Affirm', 'Afterpay', 'Zip', 'Sezzle'];

    const orderDateMap = {}; 

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

      const provider = providers.find(p => fromHeader.includes(p)) || (fromHeader.match(/@([\w.-]+)\.com/)?.[1] || 'Unknown');

      const merchantMatchSubject = subject.match(
        /(Merchant|Store)\s*(Name|):\s*(.+)|(?:payment plan|payment received|payment recived|your payment plan for|payment received for)\s+([^\n.,]+)/i
      );

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

      merchantName = extractMerchantName(merchantMatchBody) || extractMerchantName(merchantMatchSubject) || 'Unknown merchant';

      const orderIdMatch = bodyText.match(
        /(?:Klarna order reference|Your purchase ID is|Loan ID:)\s*[:\-]?\s*([A-Z0-9\-]+)/i
      );
      const orderId = orderIdMatch ? orderIdMatch[1].trim() : 'Unknown';
 
      const totalMatch = bodyText.match(/(?:Total (to pay|amount|):?)\s*(-?\$\s?[\d,.]+)/i);
      let totalAmount;

      if (totalMatch) {
        totalAmount = totalMatch[2].trim();
      } else {
        const allAmounts = [...bodyText.matchAll(/\$\s?[\d,.]+/g)];

        const totalFromEmail = allAmounts.reduce((sum, match) => {
          const amount = parseFloat(match[0].replace(/[^0-9.]/g, ''));
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        totalAmount = totalFromEmail > 0 ? `$${totalFromEmail.toFixed(2)}` : 'Not found';
      }

      const orderDateMatch = bodyText.match(/Order placed\s+([A-Za-z]+\s\d{1,2},\s\d{4})/i);
      let orderDateCandidate = orderDateMatch ? orderDateMatch[1].trim() : null;

      if (!orderDateCandidate) {
        orderDateCandidate = new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }

      const candidateDateObj = new Date(orderDateCandidate);
      const idKey = orderId;

      if (!orderDateMap[idKey] || candidateDateObj < orderDateMap[idKey]) {
        orderDateMap[idKey] = candidateDateObj;
      }

      const installmentMatch =
        bodyText.match(/(?:installment|payment)\s*(amount|):?\s*\$([\d,.]+)/i) ||
        bodyText.match(/your payment of\s*\$([\d,.]+)/i);
      const installmentAmount = installmentMatch
        ? `$${(installmentMatch[2] || installmentMatch[1]).trim()}`
        : 'Not found';

      const paymentPlanMatch = bodyText.match(/Pay in\s+(\d+)/i);
      const paymentPlan = paymentPlanMatch ? `Pay in ${paymentPlanMatch[1]}` : 'Pay in 4';

      // let upcomingPayments = parseUpcomingPayments(bodyText, new Date(date).getFullYear());
      // if (upcomingPayments.length > 0) {
      //   console.log(`UPCOMING PAYMENTS ${JSON.stringify(upcomingPayments, null, 2)}`);
      // }
      // if (typeof upcomingPayments === 'string') {
      //   upcomingPayments = JSON.parse(upcomingPayments);
      // }
      let upcomingPayments = parseUpcomingPayments(bodyText, new Date(date).getFullYear());

      if (typeof upcomingPayments === 'string') {
        upcomingPayments = JSON.parse(upcomingPayments);
      }

      if (upcomingPayments.length > 0) {
        console.log(`UPCOMING PAYMENTS ${JSON.stringify(upcomingPayments, null, 2)}`);
      }

      // Handle missing 1st payment for "Pay in 4"
      if (paymentPlan.toLowerCase() === 'pay in 4' && upcomingPayments.length === 3) {
        const totalAmountMatch = bodyText.match(/(?:total|order amount|purchase amount)[^\d]*([\d,.]+)/i);
        const totalAmount = totalAmountMatch ? parseFloat(totalAmountMatch[1].replace(/,/g, '')) : null;

        if (totalAmount && !upcomingPayments.some(p => new Date(p.date).getTime() === new Date(date).getTime())) {
          const amountPerInstallment = +(totalAmount / 4).toFixed(2);
          upcomingPayments.unshift({
            date: date, // the original order date
            amount: amountPerInstallment
          });
        }
      }

      let nextPaymentAmount = 'Not found';
      let nextPaymentDate = 'Not found';

      const klarnaNextMatch = bodyText.match(/next payment of\s*\$([\d,.]+).*?on\s*([A-Za-z]+\s\d{1,2},?\s?\d{0,4})/i);
      if (klarnaNextMatch) {
        nextPaymentAmount = `$${klarnaNextMatch[1]}`;
        nextPaymentDate = klarnaNextMatch[2];
      } else if (upcomingPayments.length > 0) {
        const upcoming = upcomingPayments[0];
        nextPaymentAmount = `$${upcoming.amount}`;
        const d = new Date(upcoming.date);
        nextPaymentDate = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
      }

      const refundKeywords = [
        'refund issued',
        'refunded',
        'your refund',
        'payment refund',
        'refund processed',
        'refund received',
        'refund approved',
        'refund'
        ];

      let refundSource = null;

      // const isRefunded = refundKeywords.some(keyword =>
      //   subject.toLowerCase().includes(keyword) || bodyText.toLowerCase().includes(keyword)
      // );

      let isRefunded = false;

      for (const keyword of refundKeywords) {
        const keywordLower = keyword.toLowerCase();

        if (subject.toLowerCase().includes(keywordLower)) {
          isRefunded = true;
          console.log(`Refund detected in SUBJECT for ${merchantName} | Order ID: ${orderId} | Subject contains "${keyword}"`);
          break;
        }

        if (bodyText.toLowerCase().includes(keywordLower)) {
          const bodyLines = bodyText.split('\n');
          for (const line of bodyLines) {
            if (
              line.toLowerCase().includes(keywordLower) &&
              !line.toLowerCase().includes("klarna balance") &&
              !line.toLowerCase().includes("cashback") &&
              !line.toLowerCase().includes("unlock") &&
              !line.toLowerCase().includes("gift card") &&
              !line.toLowerCase().includes("download the app") &&
              !line.toLowerCase().includes("view in browser")
            ) {
              isRefunded = true;
              console.log(`Refund detected in BODY for ${merchantName} | Order ID: ${orderId} | Line: "${line.trim()}"`);
              break;
            }
          }
        }

        if (isRefunded) break;
      }

      const emailPayment = {
        provider,
        subject,
        date,
        orderDate: orderDateMap[orderId]
        ? orderDateMap[orderId].toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })
        : orderDateCandidate,
        merchantName,
        klarnaOrderId: orderId,
        merchantOrder: orderId,
        totalAmount,
        installmentAmount,
        paymentPlan,
        nextPaymentDate,
        nextPaymentAmount,
        upcomingPayments,
        snippet: bodyText.substring(0, 300),
      };

      if (isRefunded) {
        emailPayment.status = 'refunded';
        console.log(`Refund detected for ${merchantName} | Order ID: ${orderId} | ${refundSource}`);
      } else {
        const now = new Date();
        const allPaymentsCompleted = emailPayment.upcomingPayments.length > 0 &&
          emailPayment.upcomingPayments.every(p => new Date(p.date) < now);
        emailPayment.status = allPaymentsCompleted ? 'completed' : 'active';
      }

      console.log (`TOTAl AMOUNT ${totalAmount}`)

      const now = new Date();

      if (emailPayment.nextPaymentDate && emailPayment.nextPaymentDate !== 'Not found') {
        let nextDate = new Date(emailPayment.nextPaymentDate);
        if (nextDate < now) {
          const futurePayment = emailPayment.upcomingPayments.find(p => new Date(p.date) > now);
          if (futurePayment) {
            emailPayment.nextPaymentDate = new Date(futurePayment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            emailPayment.nextPaymentAmount = `$${futurePayment.amount}`;
          } else {
            emailPayment.nextPaymentDate = null;
            emailPayment.nextPaymentAmount = '0';
          }
        }
      }

      const isForwarded = subject.toLowerCase().startsWith('fwd:') || bodyText.toLowerCase().includes('forwarded message');
      const hasUsefulData = installmentAmount !== 'Not found' || upcomingPayments.length > 0;
      if (!isForwarded && hasUsefulData) {
        BNPLEmails.push(emailPayment);

        const identifier = emailPayment.klarnaOrderId !== 'Unknown' ? emailPayment.klarnaOrderId : emailPayment.merchantOrder;

        try {
          const stateStr = req.query.state || '{}';
          const userId = JSON.parse(stateStr).userId;
          const existing = await Payment.findOne({
            user: userId,
            $or: [
              { klarnaOrderId: emailPayment.klarnaOrderId },
              { merchantOrder: emailPayment.merchantOrder }
            ]
          });

          const paymentData = {
            user: userId,
            userEmail: profile.data.emailAddress,
            provider: emailPayment.provider,
            subject: emailPayment.subject,
            date: new Date(emailPayment.date),
            paymentDates: emailPayment.upcomingPayments,
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
            status: emailPayment.status,
          };

          const statusChanged = existing?.status !== paymentData.status;

          const shouldUpdate =
            statusChanged ||
            (paymentData.paymentDates?.length || 0) > (existing?.paymentDates?.length || 0) ||
            (!existing?.nextPaymentDate && paymentData.nextPaymentDate) ||
            (!existing?.installmentAmount && paymentData.installmentAmount) ||
            ((existing?.items?.length || 0) < (paymentData.items?.length || 0));

          if (existing) {
            if (shouldUpdate) {
              await Payment.findByIdAndUpdate(existing._id, { $set: paymentData });
              console.log(`Updated payment for ${identifier}`);
            } else {
              console.log(`Skipped update for ${identifier} – existing data is more complete`);
            }
          } else {
            await Payment.create(paymentData);
            console.log(`Created payment for ${identifier}`);
          }

        } catch (err) {
          console.error('Error upserting payment:', err);
        }
      }
    }

    // const stateStr = req.query.state || '{}';
    // const userId = JSON.parse(stateStr).userId;

    // res.json({
    //   message: 'BNPL email fetch complete!',
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