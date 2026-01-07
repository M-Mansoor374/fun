import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Profile</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
      <div className="dashboard-content">
        <p>Welcome, {user?.name || user?.email}!</p>
        <p>This is the Profile page (Super Admin only).</p>
      </div>
    </div>
  )
}

export default Profile

