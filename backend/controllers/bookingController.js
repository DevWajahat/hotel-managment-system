const Booking = require('../models/booking')
const ReservedRoom = require('../models/reserved_room')
const Payment = require('../models/payment')
const Room = require('../models/room')
const RoomType = require('../models/room_types')
const axios = require('axios')

// 1. CREATE BOOKING (The Smart Version)
const createBooking = async (req, res) => {
	const { rooms_data } = req.body

	try {
		let totalAmount = 0
		const assignedRooms = []

		// --- FIX 1: TRACK ROOMS ASSIGNED IN THIS SESSION ---
		// We start with rooms already busy in the DB
		let temporaryBusyIds = []

		// PROCESS EACH ROOM REQUEST
		for (const item of rooms_data) {
			const checkIn = new Date(item.check_in)
			const checkOut = new Date(item.check_out)

			// 1. Get DB Busy Rooms (Reservations)
			const dbBusyRooms = await ReservedRoom.find({
				$or: [{ check_in: { $lt: checkOut }, check_out: { $gt: checkIn } }],
			}).select('room_id')

			const dbBusyIds = dbBusyRooms.map((r) => r.room_id.toString())

			// 2. COMBINE DB BUSY + LOCALLY ASSIGNED BUSY
			// This prevents the loop from picking the same room twice
			const allBusyIds = [...dbBusyIds, ...temporaryBusyIds]

			// 3. Find one room that matches Type AND is not in our exclusion list
			const availableRoom = await Room.findOne({
				room_type: item.room_type_id,
				_id: { $nin: allBusyIds }, // <--- Key Change
			}).populate('room_type')

			if (!availableRoom) {
				return res.status(400).json({
					message: `Not enough rooms available for type: ${item.room_type_id}`
				})
			}

			// --- FIX 2: MARK THIS ROOM AS BUSY IMMEDIATELY ---
			temporaryBusyIds.push(availableRoom._id.toString())

			// Calculate Price
			const diffTime = Math.abs(checkOut - checkIn)
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
			const priceForRoom = availableRoom.room_type.price * diffDays
			totalAmount += priceForRoom

			assignedRooms.push({
				room_id: availableRoom._id,
				price_per_night: availableRoom.room_type.price,
				check_in: checkIn,
				check_out: checkOut,
				adults: item.adults,
				children: item.children,
			})
		}

		// ... (Rest of the code: Save Booking, Save Reservations, Stripe) ...

		// SAVE BOOKING
		const booking = await Booking.create({
			customer_id: req.user._id,
			total_amount: totalAmount,
			payment_status: 'pending',
			booking_status: 'pending',
		})

		const reservationPromises = assignedRooms.map((data) => {
			return ReservedRoom.create({
				booking_id: booking._id,
				room_id: data.room_id, // This is now guaranteed to be unique
				check_in: data.check_in,
				check_out: data.check_out,
				price_per_night: data.price_per_night,
				adults_count: data.adults,
				children_count: data.children,
			})
		})
		await Promise.all(reservationPromises)


		// --- C. RAW STRIPE REQUEST (Replacing SDK) ---
		// We construct the body exactly like the curl -d flags
		const params = new URLSearchParams()

		params.append(
			'success_url',
			`${process.env.CLIENT_URL}/guests/success?booking_id=${booking._id}&session_id={CHECKOUT_SESSION_ID}`,
		)
		params.append('cancel_url', `${process.env.CLIENT_URL}/guests/dashboard`)
		params.append('mode', 'payment')

		// Mimicking: -d "line_items[0][price_data][...]"
		// We use price_data because we are sending a custom amount (totalAmount)
		params.append('line_items[0][price_data][currency]', 'usd')
		params.append(
			'line_items[0][price_data][product_data][name]',
			'Hotel Reservation',
		)
		params.append(
			'line_items[0][price_data][product_data][description]',
			`Booking #${booking._id}`,
		)
		params.append(
			'line_items[0][price_data][unit_amount]',
			Math.round(totalAmount * 100),
		) // Cents
		params.append('line_items[0][quantity]', 1)

		// Hit the API directly
		const stripeResponse = await axios.post(
			'https://api.stripe.com/v1/checkout/sessions',
			params,
			{
				headers: {
					// This matches -u "sk_test_...:"
					Authorization: `Bearer ${process.env.STRIPE_SECRET}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			},
		)

		// --- D. RETURN URL ---
		res.status(201).json({ url: stripeResponse.data.url })
	} catch (error) {
		console.error('Stripe Error:', error.response?.data || error.message)
		res.status(500).json({ message: error.message })
	}
}

// 2. VERIFY PAYMENT (Raw API Version)
const verifyPayment = async (req, res) => {
	const { booking_id, session_id } = req.body

	try {
		// Check status directly via API
		const response = await axios.get(
			`https://api.stripe.com/v1/checkout/sessions/${session_id}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.STRIPE_SECRET}`,
				},
			},
		)

		const session = response.data

		if (session.payment_status === 'paid') {
			await Booking.findByIdAndUpdate(booking_id, {
				payment_status: 'paid',
				booking_status: 'confirmed',
			})

			await Payment.create({
				booking_id: booking_id,
				amount: session.amount_total / 100,
				provider: 'stripe',
				transaction_id: session.payment_intent, // This is the actual TXN ID
				status: 'success',
			})

			res.json({ message: 'Payment verified' })
		} else {
			res.status(400).json({ message: 'Payment pending or failed' })
		}
	} catch (error) {
		console.error(error.response?.data || error.message)
		res.status(500).json({ message: error.message })
	}
}

