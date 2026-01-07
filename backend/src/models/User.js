import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
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
    enum: ['SUPER_ADMIN', 'RESELLER', 'USER'],
    default: 'USER'
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
  },
  cookieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cookie',
    default: null
  }
}, {
  timestamps: true,
  collection: 'users-hrf'
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)

