# Simplified Codebase

## What Was Removed

### Backend:
- ❌ All trip management routes
- ❌ Token verification on routes
- ❌ JWT token handling
- ❌ Complex authentication flows
- ❌ Cities collection
- ❌ Trips collection

### Frontend:
- ❌ MyTrips component
- ❌ TravelerForm component
- ❌ InviteFriends component
- ❌ TripPreferences component
- ❌ Token storage/management
- ❌ Complex state management

### Files:
- ❌ All documentation files (kept only README.md)
- ❌ saveToJson utility

## What Remains

### Backend:
- ✅ `app.py` - Simple Flask server with one endpoint: `/api/auth/google`
- ✅ `auth.py` - Google token verification and user save
- ✅ `db.py` - MongoDB connection (only users collection)

### Frontend:
- ✅ `App.jsx` - Simple app with login and user dashboard
- ✅ `Header.jsx` - Header with login button
- ✅ `UserProfile.jsx` - User profile display
- ✅ `GoogleLogin.jsx` - Google login button

## Current Flow

1. User clicks "Sign in with Google"
2. Google OAuth popup appears
3. User selects account
4. Frontend sends token to `/api/auth/google`
5. Backend verifies token and saves user to MongoDB
6. User sees their profile (name, email, google_id)

**No tokens stored, no sessions, just simple authentication!**

