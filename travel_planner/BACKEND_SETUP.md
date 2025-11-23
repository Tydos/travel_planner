# Backend Setup in Main Folder

The backend code has been moved to the main `travel_planner` folder alongside the frontend.

## File Structure

```
travel_planner/
├── app.py              # Flask backend server
├── auth.py             # Google OAuth authentication
├── db.py               # MongoDB connection
├── requirements.txt    # Python dependencies
├── .env                # Environment variables (create this)
├── src/                # Frontend React code
├── package.json        # Frontend dependencies
└── ...
```

## Setup

### 1. Install Python Dependencies

```bash
cd travel_planner
pip install -r requirements.txt
```

### 2. Create `.env` File

Create a `.env` file in the `travel_planner` folder with:

```env
# MongoDB
MONGO_URI=your-mongodb-connection-string
DB_NAME=wandersync

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
FLASK_SECRET_KEY=your-random-secret-key-here
```

### 3. Run Backend

```bash
cd travel_planner
python app.py
```

Backend will run on: http://localhost:5000

### 4. Run Frontend (in another terminal)

```bash
cd travel_planner
npm run dev
```

Frontend will run on: http://localhost:5174

## Running Both Servers

**Terminal 1 - Backend:**
```bash
cd travel_planner
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd travel_planner
npm run dev
```

## Notes

- Both backend and frontend are now in the same folder
- Backend `.env` file should be in `travel_planner/` folder
- Frontend `.env` file should also be in `travel_planner/` folder
- Backend runs on port 5000
- Frontend runs on port 5174

