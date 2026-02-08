import { Routes, Route, Outlet } from 'react-router' // Added Outlet

import './App.css'
import Home from './pages/home'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Dashboard from './pages/guests/dashboard'
import Checkout from './pages/guests/checkout' // Import your checkout page
import VerifyEmail from './pages/auth/VerifyEmail'
import ProtectedRoutes from './components/ProtectedRoutes'
import AdminDashboard from './pages/admin/adminDashboard'
import ManageRooms from './pages/admin/ManageRooms'
import ManageRoomTypes from './pages/admin/ManageRoomTypes'
import ManageStaff from './pages/admin/staff/ManageStaff'
import { CartProvider } from './context/CartContext'
import Success from './pages/guests/Success'
import Cancel from './pages/guests/Cancel'
import MyBookings from './pages/guests/MyBookings'

const GuestLayout = () => {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* --- GUEST ROUTES --- */}
      <Route element={<ProtectedRoutes allowedRole="user" />}>
        {/* Use the Layout here to wrap all guest pages with the Cart */}
        <Route element={<GuestLayout />}>
          <Route path="/guests/bookings" element={<MyBookings />} />
          <Route path="/guests/dashboard" element={<Dashboard />} />
          <Route path="/guests/checkout" element={<Checkout />} />
          {/* ADD THESE TWO ROUTES */}
          <Route path="/guests/success" element={<Success />} />
          <Route path="/guests/cancel" element={<Cancel />} />`
        </Route>
      </Route>

      {/* --- ADMIN ROUTES --- */}
      <Route element={<ProtectedRoutes allowedRole="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/rooms/" element={<ManageRooms />} />
        <Route path="/admin/roomTypes/" element={<ManageRoomTypes />} />
        <Route path="/admin/staffs" element={<ManageStaff />} />
      </Route>
    </Routes>
  )
}

export default App
