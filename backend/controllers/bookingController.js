const Booking = require('../models/booking')
const ReservedRoom = require('../models/reserved_room')
const Payment = require('../models/payment')
const Room = require('../models/room')
const RoomType = require('../models/room_types')

const createBooking = async (req, res) => {
  const { rooms_data, payment_info } = req.body

  try {
    let totalAmount = 0

    for (const item of rooms_data) {
      const room = await Room.findById(item.room_id).populate('room_type')
      if (!room) {
        return res
          .status(404)
          .json({ message: `Room ${item.room_id} not found` })
      }

      const checkIn = new Date(item.check_in)
      const checkOut = new Date(item.check_out)
      const diffTime = Math.abs(checkOut - checkIn)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      const priceForRoom = room.room_type.price * diffDays
      totalAmount += priceForRoom
    }

    const booking = await Booking.create({
      customer_id: req.user._id,
      total_amount: totalAmount,
      payment_status: 'paid',
      booking_status: 'confirmed',
    })

    const reservationPromises = rooms_data.map(async (item) => {
      const room = await Room.findById(item.room_id).populate('room_type')
      return ReservedRoom.create({
        booking_id: booking._id,
        room_id: item.room_id,
        check_in: item.check_in,
        check_out: item.check_out,
        price_per_night: room.room_type.price,
        adults_count: item.adults,
        children_count: item.children,
      })
    })

    await Promise.all(reservationPromises)

    await Payment.create({
      booking_id: booking._id,
      amount: totalAmount,
      provider: payment_info.provider,
      transaction_id: payment_info.transaction_id,
      status: 'success',
    })

    res.status(201).json({
      message: 'Booking successful',
      booking_id: booking._id,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer_id: req.user._id }).sort({
      created_at: -1,
    })

    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (
      booking.customer_id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    const reservedRooms = await ReservedRoom.find({
      booking_id: booking._id,
    }).populate('room_id')

    res.json({
      booking,
      rooms: reservedRooms,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createBooking, getMyBookings, getBookingDetails }
