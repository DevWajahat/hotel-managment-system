const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/protect')
const {
  createBooking,
  getMyBookings,
  getBookingDetails,
  searchRooms,
  verifyPayment,
  cancelBooking,
} = require('../controllers/bookingController')

router.get('/search', searchRooms)

router.post('/verify-payment', protect, verifyPayment)

// All booking routes should be protected
router.post('/', protect, createBooking)
router.get('/mybookings', protect, getMyBookings)

router.get('/:id', protect, getBookingDetails)
router.put('/:id/cancel', protect, cancelBooking)
module.exports = router
