import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Unauthorized = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h2>Unauthorized Access</h2>
        <p>You don't have permission to access this page.</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={() => navigate(-1)} className="logout-btn" style={{ background: '#667eea' }}>
            Go Back
          </button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized

