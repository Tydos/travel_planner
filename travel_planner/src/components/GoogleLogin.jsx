import { GoogleLogin } from '@react-oauth/google'
import './GoogleLogin.css'

function GoogleLoginButton({ onSuccess, onError }) {
  const handleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google')
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      console.log('Sending request to:', `${API_URL}/api/auth/google`)
      
      // Send token to backend
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      }).catch((fetchError) => {
        console.error('Fetch error:', fetchError)
        throw new Error(`Cannot connect to backend at ${API_URL}. Please check:\n1. Backend is running (python app.py)\n2. Backend is on port 5000\n3. No firewall blocking connection\n\nError: ${fetchError.message}`)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        console.log('✅ Login Successful!')
        console.log('👤 Name:', data.user.name)
        console.log('🆔 Google ID:', data.user.google_id)
        
        alert(`✅ Login Successful!\n\nName: ${data.user.name}\nEmail: ${data.user.email}`)
        
        if (onSuccess) {
          onSuccess(data.user)
        }
      } else {
        throw new Error(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert(`Login failed: ${error.message}`)
      if (onError) {
        onError(error)
      }
    }
  }

  const handleError = () => {
    alert('Google login failed. Please try again.')
  }

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
      />
    </div>
  )
}

export default GoogleLoginButton
