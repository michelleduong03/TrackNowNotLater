const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  provider: String,
  subject: String,
  date: String,
  paymentDates: [{
    date: { type: Date },
    amount: { type: Number }
  }],
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
  nextPaymentDate: String,
  nextPaymentAmount: String,
  items: [String],
  snippet: String,
  userEmail: String,
  status: {
    type: String,
    enum: ['active', 'refunded', 'completed'],
    default: 'active'
  },
  note: { type: String, default: '' },
});

module.exports = mongoose.model('Payment', PaymentSchema);