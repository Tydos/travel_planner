# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free tier M0 is fine)

### Step 2: Create Database User
1. Go to **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Set username and password (save these!)
4. Set user privileges: **Read and write to any database**

### Step 3: Whitelist IP Address
1. Go to **Network Access** → **Add IP Address**
2. Click **Add Current IP Address** (or use `0.0.0.0/0` for development)
3. Click **Confirm**

### Step 4: Get Connection String
1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Select **Python** and version **3.6 or later**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `wandersync`)

**Example connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wandersync?retryWrites=true&w=majority
```

### Step 5: Set Environment Variables
Create `backend/.env` file:
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wandersync?retryWrites=true&w=majority
DB_NAME=wandersync
GOOGLE_CLIENT_ID=your-google-client-id
FLASK_SECRET_KEY=your-random-secret-key-here
```

---

## Option 2: Local MongoDB

### Step 1: Install MongoDB
**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. Install as Windows Service (recommended)

**Or use MongoDB via Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 2: Verify MongoDB is Running
```bash
# Check if MongoDB is running
mongosh
# Or
mongo
```

### Step 3: Set Environment Variables
Create `backend/.env` file:
```
MONGO_URI=mongodb://localhost:27017/
DB_NAME=wandersync
GOOGLE_CLIENT_ID=your-google-client-id
FLASK_SECRET_KEY=your-random-secret-key-here
```

---

## Collections Created Automatically

The system will automatically create these collections when you first use them:

1. **`users`** - Stores user profiles from Google OAuth
   - Created when user logs in for first time

2. **`trips`** - Stores all user trips
   - Created when first trip is saved

3. **`cities`** - Stores city data (if you use city features)
   - Created when you add cities

**No manual collection creation needed!** They're created automatically.

---

## Testing MongoDB Connection

### Test Backend Connection:
1. Start backend:
   ```bash
   cd travel_planner/backend
   python app.py
   ```

2. Look for this message in terminal:
   ```
   Pinged your deployment. You successfully connected to MongoDB!
   Connected to DB: wandersync
   Available collections: users, trips, cities
   ```

### If Connection Fails:
- Check `MONGO_URI` in `.env` is correct
- Check MongoDB is running (if local)
- Check IP whitelist (if Atlas)
- Check username/password are correct
- Check network connectivity

---

## Database Structure

### Users Collection (Auto-created)
```javascript
{
  "_id": ObjectId("..."),
  "google_id": "123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "email_verified": true,
  "created_at": "2025-11-22T...",
  "updated_at": "2025-11-22T..."
}
```

### Trips Collection (Auto-created)
```javascript
{
  "_id": ObjectId("..."),
  "trip_id": "ABC123",
  "user_google_id": "123456789",
  "user_email": "user@example.com",
  "name": "John Doe",
  "destination": "Paris, France",
  "start_date": "2025-12-01",
  "end_date": "2025-12-07",
  "budget": "1500",
  "max_budget": "3000",
  "typical_cost_level": "medium",
  "vibe_tags": {
    "nightlife": 3,
    "adventure": 5,
    "shopping": 2,
    "food": 4,
    "urban": 1
  },
  "created_at": "2025-11-22T...",
  "updated_at": "2025-11-22T...",
  "status": "active"
}
```

---

## Quick Setup Checklist

- [ ] MongoDB installed/running (local) OR Atlas account created (cloud)
- [ ] Database user created with read/write permissions
- [ ] IP address whitelisted (if using Atlas)
- [ ] Connection string obtained
- [ ] `backend/.env` file created with:
  - [ ] `MONGO_URI` set correctly
  - [ ] `DB_NAME` set (e.g., `wandersync`)
  - [ ] `GOOGLE_CLIENT_ID` set
  - [ ] `FLASK_SECRET_KEY` set
- [ ] Backend started and connection verified
- [ ] Collections created automatically on first use

---

## Troubleshooting

**"Connection failed" error:**
- Verify MongoDB is running: `mongosh` or check Atlas cluster status
- Check connection string format
- Verify credentials in connection string
- Check firewall/network settings

**"Database connection failed" error:**
- Check `MONGO_URI` in `.env` file
- Ensure `.env` file is in `backend/` folder
- Restart backend after changing `.env`

**Collections not appearing:**
- Collections are created automatically on first insert
- Login with Google to create `users` collection
- Create a trip to create `trips` collection

---

**That's it!** Once MongoDB is connected, the system will automatically create and manage all collections.

