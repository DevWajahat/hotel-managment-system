const Room = require('../../models/room')
const RoomType = require('../../models/room_types')
const RoomStatus = require('../../models/room_status')
const ReservedRoom = require('../../models/reserved_room')

// --- ROOM TYPES (Handles Images) ---

const createRoomType = async (req, res) => {
  try {
    const { type, price, max_adults, max_children, description } = req.body
    const image = req.file ? req.file.path : ''

    const newType = await RoomType.create({
      type,
      price,
      max_adults,
      max_children,
      description,
      image,
    })
    res.status(201).json(newType)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getRoomTypes = async (req, res) => {
  try {
    const types = await RoomType.find({})
    res.json(types)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateRoomType = async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) {
      data.image = req.file.path
    }
    const updatedType = await RoomType.findByIdAndUpdate(req.params.id, data, {
      new: true,
    })
    res.json(updatedType)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteRoomType = async (req, res) => {
  try {
    await RoomType.findByIdAndDelete(req.params.id)
    res.json({ message: 'Room Type removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// --- ROOM STATUSES ---

const createRoomStatus = async (req, res) => {
  try {
    const { status } = req.body
    // Ensure you use 'name' or 'status' consistently with your Schema
    const newStatus = await RoomStatus.create({ name: status })
    res.status(201).json(newStatus)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getRoomStatuses = async (req, res) => {
  try {
    const statuses = await RoomStatus.find({})
    res.json(statuses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateRoomStatus = async (req, res) => {
  try {
    const updatedStatus = await RoomStatus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    res.json(updatedStatus)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteRoomStatus = async (req, res) => {
  try {
    await RoomStatus.findByIdAndDelete(req.params.id)
    res.json({ message: 'Room Status removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// --- PHYSICAL ROOMS ---

const createRoom = async (req, res) => {
  try {
    const { room_no, room_type, room_status } = req.body

    const roomExists = await Room.findOne({ number: room_no })
    if (roomExists) {
      return res.status(400).json({ message: 'Room number already exists' })
    }

    const room = await Room.create({
      number: room_no,
      room_type,
      room_status: room_status, // Ensure this matches your Schema (room_status)
    })

    res.status(201).json(room)
  } catch (error) {
    console.error('Create Room Error:', error)
    res.status(400).json({ message: error.message })
  }
}

// --- THE FIX: TIMEZONE-PROOF GET ROOMS ---
// DEBUG VERSION OF GET ROOMS
// FINAL CORRECTED GET ROOMS
const getRooms = async (req, res) => {
  try {
    // 1. Get the "Occupied" Status Object
    // FIX: Changed 'name' to 'status' to match your database schema
    const occupiedStatus = await RoomStatus.findOne({
      status: 'Occupied',
    }).lean()

    // 2. Fetch Reservations for Today
    const today = new Date()
    // Set explicit window: Start of today (00:00) to End of today (23:59)
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    // Find any reservation that overlaps with today
    const activeReservations = await ReservedRoom.find({
      $or: [
        // Case A: Overlaps entire day
        { check_in: { $lte: startOfDay }, check_out: { $gte: endOfDay } },
        // Case B: Starts today
        { check_in: { $gte: startOfDay, $lte: endOfDay } },
        // Case C: Ends today
        { check_out: { $gte: startOfDay, $lte: endOfDay } },
      ],
    }).select('room_id')

    const busyRoomIds = activeReservations.map((r) => r.room_id.toString())

    // 3. Get All Rooms
    const rooms = await Room.find()
      .populate('room_type')
      .populate('room_status')
      .lean()

    // 4. The Magic Swap
    const dynamicRooms = rooms.map((room) => {
      const isBusy = busyRoomIds.includes(room._id.toString())

      // Only swap if we actually found the Occupied status document
      if (isBusy && occupiedStatus) {
        // SWAP the status object visually
        // (We map it to 'room_status' because that is what your frontend expects)
        return { ...room, room_status: occupiedStatus }
      }
      return room
    })

    res.json(dynamicRooms)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params
    const { room_status, room_no, room_type } = req.body

    const updateData = {}
    if (room_no) updateData.number = room_no
    if (room_type) updateData.room_type = room_type

    // Update Status Logic
    if (room_status) {
      let statusId = room_status
      const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id)

      if (!isValidObjectId(room_status)) {
        const statusDoc = await RoomStatus.findOne({ name: room_status })
        if (statusDoc) {
          statusId = statusDoc._id
        }
      }
      updateData.room_status = statusId
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate('room_status')
      .populate('room_type')

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' })
    }

    res.json(updatedRoom)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id)
    res.json({ message: 'Room removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createRoomType,
  getRoomTypes,
  updateRoomType,
  deleteRoomType,
  createRoomStatus,
  getRoomStatuses,
  updateRoomStatus,
  deleteRoomStatus,
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
}