// 2. GET MY BOOKINGS (Restored)
const getMyBookings = async (req, res) => {
	try {
		// 1. Get all bookings for this user
		const bookings = await Booking.find({ customer_id: req.user._id })
			.sort({ createdAt: -1 })
			.lean() // Use lean() for better performance

		// 2. For each booking, fetch the specific rooms reserved
		const enrichedBookings = await Promise.all(
			bookings.map(async (booking) => {
				const reserved = await ReservedRoom.find({
					booking_id: booking._id,
				}).populate({
					path: 'room_id',
					populate: { path: 'room_type' }, // Nested populate to get "Deluxe Suite" name
				})

				return {
					...booking,
					items: reserved, // Attach room details here
				}
			}),
		)

		res.json(enrichedBookings)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// 3. GET BOOKING DETAILS (Restored)
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

const cancelBooking = async (req, res) => {
	try {
		const booking = await Booking.findById(req.params.id)

		if (!booking) return res.status(404).json({ message: 'Booking not found' })

		// Authorization Check
		if (booking.customer_id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ message: 'Not authorized' })
		}

		// Logic: Can only cancel if Check-in is in the future?
		// For now, let's allow it but you might want to add a date check here.

		// 1. Update Booking Status
		booking.booking_status = 'cancelled'
		await booking.save()

		// 2. Free up the rooms (Delete the reservations)
		await ReservedRoom.deleteMany({ booking_id: booking._id })

		res.json({ message: 'Booking cancelled successfully' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const searchRooms = async (req, res) => {
	try {
		const { from, to, adults, children, rooms_count } = req.query

		// 1. Parse Inputs
		const checkInDate = new Date(from)
		const checkOutDate = new Date(to)
		const reqRoomsCount = parseInt(rooms_count) || 1
		const reqAdults = parseInt(adults) || 1
		const reqChildren = parseInt(children) || 0

		// 2. Find "Forbidden" Rooms (already reserved)
		const occupiedReservations = await ReservedRoom.find({
			$or: [
				{
					check_in: { $lt: checkOutDate },
					check_out: { $gt: checkInDate },
				},
			],
		}).select('room_id')

		const occupiedRoomIds = occupiedReservations.map((r) => r.room_id)

		// 3. Find Available Physical Rooms
		const availablePhysicalRooms = await Room.find({
			_id: { $nin: occupiedRoomIds },
		}).populate('room_type')

		// 4. Group by Type
		const groupedResults = {}

		availablePhysicalRooms.forEach((room) => {
			const type = room.room_type
			if (!type) return

			// --- LOGIC FIX START ---

			// Calculate Total Capacity of the requested number of rooms
			const totalAdultCapacity = type.max_adults * reqRoomsCount
			const totalChildCapacity = type.max_children * reqRoomsCount

			// Check if TOTAL capacity meets the requirement
			if (totalAdultCapacity < reqAdults || totalChildCapacity < reqChildren) {
				return // Skip this type only if the COMBINED rooms are still too small
			}

			// --- LOGIC FIX END ---

			if (!groupedResults[type._id]) {
				groupedResults[type._id] = {
					_id: type._id,
					type: type.type,
					price: type.price,
					description: type.description,
					max_adults: type.max_adults,
					max_children: type.max_children,
					image: type.image,
					available_count: 0,
				}
			}
			groupedResults[type._id].available_count++
		})

		// 5. Filter: Hide types that don't have enough rooms left
		const finalResult = Object.values(groupedResults).filter(
			(type) => type.available_count >= reqRoomsCount,
		)

		res.json(finalResult)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const getAllBookings = async (req, res) => {
	try {
		const bookings = await Booking.find()
			.populate('customer_id', '-password') // Get user info (hide password)
			.sort({ createdAt: -1 })
			.lean();

		// Enrich with room details
		const enrichedBookings = await Promise.all(
			bookings.map(async (booking) => {
				const reserved = await ReservedRoom.find({ booking_id: booking._id })
					.populate({
						path: 'room_id',
						populate: { path: 'room_type' }
					});

				return {
					...booking,
					items: reserved,
					// Helper: Get first room name for quick display
					primary_room: reserved[0]?.room_id?.room_type?.type || 'Unknown'
				};
			})
		);

		res.json(enrichedBookings);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};



module.exports = {
	createBooking,
	getMyBookings,
	cancelBooking,
	getBookingDetails,
	searchRooms,
	verifyPayment,
	getAllBookings,
}
