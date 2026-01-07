import { api } from './api'

export const settingsService = {
  getSettings: async () => {
    return api.get('/settings')
  },

  updateSettings: async (settings) => {
    return api.put('/settings', settings)
  },

  getBranding: async () => {
    return api.get('/branding')
  },

  updateBranding: async (branding) => {
    return api.put('/branding', branding)
  },
}

