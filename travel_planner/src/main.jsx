import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// Get Google Client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

// Check if client ID is set
if (!GOOGLE_CLIENT_ID) {
  console.error('⚠️ VITE_GOOGLE_CLIENT_ID is not set!')
  console.error('Please create a .env file in the travel_planner folder with:')
  console.error('VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>⚠️ Google OAuth Not Configured</h2>
        <p>Please set VITE_GOOGLE_CLIENT_ID in your .env file</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Create a file named <code>.env</code> in the travel_planner folder with:<br/>
          <code>VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com</code>
        </p>
      </div>
    )}
  </StrictMode>,
)
