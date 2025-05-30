const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  provider: String,
  subject: String,
  date: String,
  paymentDates: [Date],
  merchantName: String,
  merchantOrder: String,
  klarnaOrderId: String,
  totalAmount: String,
  installmentAmount: String,
  isFirstPayment: Boolean,
  paymentPlan: String,
  orderDate: String,
  cardUsed: String,
  discount: String,
  status: String,
  nextPaymentDate: String,
  nextPaymentAmount: String,
  items: [String],
  snippet: String,
  userEmail: String,
});

module.exports = mongoose.model('Payment', PaymentSchema);