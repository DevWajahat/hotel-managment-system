import { Routes, Route } from 'react-router'

import './App.css'
import Home from './pages/home'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Dashboard from './pages/guests/dashboard'
import VerifyEmail from './pages/auth/VerifyEmail'
import ProtectedRoutes from './components/ProtectedRoutes'
import AdminDashboard from './pages/admin/adminDashboard'
import ManageRooms from './pages/admin/ManageRooms'
import ManageRoomTypes from './pages/admin/ManageRoomTypes'
import ManageStaff from './pages/admin/staff/ManageStaff'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      <Route element={<ProtectedRoutes allowedRole="user" />}>
        <Route path="/guests/dashboard" element={<Dashboard />} />
      </Route>

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
