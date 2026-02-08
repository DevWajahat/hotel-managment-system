import axiosClient from './axiosClient'

export const bookingAPI = {
  create: (data) => axiosClient.post('/api/bookings', data),

  verify: (data) => axiosClient.post('/api/bookings/verify-payment', data),

  getAll: () => axiosClient.get('/api/bookings/all'),

  getMyBookings: () => axiosClient.get('/api/bookings/mybookings'),
  cancel: (id) => axiosClient.put(`/api/bookings/${id}/cancel`),

  getDetails: (id) => axiosClient.get(`/api/bookings/${id}`),
}
