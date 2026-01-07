import SuperAdminUser from '../models/SuperAdminUser.js'

export const createSuperAdminUser = async (req, res, next) => {
  try {
    const { name, email, password, role, startDate, expireDate, keywordLimit, isActive } = req.body
    
    const user = await SuperAdminUser.create({
      name,
      email,
      password: password || 'defaultPassword123',
      role: role.toUpperCase(),
      startDate: startDate ? new Date(startDate) : null,
      expireDate: expireDate ? new Date(expireDate) : null,
      limits: {
        keywordLimit: parseInt(keywordLimit) || 0,
        keywordUsed: 0
      },
      isActive: isActive !== undefined ? isActive : true
    })
    
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

export const getSuperAdminUsers = async (req, res, next) => {
  try {
    const users = await SuperAdminUser.find().select('-password').sort({ createdAt: -1 })
    res.json({
      success: true,
      data: { users }
    })
  } catch (error) {
    next(error)
  }
}

export const updateSuperAdminUser = async (req, res, next) => {
  try {
    const { keywordLimit } = req.body
    const user = await SuperAdminUser.findByIdAndUpdate(
      req.params.id,
      {
        'limits.keywordLimit': parseInt(keywordLimit) || 0
      },
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

export const deleteSuperAdminUser = async (req, res, next) => {
  try {
    const user = await SuperAdminUser.findByIdAndDelete(req.params.id)

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

