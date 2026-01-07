import Branding from '../models/Branding.js'

export const getBranding = async (req, res, next) => {
  try {
    let branding = await Branding.findOne()
    if (!branding) {
      branding = await Branding.create({ footerText: '' })
    }
    res.json({
      success: true,
      data: { branding }
    })
  } catch (error) {
    next(error)
  }
}

export const updateBranding = async (req, res, next) => {
  try {
    let branding = await Branding.findOne()
    if (!branding) {
      branding = await Branding.create(req.body)
    } else {
      branding = await Branding.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      )
    }
    res.json({
      success: true,
      data: { branding }
    })
  } catch (error) {
    next(error)
  }
}

