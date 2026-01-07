import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' })
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Name is required' })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' })
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'USER'
    })

    const token = generateToken(user._id.toString(), user.role)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
      token
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(error.errors)[0].message })
    }
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is inactive' })
    }

    if (user.expireDate && new Date(user.expireDate) < new Date()) {
      return res.status(401).json({ success: false, message: 'Account has expired' })
    }

    const token = generateToken(user._id.toString(), user.role)

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        limits: user.limits
      },
      token
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        limits: user.limits
      }
    })
  } catch (error) {
    next(error)
  }
}

