import mongoose from 'mongoose'

const cookieSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'cookie'
})

export default mongoose.model('Cookie', cookieSchema)

