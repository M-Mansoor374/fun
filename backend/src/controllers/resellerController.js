import ResellerUser from '../models/ResellerUser.js'

export const createResellerUser = async (req, res, next) => {
  try {
    const user = await ResellerUser.create({
      ...req.body,
      resellerId: req.user.id
    })
    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

export const getResellerUsers = async (req, res, next) => {
  try {
    const users = await ResellerUser.find({ resellerId: req.user.id })
    res.json({
      success: true,
      data: { users }
    })
  } catch (error) {
    next(error)
  }
}

export const updateResellerUser = async (req, res, next) => {
  try {
    const user = await ResellerUser.findOneAndUpdate(
      { _id: req.params.id, resellerId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

export const deleteResellerUser = async (req, res, next) => {
  try {
    const user = await ResellerUser.findOneAndDelete({
      _id: req.params.id,
      resellerId: req.user.id
    })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    res.json({
      success: true,
      message: 'User deleted'
    })
  } catch (error) {
    next(error)
  }
}

