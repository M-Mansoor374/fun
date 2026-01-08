import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { userService } from '../services/userService'
import { settingsService } from '../services/settingsService'
import { cookieService } from '../services/cookieService'
import logo from '../assets/logo.ahrf.jpeg'

const UserDashboard = () => {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [usage, setUsage] = useState({ keywordUsed: 0, keywordLimit: 0 })
  const [branding, setBranding] = useState({ footerText: '' })
  const keywordRemaining = usage.keywordLimit - usage.keywordUsed
  const iframeRef = useRef(null)

  useEffect(() => {
    loadUsage()
    loadBranding()
  }, [])

  const loadUsage = async () => {
    try {
      const response = await userService.getMyUsage()
      if (response.success) {
        setUsage({
          keywordUsed: response.data.keywordUsed,
          keywordLimit: response.data.keywordLimit
        })
      }
    } catch (error) {
      showToast('Failed to load usage', 'error')
    }
  }

  const loadBranding = async () => {
    try {
      const response = await settingsService.getBranding()
      if (response.success) {
        setBranding(response.data.branding)
      }
    } catch (error) {
      // Silent fail - use default text
    }
  }

  const injectCookie = async () => {
    if (iframeRef.current && user?.cookieId) {
      try {
        const cookieResponse = await cookieService.getMyCookie()
        if (cookieResponse.success && cookieResponse.data.cookie) {
          const cookieData = JSON.parse(cookieResponse.data.cookie.data)
          Object.entries(cookieData).forEach(([key, value]) => {
            document.cookie = `${key}=${value}; domain=${new URL(iframeRef.current.src).hostname}; path=/`
          })
        }
      } catch (error) {
        console.error('Failed to inject cookie:', error)
      }
    }
  }

  const handleToolUse = async () => {
    if (keywordRemaining <= 0) {
      showToast('Keyword limit reached', 'error')
      return
    }
    try {
      const response = await userService.useTool()
      if (response.success) {
        setUsage({
          keywordUsed: response.data.keywordUsed,
          keywordLimit: response.data.keywordLimit
        })
        showToast('Tool usage recorded', 'success')
      }
    } catch (error) {
      showToast(error.message || 'Failed to record usage', 'error')
    }
  }

  return (
    <div className="user-dashboard">
      <header className="user-header">
        <div className="header-logo">
          <img src={logo} alt="Ahrefs Logo" className="logo-img" />
          <h1>Ahrefs Tool</h1>
        </div>
        <div>
          <span>{user?.name || user?.email}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-label">Used</span>
          <span className="stat-value">{usage.keywordUsed}</span>
        </div>
        <div className="stat-item highlight">
          <span className="stat-label">Remaining</span>
          <span className="stat-value">{Math.max(0, keywordRemaining)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Limit</span>
          <span className="stat-value">{usage.keywordLimit}</span>
        </div>
      </div>

      <div className="user-iframe">
        {keywordRemaining > 0 ? (
          <iframe
            ref={iframeRef}
            src={`${import.meta.env.VITE_API_URL || 'http://72.62.124.251:5000/api'}/proxy?url=https://ahrefs.com`}
            className="tool-iframe"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={injectCookie}
          />
        ) : (
          <div className="tool-placeholder">
            <h2>Limit Reached</h2>
            <p>Your keyword limit has been reached</p>
          </div>
        )}
      </div>

      <footer className="user-footer">
        <p>{branding.footerText || 'This service is used by XYZ'}</p>
      </footer>
    </div>
  )
}

export default UserDashboard
