import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      if (stored && token) {
        setUser(JSON.parse(stored))
      }
    } catch (error) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authService.login({
        email: credentials.email,
        password: credentials.password
      })
      if (response.success) {
        const userObj = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role.toLowerCase().replace('_', '')
        }
        setUser(userObj)
        localStorage.setItem('user', JSON.stringify(userObj))
        localStorage.setItem('token', response.token)
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      const roleMap = {
        'user': 'USER',
        'reseller': 'RESELLER',
        'superadmin': 'SUPER_ADMIN'
      }
      const backendRole = roleMap[userData.role.toLowerCase()] || 'USER'
      
      const response = await authService.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: backendRole
      })
      if (response.success) {
        const userObj = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role.toLowerCase().replace('_', '')
        }
        setUser(userObj)
        localStorage.setItem('user', JSON.stringify(userObj))
        localStorage.setItem('token', response.token)
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

