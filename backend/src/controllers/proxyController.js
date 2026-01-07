import Settings from '../models/Settings.js'
import User from '../models/User.js'
import Cookie from '../models/Cookie.js'

export const proxyRequest = async (req, res, next) => {
  try {
    const settings = await Settings.findOne() || {}
    const staticIP = settings.staticIP || ''
    const targetUrl = req.query.url || 'https://ahrefs.com'
    
    const user = await User.findById(req.user._id).populate('cookieId')
    let cookieHeader = ''
    
    if (user?.cookieId) {
      try {
        const cookieData = JSON.parse(user.cookieId.data)
        cookieHeader = Object.entries(cookieData).map(([k, v]) => `${k}=${v}`).join('; ')
      } catch (e) {
        // Invalid cookie format
      }
    }

    const fetch = (await import('node-fetch')).default
    const response = await fetch(targetUrl, {
      headers: {
        'X-Forwarded-For': staticIP || req.ip,
        'User-Agent': req.headers['user-agent'] || '',
        ...(cookieHeader && { 'Cookie': cookieHeader })
      }
    })

    const html = await response.text()
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch (error) {
    next(error)
  }
}

