const mongoose = require('mongoose')
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const register = async (req, res) => {
  const { full_name, email, password } = req.body

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const verificationToken = crypto.randomBytes(32).toString('hex')

    const newUser = new User({
      full_name,
      email,
      password: hashedPassword,
      role: 'user',
      verification_token: verificationToken,
      is_verified: false,
    })

    await newUser.save()

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`

    const mailOptions = {
      from: process.env.FROM_EMAIL || '"Luxury Hotel" <no-reply@example.com>',
      to: email,
      subject: 'Verify your email address',
      html: `<p>Please verify your email by clicking the link below:</p>
                   <a href="${verificationUrl}">${verificationUrl}</a>`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Mailtrap Error:', error)
      } else {
        console.log('✅ Email sent via Mailtrap:', info.messageId)
      }
    })

    res.status(201).json({
      message: 'Registration successful. Please check your email.',
    })
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.is_verified && user.role == 'user') {
        return res
          .status(401)
          .json({ message: 'Please verify your email before logging in.' })
      }

      res.json({
        _id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: 'Invalid credentials' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const verify_email = async (req, res) => {
  try {
    const { token } = req.params
    const user = await User.findOne({ verification_token: token })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    user.is_verified = true
    user.verification_token = undefined
    await user.save()
    res.status(200).json({ message: 'Email verified successfully.' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { register, loginUser, verify_email }
