import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = ({ allowedRole }) => {
  const token = localStorage.getItem('token')

  // Safely parse the user object
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : null

  // 1. If no token, kick to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 2. If a specific role is required (e.g. 'admin') and user doesn't have it
  if (allowedRole && user?.role !== allowedRole) {
    // If user tries to go to admin but is just a user, send them to their dashboard
    if (user?.role === 'user') {
      return <Navigate to="/guests/dashboard" replace />
    }
    // If admin tries to go to user page, maybe send to admin dashboard or let them pass
    // For strict separation:
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }

    return <Navigate to="/" replace />
  }

  // 3. Authorized
  return <Outlet />
}

export default ProtectedRoutes
