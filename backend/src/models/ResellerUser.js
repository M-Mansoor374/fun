import mongoose from 'mongoose'

const resellerUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  resellerId: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  },
  expireDate: {
    type: Date
  },
  keywordLimit: {
    type: Number,
    default: 0
  },
  keywordUsed: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'reseller-users'
})

export default mongoose.model('ResellerUser', resellerUserSchema)

