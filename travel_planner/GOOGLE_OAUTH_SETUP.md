# Google OAuth 2.0 Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** and **Google Identity API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: WanderSync
   - Support email: your-email@example.com
   - Scopes: email, profile
6. Create OAuth Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5174`
   - Authorized redirect URIs: `http://localhost:5174/auth/google/callback`
7. Save your **Client ID** and **Client Secret**

## Step 2: Environment Variables

Create `.env` file in backend:
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
FLASK_SECRET_KEY=your-secret-key-here
```

Create `.env` file in frontend (or use Vite env):
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## Step 3: Install Dependencies

Backend:
```bash
pip install flask-oauthlib google-auth google-auth-oauthlib google-auth-httplib2
```

Frontend:
```bash
npm install @react-oauth/google
```

## Step 4: Usage

1. Start backend: `python app.py` (port 5000)
2. Start frontend: `npm run dev` (port 5174)
3. Click "Sign in with Google" button
4. User profile will be saved to MongoDB

