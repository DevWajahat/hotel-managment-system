import axiosClient from './axiosClient'

export const staffAPI = {
  getAll: () => axiosClient.get('/api/admin/staff'),
  create: (data) => axiosClient.post('/api/admin/staff', data),
  update: (id, data) => axiosClient.put(`/api/admin/staff/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/admin/staff/${id}`),
}
