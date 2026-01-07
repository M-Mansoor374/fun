import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { superAdminService } from '../services/superAdminService'
import { cookieService } from '../services/cookieService'
import { settingsService } from '../services/settingsService'
import logo from '../assets/logo.ahrf.jpeg'

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [resellers, setResellers] = useState([])
  const [cookies, setCookies] = useState([])
  const [branding, setBranding] = useState({ footerText: '' })
  const [settings, setSettings] = useState({ ipWhitelist: '', staticIP: '', globalLimits: {} })
  
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddReseller, setShowAddReseller] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user', startDate: '', expiryDate: '', keywordLimit: '', status: 'active' })
  const [newReseller, setNewReseller] = useState({ name: '', email: '', password: '', startDate: '', expiryDate: '', keywordLimit: '', status: 'active' })
  const [loading, setLoading] = useState(false)
  const [editingCookie, setEditingCookie] = useState(null)
  const [cookieData, setCookieData] = useState('')
  const [showCookieEditor, setShowCookieEditor] = useState(false)
  const [cookieError, setCookieError] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await superAdminService.getUsers()
        if (response.success) {
          const allUsers = response.data.users
          setUsers(allUsers.filter(u => u.role === 'USER'))
          setResellers(allUsers.filter(u => u.role === 'RESELLER'))
        }
      } catch (error) {
        showToast('Failed to load users', 'error')
      }
    }
    
    const loadCookies = async () => {
      try {
        const response = await cookieService.getCookies()
        if (response.success) {
          setCookies(response.data.cookies)
        }
      } catch (error) {
        showToast('Failed to load cookies', 'error')
      }
    }
    
    const loadBranding = async () => {
      try {
        const response = await settingsService.getBranding()
        if (response.success) {
          setBranding(response.data.branding)
        }
      } catch (error) {
        showToast('Failed to load branding', 'error')
      }
    }
    
    const loadSettings = async () => {
      try {
        const response = await settingsService.getSettings()
        if (response.success) {
          setSettings(response.data.settings)
        }
      } catch (error) {
        showToast('Failed to load settings', 'error')
      }
    }
    
    if (activeTab === 'users') {
      loadUsers()
    } else if (activeTab === 'cookies') {
      loadCookies()
    } else if (activeTab === 'branding') {
      loadBranding()
    } else if (activeTab === 'settings') {
      loadSettings()
    }
  }, [activeTab, showToast])

  const handleAddUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await superAdminService.createUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password || 'defaultPassword123',
        role: 'USER',
        startDate: newUser.startDate,
        expireDate: newUser.expiryDate,
        keywordLimit: parseInt(newUser.keywordLimit) || 0,
        isActive: newUser.status === 'active'
      })
      if (response.success) {
        showToast('User added successfully!', 'success')
        const usersResponse = await superAdminService.getUsers()
        if (usersResponse.success) {
          const allUsers = usersResponse.data.users
          setUsers(allUsers.filter(u => u.role === 'USER'))
          setResellers(allUsers.filter(u => u.role === 'RESELLER'))
        }
        setNewUser({ name: '', email: '', password: '', role: 'user', startDate: '', expiryDate: '', keywordLimit: '', status: 'active' })
        setShowAddUser(false)
      }
    } catch (error) {
      showToast(error.message || 'Failed to add user', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddReseller = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await superAdminService.createUser({
        name: newReseller.name,
        email: newReseller.email,
        password: newReseller.password || 'defaultPassword123',
        role: 'RESELLER',
        startDate: newReseller.startDate,
        expireDate: newReseller.expiryDate,
        keywordLimit: parseInt(newReseller.keywordLimit) || 0,
        isActive: newReseller.status === 'active'
      })
      if (response.success) {
        showToast('Reseller Admin added successfully!', 'success')
        const usersResponse = await superAdminService.getUsers()
        if (usersResponse.success) {
          const allUsers = usersResponse.data.users
          setUsers(allUsers.filter(u => u.role === 'USER'))
          setResellers(allUsers.filter(u => u.role === 'RESELLER'))
        }
        setNewReseller({ name: '', email: '', password: '', startDate: '', expiryDate: '', keywordLimit: '', status: 'active' })
        setShowAddReseller(false)
      }
    } catch (error) {
      showToast(error.message || 'Failed to add reseller', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateKeywordLimit = async (id, limit, type) => {
    const numLimit = parseInt(limit) || 0
    if (!numLimit) return
    
    try {
      const response = await superAdminService.updateUser(id, { keywordLimit: numLimit })
      if (response.success) {
        showToast('Keyword limit updated!', 'success')
        const usersResponse = await superAdminService.getUsers()
        if (usersResponse.success) {
          const allUsers = usersResponse.data.users
          setUsers(allUsers.filter(u => u.role === 'USER'))
          setResellers(allUsers.filter(u => u.role === 'RESELLER'))
        }
      }
    } catch (error) {
      showToast(error.message || 'Failed to update limit', 'error')
    }
  }

  const validateJSON = (jsonString) => {
    if (!jsonString.trim()) {
      return { valid: false, error: 'Cookie data cannot be empty' }
    }
    try {
      JSON.parse(jsonString)
      return { valid: true, error: '' }
    } catch (error) {
      return { valid: false, error: 'Invalid JSON format' }
    }
  }

  const handleSaveCookie = async () => {
    const validation = validateJSON(cookieData)
    if (!validation.valid) {
      setCookieError(validation.error)
      showToast(validation.error, 'error')
      return
    }

    setLoading(true)
    try {
      if (editingCookie) {
        const response = await cookieService.updateCookie(editingCookie._id || editingCookie.id, {
          data: cookieData,
          owner: editingCookie.owner || ''
        })
        if (response.success) {
          showToast('Cookie updated successfully!', 'success')
          const cookiesResponse = await cookieService.getCookies()
          if (cookiesResponse.success) {
            setCookies(cookiesResponse.data.cookies)
          }
        }
      } else {
        const response = await cookieService.createCookie({
          data: cookieData,
          owner: ''
        })
        if (response.success) {
          showToast('Cookie added successfully!', 'success')
          const cookiesResponse = await cookieService.getCookies()
          if (cookiesResponse.success) {
            setCookies(cookiesResponse.data.cookies)
          }
        }
      }
      setCookieError('')
      setCookieSuccess('')
      setEditingCookie(null)
      setCookieData('')
      setShowCookieEditor(false)
    } catch (error) {
      showToast(error.message || 'Failed to save cookie', 'error')
    } finally {
      setLoading(false)
    }
  }

  const allUsers = [...users, ...resellers]

  return (
    <div className="super-admin-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Ahrefs Logo" className="sidebar-logo" />
          <h2>Super Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            Users & Resellers
          </button>
          <button className={activeTab === 'cookies' ? 'active' : ''} onClick={() => setActiveTab('cookies')}>
            Cookie Management
          </button>
          <button className={activeTab === 'branding' ? 'active' : ''} onClick={() => setActiveTab('branding')}>
            Branding
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            Settings
          </button>
          <button className={activeTab === 'tool' ? 'active' : ''} onClick={() => setActiveTab('tool')}>
            Ahrefs Tool
          </button>
        </nav>
      </div>

      <div className="main-content">
        <header className="main-header">
          <div>
            <h1>{activeTab === 'users' ? 'Users & Resellers' : activeTab === 'cookies' ? 'Cookie Management' : activeTab === 'branding' ? 'Branding' : activeTab === 'settings' ? 'Settings' : 'Ahrefs Tool'}</h1>
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
                <h2>Users</h2>
                <button onClick={() => setShowAddUser(true)} className="btn-primary">Add User</button>
              </div>

              {showAddUser && (
                <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
                  <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h3>Add User</h3>
                    <form onSubmit={handleAddUser}>
                      <input type="text" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                      <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                      <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                      <input type="date" placeholder="Start Date" value={newUser.startDate} onChange={(e) => setNewUser({ ...newUser, startDate: e.target.value })} required />
                      <input type="date" placeholder="Expiry Date" value={newUser.expiryDate} onChange={(e) => setNewUser({ ...newUser, expiryDate: e.target.value })} required />
                      <input type="number" placeholder="Keyword Limit" value={newUser.keywordLimit} onChange={(e) => setNewUser({ ...newUser, keywordLimit: e.target.value })} required />
                      <select value={newUser.status} onChange={(e) => setNewUser({ ...newUser, status: e.target.value })} required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div className="modal-actions">
                        <button type="button" onClick={() => setShowAddUser(false)} className="btn-secondary" disabled={loading}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add User'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="section-header">
                <h2>Reseller Admins</h2>
                <button onClick={() => setShowAddReseller(true)} className="btn-primary">Add Reseller Admin</button>
              </div>

              {showAddReseller && (
                <div className="modal-overlay" onClick={() => setShowAddReseller(false)}>
                  <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h3>Add Reseller Admin</h3>
                    <form onSubmit={handleAddReseller}>
                      <input type="text" placeholder="Name" value={newReseller.name} onChange={(e) => setNewReseller({ ...newReseller, name: e.target.value })} required />
                      <input type="email" placeholder="Email" value={newReseller.email} onChange={(e) => setNewReseller({ ...newReseller, email: e.target.value })} required />
                      <input type="password" placeholder="Password" value={newReseller.password} onChange={(e) => setNewReseller({ ...newReseller, password: e.target.value })} required />
                      <input type="date" placeholder="Start Date" value={newReseller.startDate} onChange={(e) => setNewReseller({ ...newReseller, startDate: e.target.value })} required />
                      <input type="date" placeholder="Expiry Date" value={newReseller.expiryDate} onChange={(e) => setNewReseller({ ...newReseller, expiryDate: e.target.value })} required />
                      <input type="number" placeholder="Keyword Limit" value={newReseller.keywordLimit} onChange={(e) => setNewReseller({ ...newReseller, keywordLimit: e.target.value })} required />
                      <select value={newReseller.status} onChange={(e) => setNewReseller({ ...newReseller, status: e.target.value })} required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div className="modal-actions">
                        <button type="button" onClick={() => setShowAddReseller(false)} className="btn-secondary" disabled={loading}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Reseller'}</button>
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
                      <th>Role</th>
                      <th>Status</th>
                      <th>Keywords Used</th>
                      <th>Keywords Remaining</th>
                      <th>Start Date</th>
                      <th>Expiry Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(u => (
                      <tr key={u._id || u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                        <td><span className={`badge badge-${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'active' : 'inactive'}</span></td>
                        <td>{u.limits?.keywordUsed || 0}</td>
                        <td>{Math.max(0, (u.limits?.keywordLimit || 0) - (u.limits?.keywordUsed || 0))}</td>
                        <td>{u.startDate ? new Date(u.startDate).toLocaleDateString() : '-'}</td>
                        <td>{u.expireDate ? new Date(u.expireDate).toLocaleDateString() : '-'}</td>
                        <td>
                          <input
                            type="number"
                            placeholder="New limit"
                            className="inline-input"
                            onBlur={(e) => e.target.value && handleUpdateKeywordLimit(u._id || u.id, e.target.value, u.role === 'RESELLER' ? 'reseller' : 'user')}
                          />
                        </td>
                      </tr>
                    ))}
                    {allUsers.length === 0 && (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Cookie Management</h2>
                <button onClick={() => { setEditingCookie(null); setCookieData(''); setShowCookieEditor(true); }} className="btn-primary">Add Cookie</button>
              </div>

              {showCookieEditor && (
                <div className="cookie-editor">
                  <h3>{editingCookie ? 'Edit Cookie' : 'Add New Cookie'}</h3>
                  <textarea
                    placeholder='Paste cookie JSON here, e.g. {"cookie1": "value1", "cookie2": "value2"}'
                    value={cookieData}
                    onChange={(e) => {
                      setCookieData(e.target.value)
                      const validation = validateJSON(e.target.value)
                      setCookieError(validation.error)
                    }}
                    rows="8"
                    className={`cookie-textarea ${cookieError ? 'error' : ''}`}
                  />
                  {cookieError && <div className="error-message">{cookieError}</div>}
                  {editingCookie && (
                    <input
                      type="text"
                      placeholder="Assign to owner (email)"
                      value={editingCookie.owner || ''}
                      onChange={(e) => setEditingCookie({ ...editingCookie, owner: e.target.value })}
                    />
                  )}
                  <div className="form-actions">
                    <button 
                      onClick={handleSaveCookie} 
                      className="btn-primary"
                      disabled={!cookieData.trim() || !!cookieError || loading}
                    >
                      {loading ? 'Saving...' : 'Save Cookie'}
                    </button>
                    <button onClick={() => { setEditingCookie(null); setCookieData(''); setCookieError(''); setShowCookieEditor(false); }} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )}

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cookie Data</th>
                      <th>Owner</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookies.map(c => (
                      <tr key={c._id || c.id}>
                        <td>{c._id || c.id}</td>
                        <td><code className="cookie-preview">{c.data.substring(0, 50)}...</code></td>
                        <td>
                          <input
                            type="email"
                            placeholder="User email"
                            value={c.owner || ''}
                            onBlur={async (e) => {
                              if (e.target.value && e.target.value !== c.owner) {
                                try {
                                  await cookieService.assignCookie(c._id || c.id, e.target.value)
                                  const cookiesResponse = await cookieService.getCookies()
                                  if (cookiesResponse.success) {
                                    setCookies(cookiesResponse.data.cookies)
                                    showToast('Cookie assigned successfully!', 'success')
                                  }
                                } catch (error) {
                                  showToast(error.message || 'Failed to assign cookie', 'error')
                                }
                              }
                            }}
                            className="inline-input"
                          />
                        </td>
                        <td>
                          <button onClick={() => { setEditingCookie(c); setCookieData(c.data); setCookieError(''); setShowCookieEditor(true); }} className="btn-small">Edit</button>
                        </td>
                      </tr>
                    ))}
                    {cookies.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No cookies found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="tab-content">
              <div className="branding-section">
                <h2>Branding Settings</h2>
                <div className="form-group">
                  <label>Custom Footer Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Service by XYZ"
                    value={branding.footerText}
                    onChange={(e) => setBranding({ ...branding, footerText: e.target.value })}
                  />
                </div>
                <button onClick={async () => {
                  try {
                    const response = await settingsService.updateBranding(branding)
                    if (response.success) {
                      showToast('Branding settings saved!', 'success')
                    }
                  } catch (error) {
                    showToast('Failed to save branding', 'error')
                  }
                }} className="btn-primary">Save Branding</button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-content">
              <div className="settings-section">
                <h2>System Settings</h2>
                <div className="form-group">
                  <label>IP Whitelist</label>
                  <textarea
                    placeholder="Enter IP addresses (one per line)"
                    value={settings.ipWhitelist}
                    onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                    rows="5"
                  />
                </div>
                <div className="form-group">
                  <label>Static IP Information</label>
                  <input
                    type="text"
                    placeholder="Static IP address"
                    value={settings.staticIP}
                    onChange={(e) => setSettings({ ...settings, staticIP: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Global Limits</label>
                  <input
                    type="number"
                    placeholder="Default Keyword Limit"
                    value={settings.globalLimits.keywordLimit || ''}
                    onChange={(e) => setSettings({ ...settings, globalLimits: { ...settings.globalLimits, keywordLimit: e.target.value } })}
                  />
                </div>
                <button onClick={async () => {
                  try {
                    const response = await settingsService.updateSettings(settings)
                    if (response.success) {
                      showToast('Settings saved!', 'success')
                    }
                  } catch (error) {
                    showToast('Failed to save settings', 'error')
                  }
                }} className="btn-primary">Save Settings</button>
              </div>
            </div>
          )}

          {activeTab === 'tool' && (
            <div className="tab-content">
              <div className="tool-container">
                <iframe
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/proxy?url=https://ahrefs.com`}
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

export default SuperAdminDashboard
