const Room = require('../models/room')
const RoomStatus = require('../models/room_status') // Ensure filename matches your project

// 1. GET CLEANING TASKS
// Only returns rooms that need cleaning
const getCleaningTasks = async (req, res) => {
  try {
    // A. Find the ID for "Cleaning" status
    // Make sure your DB has a status named "Cleaning"
    const cleaningStatus = await RoomStatus.findOne({ status: 'Cleaning' })

    if (!cleaningStatus) {
      // Fallback: If "Cleaning" status doesn't exist, return empty
      return res.json([])
    }

    // B. Find rooms with this status
    const rooms = await Room.find({ room_status: cleaningStatus._id })
      .populate('room_type', 'type') // Only need the type name
      .select('room_no room_status room_type') // Only need these fields

    res.json(rooms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 2. MARK AS CLEANED
// Updates status from "Cleaning" to "Available"
const completeTask = async (req, res) => {
  try {
    const { id } = req.params

    // A. Find "Available" Status
    const availableStatus = await RoomStatus.findOne({ status: 'Available' })
    if (!availableStatus) {
      return res
        .status(500)
        .json({ message: "Status 'Available' not found in DB" })
    }

    // B. Update Room
    const room = await Room.findByIdAndUpdate(
      id,
      { room_status: availableStatus._id },
      { new: true },
    )

    if (!room) return res.status(404).json({ message: 'Room not found' })

    res.json({ message: 'Room marked as available', room })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getCleaningTasks, completeTask }
