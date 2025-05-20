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
    // const payment = new Payment({ user: req.userId, ...req.body });
    // await payment.save();
    console.log('Payment data received:', req.body);
    const paymentData = {
      user: req.userId,
      provider: req.body.merchantName,
      purchaseAmount: Number(req.body.totalAmount),
      installments: Number(req.body.paymentPlan),
      firstDueDate: new Date(req.body.orderDate),
      description: req.body.description || '',
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
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
