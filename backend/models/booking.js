const mongoose = require('mongoose')

const booking_schema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Ensure your User model is exported as 'user'
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  booking_status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('booking', booking_schema)
