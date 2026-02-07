const express = require('express')

const router = express.Router()
const {
  register,
  loginUser,
  verify_email,
} = require('../controllers/web/authController')

router.get('/verify/:token', verify_email)

router.post('/register', register)

router.post('/login', loginUser)

module.exports = router
