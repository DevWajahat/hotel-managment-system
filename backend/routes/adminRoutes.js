const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/protect')
const { upload } = require('../config/cloudinary') // Ensure path is correct
const {
  createRoomType,
  getRoomTypes,
  updateRoomType,
  deleteRoomType,
  createRoomStatus,
  getRoomStatuses,
  updateRoomStatus,
  deleteRoomStatus,
  createRoom,
  updateRoom,
  getRooms,
  deleteRoom, // Don't forget to import this if you use it
} = require('../controllers/admin/roomController')
const {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/admin/staffController')

// --- Room Types ---
router
  .route('/room-types')
  // Add upload.single('image')
  .post(protect, admin, upload.single('image'), createRoomType)
  .get(protect, admin, getRoomTypes)

router
  .route('/room-types/:id')
  // Add upload.single('image')
  .put(protect, admin, upload.single('image'), updateRoomType)
  .delete(protect, admin, deleteRoomType)
// --- Room Statuses ---
router
  .route('/room-statuses')
  .post(protect, admin, createRoomStatus)
  .get(protect, admin, getRoomStatuses)

router
  .route('/room-statuses/:id')
  .put(protect, admin, updateRoomStatus)
  .delete(protect, admin, deleteRoomStatus)

// --- Physical Rooms (THE FIX) ---
router
  .route('/rooms')
  // CHAIN THE MIDDLEWARE HERE: protect -> admin -> upload -> controller
  .post(protect, admin, createRoom)
  .get(protect, admin, getRooms)

router
  .route('/rooms/:id')
  // SAME HERE FOR UPDATE
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom)

router
  .route('/staff')
  .post(protect, admin, createStaff)
  .get(protect, admin, getAllStaff)

router
  .route('/staff/:id')
  .put(protect, admin, updateStaff)
  .delete(protect, admin, deleteStaff)

module.exports = router
