const express = require('express');
const jwt = require('jsonwebtoken');
const Payment = require('../models/Payment');

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if(!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /api/payments called');
  console.log('Request body:', req.body);
  console.log('User ID from token:', req.userId);
  try {
    console.log('Payment data received:', req.body);

    const paymentData = {
      user: req.userId,
      provider: req.body.provider,
      subject: req.body.subject,
      date: req.body.date,
      merchantName: req.body.merchantName,
      klarnaOrderId: req.body.klarnaOrderId,
      merchantOrder: req.body.merchantOrder,
      totalAmount: req.body.totalAmount,
      installmentAmount: req.body.installmentAmount,
      isFirstPayment: req.body.isFirstPayment,
      paymentPlan: req.body.paymentPlan,
      orderDate: req.body.orderDate,
      cardUsed: req.body.cardUsed,
      discount: req.body.discount,
      status: req.body.status,
      nextPaymentDate: req.body.nextPaymentDate,
      nextPaymentAmount: req.body.nextPaymentAmount,
      items: req.body.items,
      snippet: req.body.snippet,
      userEmail: req.body.userEmail,
      note: req.body.note || '',
      paymentDates: req.body.paymentDates || []
    };

    const payment = new Payment(paymentData);
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.userId });

    const uniqueMap = new Map();

    for (const payment of payments) {
      const key = payment.klarnaOrderId || payment.merchantOrder || payment._id.toString();
      const existing = uniqueMap.get(key);

      const isBetter =
        !existing ||
        (payment.paymentDates.length > (existing.paymentDates?.length || 0)) ||
        (!existing.nextPaymentDate && payment.nextPaymentDate) ||
        ((payment.items?.length || 0) > (existing.items?.length || 0));

      if (isBetter) {
        uniqueMap.set(key, payment);
      }
    }

    const dedupedPayments = Array.from(uniqueMap.values());
    dedupedPayments.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)); // optional

    res.json(dedupedPayments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const purchases = await Payment.find({ user: userId });
    console.log('Payments for user:', userId);
    console.log(JSON.stringify(purchases, null, 2));
    res.json(purchases);
  } catch (err) {
    res.status(500).send('Error fetching purchases');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPayment) {
      return res.status(404).send({ error: 'Payment not found' });
    }
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update payment' });
  }
});

// delete payments
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (payment.user.toString() !== req.userId)
      return res.status(403).json({ error: 'Unauthorized' });

    await payment.deleteOne();
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
