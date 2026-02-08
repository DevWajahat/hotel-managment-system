const mongoose = require('mongoose')

const reserved_room_schema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
    required: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  check_in: {
    type: Date,
    required: true,
  },
  check_out: {
    type: Date,
    required: true,
  },
  price_per_night: {
    type: Number,
    required: true,
  },
  adults_count: {
    type: Number,
    required: true,
    default: 1,
  },
  children_count: {
    type: Number,
    required: true,
    default: 0,
  },
})

module.exports = mongoose.model('reserved_room', reserved_room_schema)
