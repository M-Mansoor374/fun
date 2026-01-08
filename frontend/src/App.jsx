import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useToast } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import UserDashboard from './pages/UserDashboard'
import ResellerDashboard from './pages/ResellerDashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Unauthorized from './pages/Unauthorized'
import './App.css'

const PasswordInput = ({ value, onChange, placeholder, error }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="input-wrapper">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
      />
      <button
        type="button"
        className="eye-toggle"
        onClick={() => setShow(!show)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? '👁️' : '👁️‍🗨️'}
      </button>
    </div>
  )
}

const RoleSelect = ({ value, onChange, error }) => (
  <select
    value={value}
    onChange={onChange}
    className={error ? 'error' : ''}
  >
    <option value="">Select Role</option>
    <option value="user">User</option>
    <option value="reseller">Reseller</option>
    <option value="superadmin">Super Admin</option>
  </select>
)

const AuthPage = () => {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({ email: '', password: '', role: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = (data) => {
    const newErrors = {}
    if (!data.email) newErrors.email = true
    if (!data.password) newErrors.password = true
    if (!data.role) newErrors.role = true
    return newErrors
  }

  const getRoleRoute = (role) => {
    if (role === 'superadmin') return '/superadmin'
    if (role === 'reseller') return '/reseller'
    return '/user'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate(loginData)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await login(loginData)

      if (result.success) {
        showToast('Login successful', 'success')
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        navigate(getRoleRoute(currentUser.role))
      } else {
        showToast(result.message || 'Login failed', 'error')
      }
    } catch (error) {
      showToast(error.message || 'An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="card-inner">
          <div className="card-front">
            <form onSubmit={handleSubmit} className="auth-form">
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className={errors.email ? 'error' : ''}
              />
              <PasswordInput
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Password"
                error={errors.password}
              />
              <RoleSelect
                value={loginData.role}
                onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                error={errors.role}
              />
              <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <div className="loading">Loading...</div>
  }

  const getRoleRoute = (role) => {
    if (!role) return '/login'
    if (role === 'superadmin') return '/superadmin'
    if (role === 'reseller') return '/reseller'
    return '/user'
  }

  return (
    <Routes>
      <Route path="/login" element={!user || !user.role || !localStorage.getItem('token') ? <AuthPage /> : <Navigate to={getRoleRoute(user.role)} replace />} />
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={['user', 'reseller', 'superadmin']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reseller"
        element={
          <ProtectedRoute allowedRoles={['reseller', 'superadmin']}>
            <ResellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={user && user.role && localStorage.getItem('token') ? <Navigate to={getRoleRoute(user.role)} replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={user && user.role && localStorage.getItem('token') ? <Navigate to={getRoleRoute(user.role)} replace /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
