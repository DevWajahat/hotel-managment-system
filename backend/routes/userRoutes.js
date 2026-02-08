const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/protect')
const { upload } = require('../config/cloudinary') // Your Multer config
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController')

router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, upload.single('avatar'), updateUserProfile)

module.exports = router
