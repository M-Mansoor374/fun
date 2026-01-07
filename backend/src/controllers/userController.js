import User from '../models/User.js'

export const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query
    const filter = role ? { role } : {}
    
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 })
    
    res.json({
      success: true,
      data: { users }
    })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    
    res.status(201).json({
      success: true,
      data: { user }
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      message: 'User deleted'
    })
  } catch (error) {
    next(error)
  }
}

export const useTool = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const keywordLimit = user.limits?.keywordLimit || 0
    const keywordUsed = user.limits?.keywordUsed || 0
    const remaining = keywordLimit - keywordUsed

    if (remaining <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Keyword limit reached'
      })
    }

    user.limits.keywordUsed = (user.limits.keywordUsed || 0) + 1
    await user.save()

    res.json({
      success: true,
      data: {
        keywordUsed: user.limits.keywordUsed,
        keywordLimit: user.limits.keywordLimit,
        remaining: user.limits.keywordLimit - user.limits.keywordUsed
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getMyUsage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      data: {
        keywordUsed: user.limits?.keywordUsed || 0,
        keywordLimit: user.limits?.keywordLimit || 0,
        remaining: (user.limits?.keywordLimit || 0) - (user.limits?.keywordUsed || 0)
      }
    })
  } catch (error) {
    next(error)
  }
}

