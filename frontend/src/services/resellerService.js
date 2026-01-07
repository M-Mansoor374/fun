import { api } from './api'

export const resellerService = {
  createUser: async (userData) => {
    return api.post('/reseller/users', userData)
  },

  getUsers: async () => {
    return api.get('/reseller/users')
  },

  updateUser: async (id, userData) => {
    return api.put(`/reseller/users/${id}`, userData)
  },

  deleteUser: async (id) => {
    return api.delete(`/reseller/users/${id}`)
  }
}

