const express = require('express')
const app = express()
const webRoutes = require('./routes/webRoutes')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
require('dotenv').config()
const db = require('./config/database')
const cors = require('cors')
const bookingRoutes = require('./routes/bookingRoutes')
const userRoutes = require('./routes/userRoutes')
const staffRoutes = require('./routes/staffRoutes')

db.dbConnect()

const PORT = process.env.PORT

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use('/', webRoutes);
app.use('/userAuth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/housekeeping', staffRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
