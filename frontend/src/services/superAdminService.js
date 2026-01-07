import { api } from './api'

export const superAdminService = {
  createUser: async (userData) => {
    return api.post('/superadmin/users', userData)
  },
  getUsers: async () => {
    return api.get('/superadmin/users')
  },
  updateUser: async (id, data) => {
    return api.put(`/superadmin/users/${id}`, data)
  },
  deleteUser: async (id) => {
    return api.delete(`/superadmin/users/${id}`)
  }
}

