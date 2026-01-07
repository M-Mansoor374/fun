import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const superAdminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['RESELLER', 'USER'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date
  },
  expireDate: {
    type: Date
  },
  limits: {
    keywordLimit: {
      type: Number,
      default: 0
    },
    keywordUsed: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  collection: 'super-admin'
})

superAdminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

export default mongoose.model('SuperAdminUser', superAdminUserSchema)

