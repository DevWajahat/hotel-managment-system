const User = require('../models/user')
const bcrypt = require('bcryptjs')

// GET PROFILE
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// UPDATE PROFILE
// UPDATE PROFILE (Updated for full_name)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // --- UPDATED: Use full_name ---
    user.full_name = req.body.full_name || user.full_name

    // Keep other fields
    user.phone = req.body.phone || user.phone
    user.email = req.body.email || user.email

    // Handle Image Upload
    if (req.file) {
      user.avatar = req.file.path
    }

    // Handle Password Update
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(req.body.password, salt)
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      full_name: updatedUser.full_name, // Return full_name
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getUserProfile, updateUserProfile }
