from flask import Flask, request, jsonify
from flask_cors import CORS
from db import dbname,users_collection,cities_collection
from bson.objectid import ObjectId
from bson.json_util import dumps
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()


app = Flask(__name__)
CORS(app)

print(f"\nConnected to DB: {dbname}")
print(f"Available collections: {users_collection.name},{cities_collection.name}\n")

@app.route("/")
def home():
    return {"message": "Flask backend running"}

@app.route("/dummyuser")
def get_dummies():
    data = [{ "id": "alice"}]
    return jsonify(data)
    
@app.route("/getusername", methods=["GET"])
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


# @app.route("/addcity",methods=["POST"])
# def add_city():
#         new_city = {'id': 'boise',
#         'name': 'Boise',
#         'vibe_tags': {'nightlife': 0.18,
#         'adventure': 0.04,
#         'shopping': 0.01,
#         'food': 0.66,
#         'urban': 0.12},
#         'avg_price_proxy': 27.554744525547445,
#         'cost_index': 0.5443276450350364,
#         'typical_cost_level': 'medium'
#         }
            
#         # 2. Insert the hardcoded data
#         result = cities_collection.insert_one(new_city)
        
#         # 3. Success Response
#         return jsonify({
#             "message": "City added successfully",
#             "id": str(result.inserted_id) 
#         }), 201

@app.route("/getcities", methods=["GET"])
def get_cities():
    try:
        prompt = (
            "Give me 3 random city names from around the world. "
            "Return only the city names separated by commas, no extra text."
        )
        response = client.models.generate_content(
            model="gemini-2.5-flash",  # or "models/gemini-2.5-flash"
            contents=prompt
        )
        print(response.text)
        # Convert comma-separated string into a list
        cities = [city.strip() for city in response.text.split(",")]
        # cities = []
        return jsonify(cities),200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(port=5000, debug=True)
