# Fix: "Failed to fetch" Error

## What This Error Means

"Failed to fetch" means the frontend **cannot connect to the backend server**. This is usually because:

1. **Backend is not running**
2. **Backend is running on wrong port**
3. **CORS issue**
4. **Network/firewall blocking connection**

## Quick Fix

### Step 1: Check Backend is Running

Open a terminal and run:
```bash
cd travel_planner
python app.py
```

You should see:
```
✅ Pinged your deployment. You successfully connected to MongoDB!
✅ Connected to database: sample_mflix
✅ Using collection: users
✅ Connected to DB: sample_mflix
✅ Available collections: users

 * Running on http://127.0.0.1:5000
```

**If you see errors:**
- Check MongoDB is connected
- Check `.env` file exists and has correct values
- Check all dependencies are installed: `pip install -r requirements.txt`

### Step 2: Test Backend Directly

Open browser and go to:
```
http://localhost:5000/
```

You should see:
```json
{"message": "Flask backend running"}
```

**If you get "Connection refused" or "This site can't be reached":**
- Backend is not running
- Start it with: `python app.py`

### Step 3: Check Port Numbers

**Backend:** Should run on port **5000**
**Frontend:** Should run on port **5174** (Vite default)

If backend is on different port, update frontend `.env`:
```
VITE_API_URL=http://localhost:YOUR_PORT
```

### Step 4: Check Firewall/Antivirus

Sometimes firewall or antivirus blocks localhost connections:
- Temporarily disable firewall
- Add exception for Python/Node.js
- Check Windows Defender settings

## Common Issues

### Issue 1: Backend Not Started
**Solution:**
```bash
cd travel_planner
python app.py
```

### Issue 2: Wrong Port
**Check backend terminal:**
```
* Running on http://127.0.0.1:5000
```

If different, update frontend `.env`:
```
VITE_API_URL=http://localhost:ACTUAL_PORT
```

### Issue 3: MongoDB Connection Failed
**Backend won't start if MongoDB is not connected.**

**For MongoDB Atlas:**
- Check connection string in `.env`
- Check IP is whitelisted
- Check username/password

**For Local MongoDB:**
- Make sure MongoDB is running
- Check connection string: `mongodb://localhost:27017/`

### Issue 4: CORS Error
**If you see CORS error in browser console:**

Check `app.py` has:
```python
from flask_cors import CORS
CORS(app, supports_credentials=True)
```

If missing, add it and restart backend.

## Testing Steps

1. **Start Backend:**
   ```bash
   cd travel_planner
   python app.py
   ```
   Should see: "Running on http://127.0.0.1:5000"

2. **Test Backend in Browser:**
   Go to: http://localhost:5000/
   Should see: `{"message": "Flask backend running"}`

3. **Start Frontend:**
   ```bash
   cd travel_planner
   npm run dev
   ```
   Should see: "Local: http://localhost:5174"

4. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Try to login
   - Look for specific error message

5. **Check Network Tab:**
   - DevTools → Network tab
   - Try to login
   - Look for request to `localhost:5000`
   - Check status code and error message

## Quick Checklist

- [ ] Backend is running (`python app.py`)
- [ ] Backend shows "Running on http://127.0.0.1:5000"
- [ ] Can access http://localhost:5000/ in browser
- [ ] MongoDB is connected (check backend terminal)
- [ ] Frontend is running (`npm run dev`)
- [ ] Frontend shows "Local: http://localhost:5174"
- [ ] No firewall blocking localhost
- [ ] CORS is enabled in backend
- [ ] Check browser console for specific error

## Still Not Working?

1. **Check backend terminal** for errors
2. **Check browser console** (F12) for specific error
3. **Check Network tab** to see if request is being sent
4. **Try different browser** or incognito mode
5. **Restart both servers**
6. **Check if port 5000 is already in use:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   ```

