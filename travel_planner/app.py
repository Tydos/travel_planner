from flask import Flask, request, jsonify
from flask_cors import CORS
from db import dbname, users_collection
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

if users_collection is not None:
    print(f"\n✅ Connected to DB: {dbname}")
    print(f"✅ Available collections: {users_collection.name}\n")
else:
    print(f"\n❌ WARNING: MongoDB connection failed!")
    print(f"❌ Please check your MONGO_URI in .env file\n")

@app.route("/")
def home():
    return {"message": "Flask backend running"}

# Google OAuth - Simple Login
@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    """Handle Google OAuth - verify token and save user to MongoDB"""
    try:
        from auth import verify_google_token, save_or_update_user
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        token = data.get('token')
        if not token:
            return jsonify({"error": "Token is required"}), 400
        
        # Verify Google token
        user_data = verify_google_token(token)
        if not user_data:
            return jsonify({"error": "Invalid token"}), 401
        
        # Save user to MongoDB (only name and google_id)
        print(f"Attempting to save user to MongoDB...")
        user = save_or_update_user(user_data)
        
        if not user:
            print("❌ Failed to save user - save_or_update_user returned None")
            return jsonify({"error": "Failed to save user to MongoDB. Check backend logs for details."}), 500
        
        print(f"✅ User saved to MongoDB!")
        print(f"📧 Email: {user.get('email', 'N/A')}")
        print(f"👤 Name: {user.get('name', 'N/A')}")
        print(f"🆔 Google ID: {user.get('google_id', 'N/A')}")
        
        return jsonify({
            "success": True,
            "user": {
                "google_id": user['google_id'],
                "name": user['name'],
                "email": user['email']
            }
        }), 200
        
    except Exception as e:
        print(f"Auth error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
