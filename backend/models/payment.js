const mongoose = require('mongoose')

const payment_schema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  provider: {
    type: String,
    enum: ['stripe', 'paypal', 'cash'],
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('payment', payment_schema)
