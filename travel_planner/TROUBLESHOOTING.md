# Troubleshooting: "Failed to save user" Error

## Common Causes

### 1. MongoDB Not Connected
**Check backend terminal when starting:**
- Should see: `✅ Pinged your deployment. You successfully connected to MongoDB!`
- If you see error: MongoDB connection failed

**Fix:**
- Check `MONGO_URI` in `.env` file
- Make sure MongoDB is running (if local)
- Check MongoDB Atlas cluster is running (if cloud)
- Verify connection string is correct

### 2. Missing Environment Variables
**Check `.env` file has:**
```
MONGO_URI=your-mongodb-connection-string
DB_NAME=sample_mflix
GOOGLE_CLIENT_ID=your-google-client-id
```

**Fix:**
- Create `.env` file in `travel_planner` folder
- Add all required variables
- Restart backend after adding `.env`

### 3. MongoDB Connection String Format
**For MongoDB Atlas:**
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wandersync?retryWrites=true&w=majority
```

**For Local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017/
```

**Fix:**
- Verify connection string format
- Check username/password are correct
- Check database name matches

### 4. Network/Firewall Issues
**If using MongoDB Atlas:**
- Check IP is whitelisted
- Add `0.0.0.0/0` for development

**Fix:**
- Go to MongoDB Atlas → Network Access
- Add your IP or `0.0.0.0/0`

## Debugging Steps

### Step 1: Check Backend Terminal
When you start backend (`python app.py`), look for:

**✅ Good:**
```
✅ Pinged your deployment. You successfully connected to MongoDB!
✅ Connected to database: sample_mflix
✅ Using collection: users
✅ Connected to DB: sample_mflix
✅ Available collections: users
```

**❌ Bad:**
```
❌ MongoDB connection error: ...
❌ WARNING: MongoDB connection failed!
```

### Step 2: Check Error Logs
When you try to login, check backend terminal for:
- `Attempting to save user to MongoDB...`
- `MongoDB update result: ...`
- `❌ Error saving user: ...`

### Step 3: Test MongoDB Connection
```python
# Test in Python
from db import users_collection
print(users_collection)
# Should print: Collection(Database(...), 'users')
# If None: MongoDB not connected
```

## Quick Fixes

### Fix 1: Check .env File
1. Make sure `.env` exists in `travel_planner` folder
2. Check all variables are set
3. Restart backend

### Fix 2: Test MongoDB Connection
1. Try connecting with MongoDB Compass
2. Or test with `mongosh` (command line)
3. Verify connection string works

### Fix 3: Check MongoDB Status
**For Local MongoDB:**
- Make sure MongoDB service is running
- Check port 27017 is open

**For MongoDB Atlas:**
- Check cluster is running
- Check IP whitelist
- Check connection string

## Expected Behavior

**When login succeeds:**
```
✅ User saved to MongoDB!
📧 Email: user@example.com
👤 Name: John Doe
🆔 Google ID: 123456789
```

**When save fails:**
```
❌ Error saving user: [error message]
❌ Failed to save user - save_or_update_user returned None
```

Check the error message in backend terminal for specific issue!

