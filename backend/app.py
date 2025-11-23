from flask import Flask, request, jsonify
from flask_cors import CORS
from db import dbname,users_collection,cities_collection,trips_collection
from bson.objectid import ObjectId
from bson.json_util import dumps
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime
from functools import wraps

load_dotenv()

# Import auth functions
try:
    from auth import verify_google_token, create_jwt_token, save_or_update_user
except ImportError:
    print("Warning: auth.py not found. OAuth features will not work.")

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'your-secret-key-change-this')

print(f"\nConnected to DB: {dbname}")
print(f"Available collections: {users_collection.name},{cities_collection.name}\n")

@app.route("/")
def home():
    return {"message": "Flask backend running"}

@app.route("/dummyuser")
def get_dummies():
    data = [{ "id": "alice"}]
    return jsonify(data)
    
@app.route("/getuser", methods=["GET"])
def get_user():
   # Ensure the database connection is active
    if users_collection is None:
        return jsonify({"error": "Database connection failed"}), 500
        
    try:
        # 1. Execute the find query with an empty filter {}
        # This retrieves ALL documents in the collection
        cursor = users_collection.find({})
        
        # 2. Convert the PyMongo cursor into a list of dictionaries
        users_list = list(cursor)
        
        names_list = [user['name'] for user in users_list]
        json_data = dumps(names_list)
        
        # Return the JSON string with the correct status and mimetype
        return app.response_class(
            response=json_data,
            status=200,
            mimetype='application/json'
        )
    except:
        pass
      
@app.route("/adduser", methods=["POST"])
def add_user():
    #     new_user = {
    #     "id": "alice",
    #     "name": "Alice",
    #     "total_budget": 800,
    #     "monthly_saving_capacity": 150,
    #     "preference_weights": {
    #         "nightlife": 4,
    #         "adventure": 2,
    #         "shopping": 1,
    #         "food": 5,
    #         "urban": 4
    #     },
    #     "constraints": {
    #         "min_hotel_rating": 3,
    #         "max_flight_legs": 2
    #     },
    #     "notes": "Budget foodie, hates early mornings and hiking, loves walkable neighborhoods and speakeasies."
    # }
        # 1. Get data from request
        data = request.get_json()

        # 2. Insert the data into MongoDB
        result = users_collection.insert_one(data)

        # 3. Success Response
        return jsonify({
            "message": "Hardcoded user added successfully",
            "id": str(result.inserted_id) 
        }), 201

@app.route("/deluser/<string:user_name>", methods=["DELETE"])
def del_user(user_name):
    # 1. Define the query filter using the 'name' field
    user_name = user_name.strip()

    filter_query = {"name": user_name}

    # 2. Execute the delete operation
    delete_result = users_collection.delete_one(filter_query)

    # 3. Handle the result using the correct attribute
    if delete_result.deleted_count == 1:
        return jsonify({
            "message": f"User with name '{user_name}' deleted successfully"
        }), 200
    else:
        return jsonify({
            "message": f"User with name '{user_name}' not found"
        }), 404


@app.route("/addcity",methods=["POST"])
def add_city():
        new_city = {'id': 'boise',
        'name': 'Boise',
        'vibe_tags': {'nightlife': 0.18,
        'adventure': 0.04,
        'shopping': 0.01,
        'food': 0.66,
        'urban': 0.12},
        'avg_price_proxy': 27.554744525547445,
        'cost_index': 0.5443276450350364,
        'typical_cost_level': 'medium'
        }
            
        # 2. Insert the hardcoded data
        result = cities_collection.insert_one(new_city)
        
        # 3. Success Response
        return jsonify({
            "message": "City added successfully",
            "id": str(result.inserted_id) 
        }), 201

