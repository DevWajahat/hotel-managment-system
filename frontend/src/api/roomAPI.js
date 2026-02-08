import axiosClient from './axiosClient'

export const roomAPI = {
  // --- Room Types ---
  getTypes: () => axiosClient.get('/api/admin/room-types'),
  createType: (data) =>
    axiosClient.post('/api/admin/room-types', data, {
      headers: { 'Content-Type': undefined }, // Fix for file upload
    }),

  updateType: (id, data) =>
    axiosClient.put(`/api/admin/room-types/${id}`, data, {
      headers: { 'Content-Type': undefined }, // Fix for file upload
    }),

  deleteType: (id) => axiosClient.delete(`/api/admin/room-types/${id}`),

  // --- Room Statuses ---
  getStatuses: () => axiosClient.get('/api/admin/room-statuses'),
  createStatus: (data) => axiosClient.post('/api/admin/room-statuses', data),
  // Note: You might want an updateStatus here later if you plan to edit statuses

  // --- Physical Rooms ---
  getAllRooms: () => axiosClient.get('/api/admin/rooms'),
  createRoom: (data) => {
    return axiosClient.post('/api/admin/rooms', data)
  },

  deleteRoom: (id) => axiosClient.delete(`/api/admin/rooms/${id}`),
  updateRoom: (id, data) => axiosClient.put(`/api/admin/rooms/${id}`, data),

  search: (params) => axiosClient.get('/api/bookings/search', { params }),
}
