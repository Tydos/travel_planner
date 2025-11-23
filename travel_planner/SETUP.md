# Simple Setup Guide

## Quick Start

### 1. Backend Setup

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Create `.env` file:**
```
MONGO_URI=your-mongodb-connection-string
DB_NAME=sample_mflix
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Note:** `DB_NAME` is read from environment variable, not hardcoded. Set it to your database name (e.g., `sample_mflix`).

**Run backend:**
```bash
python app.py
```

### 2. Frontend Setup

**Install dependencies:**
```bash
npm install
```

**Create `.env` file:**
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Run frontend:**
```bash
npm run dev
```

## What It Does

1. User clicks "Sign in with Google"
2. Google OAuth verifies user
3. Backend saves user to MongoDB:
   - `google_id` - User's Google ID
   - `name` - User's name
   - `email` - User's email
4. User sees their profile

**That's it!** No tokens, no sessions, just simple authentication.

## MongoDB

Only one collection: `users`

Stores:
- `google_id` (unique identifier)
- `name`
- `email`
- `created_at`
- `updated_at`

