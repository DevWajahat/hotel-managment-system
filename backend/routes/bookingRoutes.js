const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/protect')
const {
  createBooking,
  getMyBookings,
  getBookingDetails,
} = require('../controllers/bookingController')

// All booking routes should be protected
router.post('/', protect, createBooking)
router.get('/mybookings', protect, getMyBookings)
router.get('/:id', protect, getBookingDetails)

module.exports = router
