# WanderSync - Simple Google OAuth App

Simple app that uses Google OAuth 2.0 to authenticate users and stores their profile (name and Google ID) in MongoDB.

## Features

- ✅ Google OAuth 2.0 authentication
- ✅ Stores user profile (name, email, google_id) in MongoDB
- ✅ Simple, no token management
- ✅ Clean and minimal codebase

## Setup

### 1. Install Dependencies

**Backend:**
```bash
pip install -r requirements.txt
```

**Frontend:**
```bash
npm install
```

### 2. Environment Variables

**Backend `.env`:**
```
MONGO_URI=your-mongodb-connection-string
DB_NAME=sample_mflix
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Note:** `DB_NAME` is read from environment variable. Set it to your actual database name.

**Frontend `.env`:**
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Run

**Backend:**
```bash
python app.py
```

**Frontend:**
```bash
npm run dev
```

## How It Works

1. User clicks "Sign in with Google"
2. Google OAuth verifies the user
3. Backend saves user to MongoDB (name, email, google_id)
4. User sees their profile

That's it! No tokens, no sessions, just simple authentication.

## MongoDB Collection

**`users` collection stores:**
- `google_id` - User's Google ID
- `name` - User's name
- `email` - User's email
- `created_at` - First login timestamp
- `updated_at` - Last update timestamp
