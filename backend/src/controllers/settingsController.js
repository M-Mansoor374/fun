import Settings from '../models/Settings.js'

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create({
        ipWhitelist: '',
        staticIP: '',
        globalLimits: { keywordLimit: 0 }
      })
    }
    res.json({
      success: true,
      data: { settings }
    })
  } catch (error) {
    next(error)
  }
}

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create(req.body)
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      )
    }
    res.json({
      success: true,
      data: { settings }
    })
  } catch (error) {
    next(error)
  }
}

