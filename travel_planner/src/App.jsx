import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleUserChange = (userData) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('✅ User logged in!')
      console.log('👤 Name:', userData.name)
      console.log('🆔 Google ID:', userData.google_id)
    } else {
      localStorage.removeItem('user')
      console.log('❌ User logged out')
    }
  }

  if (!user) {
    return (
      <div className="app">
        <Header onUserChange={handleUserChange} />
        <div className="login-prompt">
          <div className="login-prompt-content">
            <h2>Welcome to WanderSync</h2>
            <p>Please sign in with Google</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
              Use the "Sign in with Google" button in the header above
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header onUserChange={handleUserChange} />
      <div className="user-dashboard">
        <div className="dashboard-content">
          <h2>Welcome, {user.name}!</h2>
          <div className="user-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Google ID:</strong> {user.google_id}</p>
          </div>
          <p style={{ marginTop: '20px', color: '#666' }}>
            Your profile has been saved to MongoDB!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