# Google OAuth Routes
@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    """Handle Google OAuth token verification"""
    try:
        from auth import verify_google_token, create_jwt_token, save_or_update_user
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        token = data.get('token')
        
        if not token:
            print("ERROR: No token provided")
            return jsonify({"error": "Token is required"}), 400
        
        print(f"Received token, verifying...")
        
        # Verify Google token
        user_data = verify_google_token(token)
        
        if not user_data:
            print("ERROR: Token verification failed")
            return jsonify({"error": "Invalid token. Please check:\n1. Google Client ID is correct\n2. OAuth consent screen is configured\n3. Token is valid"}), 401
        
        print(f"Token verified for user: {user_data.get('email')}")
        
        # Save or update user in database
        user = save_or_update_user(user_data)
        
        if not user:
            print("ERROR: Failed to save user to database")
            return jsonify({"error": "Failed to save user to database"}), 500
        
        # Create JWT token for session
        jwt_token = create_jwt_token(user_data)
        
        print(f"User authenticated successfully: {user['email']}")
        
        return jsonify({
            "success": True,
            "user": {
                "google_id": user['google_id'],
                "email": user['email'],
                "name": user['name'],
                "picture": user.get('picture', '')
            },
            "token": jwt_token
        }), 200
        
    except ImportError as e:
        print(f"Import error: {e}")
        return jsonify({"error": "OAuth not configured. Please check:\n1. auth.py exists\n2. GOOGLE_CLIENT_ID is set in .env\n3. All dependencies are installed"}), 500
    except Exception as e:
        print(f"Auth error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Authentication error: {str(e)}"}), 500

@app.route("/api/auth/verify", methods=["GET"])
def verify_token():
    """Verify JWT token and return user info"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({"error": "Token is required"}), 401
        
        # Decode JWT token
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        
        # Get user from database
        user = users_collection.find_one({'google_id': payload['google_id']})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "success": True,
            "user": {
                "google_id": user['google_id'],
                "email": user['email'],
                "name": user['name'],
                "picture": user.get('picture', '')
            }
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    """Logout user"""
    return jsonify({"success": True, "message": "Logged out successfully"}), 200

# Helper function to verify JWT token
def verify_jwt_token():
    """Extract and verify JWT token from request"""
    try:
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.replace('Bearer ', '')
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except Exception:
        return None

# Trip Management Routes
@app.route("/api/trips", methods=["POST"])
def create_trip():
    """Create a new trip for the logged-in user"""
    try:
        # Verify user is logged in
        user_payload = verify_jwt_token()
        if not user_payload:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        
        # Generate unique trip ID
        import random
        import string
        trip_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        
        trip_doc = {
            'trip_id': trip_id,
            'user_google_id': user_payload['google_id'],
            'user_email': user_payload['email'],
            'name': data.get('name', ''),
            'destination': data.get('destination', ''),
            'start_date': data.get('startDate', ''),
            'end_date': data.get('endDate', ''),
            'budget': data.get('budget', ''),
            'max_budget': data.get('maxBudget', ''),
            'typical_cost_level': data.get('typical_cost_level', 'medium'),
            'vibe_tags': data.get('vibe_tags', {}),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'status': 'active'
        }
        
        result = trips_collection.insert_one(trip_doc)
        
        return jsonify({
            "success": True,
            "trip_id": trip_id,
            "trip": trip_doc,
            "message": "Trip created successfully"
        }), 201
        
    except Exception as e:
        print(f"Error creating trip: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/trips", methods=["GET"])
def get_user_trips():
    """Get all trips for the logged-in user"""
    try:
        # Verify user is logged in
        user_payload = verify_jwt_token()
        if not user_payload:
            return jsonify({"error": "Authentication required"}), 401
        
        # Get all trips for this user
        trips = list(trips_collection.find(
            {'user_google_id': user_payload['google_id']},
            {'_id': 0}  # Exclude MongoDB _id
        ).sort('created_at', -1))
        
        return jsonify({
            "success": True,
            "trips": trips,
            "count": len(trips)
        }), 200
        
    except Exception as e:
        print(f"Error getting trips: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/trips/<trip_id>", methods=["GET"])
def get_trip(trip_id):
    """Get a specific trip by ID"""
    try:
        # Verify user is logged in
        user_payload = verify_jwt_token()
        if not user_payload:
            return jsonify({"error": "Authentication required"}), 401
        
        trip = trips_collection.find_one(
            {
                'trip_id': trip_id,
                'user_google_id': user_payload['google_id']
            },
            {'_id': 0}
        )
        
        if not trip:
            return jsonify({"error": "Trip not found"}), 404
        
        return jsonify({
            "success": True,
            "trip": trip
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/trips/<trip_id>", methods=["DELETE"])
def delete_trip(trip_id):
    """Delete a trip"""
    try:
        # Verify user is logged in
        user_payload = verify_jwt_token()
        if not user_payload:
            return jsonify({"error": "Authentication required"}), 401
        
        result = trips_collection.delete_one({
            'trip_id': trip_id,
            'user_google_id': user_payload['google_id']
        })
        
        if result.deleted_count == 0:
            return jsonify({"error": "Trip not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Trip deleted successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
