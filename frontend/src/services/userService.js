import { api } from './api'

export const userService = {
  getUsers: async () => {
    return api.get('/users')
  },

  getUser: async (id) => {
    return api.get(`/users/${id}`)
  },

  createUser: async (userData) => {
    return api.post('/users', userData)
  },

  updateUser: async (id, userData) => {
    return api.put(`/users/${id}`, userData)
  },

  deleteUser: async (id) => {
    return api.delete(`/users/${id}`)
  },

  updateKeywordLimit: async (id, limit) => {
    return api.put(`/users/${id}/keyword-limit`, { limit })
  },

  getUsage: async (id) => {
    return api.get(`/users/${id}/usage`)
  },

  useTool: async () => {
    return api.post('/users/use-tool')
  },

  getMyUsage: async () => {
    return api.get('/users/my-usage')
  },
}

