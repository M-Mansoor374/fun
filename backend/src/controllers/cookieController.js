import Cookie from '../models/Cookie.js'
import User from '../models/User.js'

export const createCookie = async (req, res, next) => {
  try {
    const { data, owner } = req.body
    
    // Validate JSON
    try {
      JSON.parse(data)
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format' })
    }

    const cookie = await Cookie.create({
      data,
      owner: owner || ''
    })
    
    res.status(201).json({
      success: true,
      data: { cookie }
    })
  } catch (error) {
    next(error)
  }
}

export const getCookies = async (req, res, next) => {
  try {
    const cookies = await Cookie.find().sort({ createdAt: -1 })
    res.json({
      success: true,
      data: { cookies }
    })
  } catch (error) {
    next(error)
  }
}

export const updateCookie = async (req, res, next) => {
  try {
    const { data, owner } = req.body
    
    // Validate JSON if data is provided
    if (data) {
      try {
        JSON.parse(data)
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid JSON format' })
      }
    }

    const cookie = await Cookie.findByIdAndUpdate(
      req.params.id,
      { data, owner },
      { new: true, runValidators: true }
    )

    if (!cookie) {
      return res.status(404).json({ success: false, message: 'Cookie not found' })
    }

    res.json({
      success: true,
      data: { cookie }
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCookie = async (req, res, next) => {
  try {
    const cookie = await Cookie.findByIdAndDelete(req.params.id)

    if (!cookie) {
      return res.status(404).json({ success: false, message: 'Cookie not found' })
    }

    res.json({
      success: true,
      message: 'Cookie deleted'
    })
  } catch (error) {
    next(error)
  }
}

export const assignCookie = async (req, res, next) => {
  try {
    const { owner } = req.body
    
    const cookie = await Cookie.findById(req.params.id)
    if (!cookie) {
      return res.status(404).json({ success: false, message: 'Cookie not found' })
    }

    const user = await User.findOne({ email: owner })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.cookieId = cookie._id
    await user.save()

    res.json({
      success: true,
      message: 'Cookie assigned'
    })
  } catch (error) {
    next(error)
  }
}

export const getMyCookie = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cookieId')
    
    if (!user || !user.cookieId) {
      return res.json({
        success: true,
        data: { cookie: null }
      })
    }

    res.json({
      success: true,
      data: { cookie: user.cookieId }
    })
  } catch (error) {
    next(error)
  }
}

