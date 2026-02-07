import axiosClient from './axiosClient'

export const authAPI = {
  login: async (credentials) => {
    const response = await axiosClient.post('/userAuth/login', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await axiosClient.post('/userAuth/register', userData)
    return response.data
  },

  // --- ADD THIS FUNCTION ---
  verifyEmail: async (token) => {
    // Ensure this matches your backend route exactly.
    // Based on previous code, it was router.get('/verify/:token')
    const response = await axiosClient.get(`/userAuth/verify/${token}`)
    return response.data
  },
}
