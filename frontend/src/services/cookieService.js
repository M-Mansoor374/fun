import { api } from './api'

export const cookieService = {
  getCookies: async () => {
    return api.get('/cookies')
  },

  getCookie: async (id) => {
    return api.get(`/cookies/${id}`)
  },

  createCookie: async (cookieData) => {
    return api.post('/cookies', cookieData)
  },

  updateCookie: async (id, cookieData) => {
    return api.put(`/cookies/${id}`, cookieData)
  },

  deleteCookie: async (id) => {
    return api.delete(`/cookies/${id}`)
  },

  assignCookie: async (id, ownerEmail) => {
    return api.put(`/cookies/${id}/assign`, { owner: ownerEmail })
  },

  getMyCookie: async () => {
    return api.get('/cookies/my-cookie')
  },
}

