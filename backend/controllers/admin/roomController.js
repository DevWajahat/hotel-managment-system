const Room = require('../../models/room')
const RoomType = require('../../models/room_types')
const RoomStatus = require('../../models/room_status')

// --- ROOM TYPES (Now handles Images) ---

const createRoomType = async (req, res) => {
  try {
    const { type, price, max_adults, max_children, description } = req.body

    // 1. Handle Image Upload for the Type
    // If a file was uploaded, use its path (URL); otherwise empty string or undefined
    const image = req.file ? req.file.path : ''

    const newType = await RoomType.create({
      type,
      price,
      max_adults,
      max_children,
      description,
      image, // Save the image URL here
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

    // 2. Handle Image Update
    // If a new file is uploaded, update the image field.
    // If not, leave it alone (it won't be in req.file, so we don't overwrite it)
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
    const newStatus = await RoomStatus.create({ status })
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

// --- PHYSICAL ROOMS (Cleaned up - No Images) ---

const createRoom = async (req, res) => {
  try {
    // We only need these 3 fields now. Image comes from RoomType.
    const { room_no, room_type, room_status } = req.body

    const roomExists = await Room.findOne({ room_no })
    if (roomExists) {
      return res.status(400).json({ message: 'Room number already exists' })
    }

    const room = await Room.create({
      room_no,
      room_type,
      room_status,
      // No 'image' field here anymore
    })

    res.status(201).json(room)
  } catch (error) {
    console.error('Create Room Error:', error)
    res.status(400).json({ message: error.message })
  }
}

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({})
      // 3. IMPORTANT: Populate 'image' from 'room_type'
      // This tells Mongoose: "Go to RoomType, get the 'type', 'price', AND 'image'"
      .populate('room_type', 'type price image')
      .populate('room_status', 'status')

    res.json(rooms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.json(updatedRoom)
  } catch (error) {
    res.status(400).json({ message: error.message })
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
