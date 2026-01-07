import mongoose from 'mongoose'

const brandingSchema = new mongoose.Schema({
  footerText: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'Branding'
})

export default mongoose.model('Branding', brandingSchema)

