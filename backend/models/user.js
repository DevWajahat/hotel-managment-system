const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const UserSchema = new Schema({
  full_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  is_verified: { type: Boolean, default: false },
  verification_token: { type: String },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('User', UserSchema)
