# Google OAuth 2.0 Quick Setup

## Step 1: Install Dependencies

### Frontend:
```bash
cd travel_planner
npm install
```

### Backend:
```bash
cd ../travel_planner/backend
pip install -r requirements.txt
```

## Step 2: Get Google OAuth Credentials

### ⚠️ IMPORTANT: OAuth Consent Screen Setup

1. Go to https://console.cloud.google.com/
2. Create/Select project
3. Enable **Google Identity API**
4. **FIRST**: Go to **OAuth consent screen** (APIs & Services → OAuth consent screen)
   - **User Type**: Select **External** (NOT Internal!)
   - **App name**: WanderSync
   - **User support email**: Your email
   - **Scopes**: Add `email`, `profile`, `openid`
   - **Test users**: Add your email (shash24negi@gmail.com)
   - Click **SAVE AND CONTINUE** through all steps
5. **THEN**: Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
6. Configure:
   - **Authorized JavaScript origins**: `http://localhost:5174`
   - **Authorized redirect URIs**: `http://localhost:5174`
7. Copy your **Client ID**

### ⚠️ Common Error Fix:
If you see "org_internal" error:
- Your app is set to "Internal" user type
- Change it to "External" in OAuth consent screen
- Add your email as a test user
- See `FIX_OAUTH_ERROR.md` for detailed steps

## Step 3: Set Environment Variables

### Frontend (.env file in travel_planner folder):
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Backend (.env file in backend folder):
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
FLASK_SECRET_KEY=your-random-secret-key-here
MONGO_URI=your-mongodb-uri
DB_NAME=your-database-name
```

## Step 4: Run the Application

### Terminal 1 - Backend:
```bash
cd travel_planner/backend
python app.py
```

### Terminal 2 - Frontend:
```bash
cd travel_planner
npm run dev
```

## Step 5: Test Login

1. Open http://localhost:5174
2. Click "Sign in with Google" in the header
3. Select your Google account
4. User profile will be saved to MongoDB

## Features

✅ Google OAuth 2.0 authentication  
✅ User profile stored in MongoDB  
✅ JWT token-based session management  
✅ Auto-login on page refresh  
✅ User profile display in header  
✅ Logout functionality  

## User Profile Data Stored

- Google ID
- Email
- Name
- Profile Picture
- Email Verified Status
- Created/Updated timestamps

