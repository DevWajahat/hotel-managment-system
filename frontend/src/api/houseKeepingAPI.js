import axios from 'axios'

// Configure your base URL (adjust port if needed)
const API_URL = 'http://localhost:3000/api/housekeeping'

// Helper to get the token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export const housekeepingAPI = {
  // Get list of rooms needing cleaning
  getTasks: () => axios.get(`${API_URL}/tasks`, getAuthHeader()),

  // Mark a specific room as cleaned
  completeTask: (roomId) =>
    axios.put(`${API_URL}/tasks/${roomId}/complete`, {}, getAuthHeader()),
}
