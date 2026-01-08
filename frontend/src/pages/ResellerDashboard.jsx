import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { resellerService } from '../services/resellerService'
import logo from '../assets/logo.ahrf.jpeg'

const ResellerDashboard = () => {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [totalUserLimit, setTotalUserLimit] = useState(10)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', startDate: '', expiryDate: '', keywordLimit: '', status: 'active' })
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    }
  }, [activeTab])

  const loadUsers = async () => {
    try {
      const response = await resellerService.getUsers()
      if (response.success) {
        setUsers(response.data.users)
      }
    } catch (error) {
      showToast('Failed to load users', 'error')
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (users.length >= totalUserLimit) {
      showToast(`User limit reached. Maximum ${totalUserLimit} users allowed.`, 'error')
      return
    }
    setLoading(true)
    try {
      const response = await resellerService.createUser({
        name: newUser.name,
        email: newUser.email,
        startDate: newUser.startDate,
        expireDate: newUser.expiryDate,
        keywordLimit: parseInt(newUser.keywordLimit) || 0,
        isActive: newUser.status === 'active'
      })
      if (response.success) {
        showToast('User added successfully!', 'success')
        setNewUser({ name: '', email: '', startDate: '', expiryDate: '', keywordLimit: '', status: 'active' })
        setShowAddUser(false)
        loadUsers()
      }
    } catch (error) {
      showToast(error.message || 'Failed to add user', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateKeywordLimit = async (id, limit) => {
    const numLimit = parseInt(limit) || 0
    try {
      const response = await resellerService.updateUser(id, { keywordLimit: numLimit })
      if (response.success) {
        showToast('Keyword limit updated!', 'success')
        loadUsers()
      }
    } catch (error) {
      showToast('Failed to update limit', 'error')
    }
  }

  return (
    <div className="super-admin-layout">
      <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Ahrefs Logo" className="sidebar-logo" />
          <h2>Reseller Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}>
            Users
          </button>
          <button className={activeTab === 'tool' ? 'active' : ''} onClick={() => { setActiveTab('tool'); setMobileMenuOpen(false); }}>
            Ahrefs Tool
          </button>
        </nav>
      </div>
      {mobileMenuOpen && <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

      <div className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </button>
            <h1>{activeTab === 'users' ? 'Users' : 'Ahrefs Tool'}</h1>
          </div>
          <div className="header-actions">
            <span>{user?.name || user?.email}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>User Management</h2>
                <button 
                  onClick={() => setShowAddUser(true)} 
                  className="btn-primary"
                  disabled={users.length >= totalUserLimit}
                >
                  Add User
                </button>
              </div>

              <div className="limit-section">
                <div className="form-group" style={{ maxWidth: '300px', marginBottom: '0' }}>
                  <label>Total User Limit</label>
                  <input
                    type="number"
                    value={totalUserLimit}
                    onChange={(e) => setTotalUserLimit(parseInt(e.target.value) || 0)}
                    min="1"
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    Current: {users.length} / {totalUserLimit} users
                  </p>
                </div>
              </div>

              {showAddUser && (
                <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
                  <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h3>Add User</h3>
                    <form onSubmit={handleAddUser}>
                      <input
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                      <input
                        type="date"
                        placeholder="Start Date"
                        value={newUser.startDate}
                        onChange={(e) => setNewUser({ ...newUser, startDate: e.target.value })}
                        required
                      />
                      <input
                        type="date"
                        placeholder="Expiry Date"
                        value={newUser.expiryDate}
                        onChange={(e) => setNewUser({ ...newUser, expiryDate: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Keyword Limit"
                        value={newUser.keywordLimit}
                        onChange={(e) => setNewUser({ ...newUser, keywordLimit: e.target.value })}
                        required
                        min="1"
                      />
                      <select
                        value={newUser.status}
                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div className="modal-actions">
                        <button type="button" onClick={() => setShowAddUser(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add User'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Keywords Used</th>
                      <th>Keywords Remaining</th>
                      <th>Start Date</th>
                      <th>Expiry Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge badge-${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'active' : 'inactive'}</span></td>
                        <td>{u.keywordUsed || 0}</td>
                        <td>{Math.max(0, (u.keywordLimit || 0) - (u.keywordUsed || 0))}</td>
                        <td>{u.startDate ? new Date(u.startDate).toLocaleDateString() : '-'}</td>
                        <td>{u.expireDate ? new Date(u.expireDate).toLocaleDateString() : '-'}</td>
                        <td>
                          <input
                            type="number"
                            placeholder="New limit"
                            className="inline-input"
                            onBlur={(e) => e.target.value && handleUpdateKeywordLimit(u._id, e.target.value)}
                            min="1"
                          />
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tool' && (
            <div className="tab-content">
              <div className="tool-container">
                <iframe
                  src={`${import.meta.env.VITE_API_URL || 'http://72.62.124.251:5000/api'}/proxy?url=https://ahrefs.com`}
                  className="tool-iframe"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResellerDashboard
