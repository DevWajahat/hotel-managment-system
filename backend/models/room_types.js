const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomTypeSchema = new Schema({
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  // New fields for capacity
  max_adults: {
    type: Number,
    required: true,
    default: 2, // reasonable default
  },
  max_children: {
    type: Number,
    required: true,
    default: 0,
  },
  image: { type: String },
  description: {
    type: String,
    required: false, // Helpful for the text under the room name like "Cozy & functional"
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('RoomType', RoomTypeSchema)
