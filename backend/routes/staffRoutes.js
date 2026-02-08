const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/protect') // Adjust path to your auth middleware
const {
  getCleaningTasks,
  completeTask,
} = require('../controllers/staffControllers')

// These routes are protected by login token, but DO NOT require Admin role
router.get('/tasks', protect, getCleaningTasks)
router.put('/tasks/:id/complete', protect, completeTask)

module.exports = router
