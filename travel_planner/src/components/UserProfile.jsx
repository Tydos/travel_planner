import { useState, useEffect } from 'react'
import GoogleLoginButton from './GoogleLogin'
import './UserProfile.css'

function UserProfile({ onUserChange }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        if (onUserChange) {
          onUserChange(userData)
        }
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
  }, [onUserChange])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    if (onUserChange) {
      onUserChange(userData)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    if (onUserChange) {
      onUserChange(null)
    }
  }

  if (user) {
    return (
      <div className="user-profile">
        <div className="user-info">
          <p className="user-name">{user.name}</p>
          <p className="user-email">{user.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="user-profile">
      <GoogleLoginButton 
        onSuccess={handleLoginSuccess}
        onError={(error) => console.error('Login error:', error)}
      />
    </div>
  )
}

export default UserProfile
