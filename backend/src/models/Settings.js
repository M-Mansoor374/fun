import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  ipWhitelist: {
    type: String,
    default: ''
  },
  staticIP: {
    type: String,
    default: ''
  },
  globalLimits: {
    keywordLimit: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  collection: 'Settings'
})

export default mongoose.model('Settings', settingsSchema)

