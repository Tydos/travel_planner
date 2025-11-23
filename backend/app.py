"""
Flask backend for managing users and cities with MongoDB and Google Gemini integration.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from db import dbname, users_collection, cities_collection
from bson.json_util import dumps
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
client = genai.Client()

app = Flask(__name__)
CORS(app)

print(f"\nConnected to DB: {dbname}")
print(f"Available collections: {users_collection.name},{cities_collection.name}\n")


@app.route("/")
def home():
    try:
        return {"message": "Flask backend running"}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @app.route("/dummyuser")
# def get_dummies():
#     try:
#         return jsonify([{"id": "alice"}])
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route("/getusername", methods=["GET"])
# def get_user():
#     try:
#         if users_collection is None:
#             return jsonify({"error": "Database connection failed"}), 500
#         cursor = users_collection.find({})
#         users_list = list(cursor)
#         names_list = [user['name'] for user in users_list]
#         json_data = dumps(names_list)
#         return app.response_class(response=json_data, status=200, mimetype='application/json')
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


json_data = []  # global variable

@app.route("/getusers", methods=["GET"])
def get_users():
    global json_data
    try:
        if users_collection is None:
            return jsonify({"error": "Database connection failed"}), 500

        # Fetch all users
        cursor = users_collection.find({})
        users_list = list(cursor)

        # Filter only the required fields
        filtered_users = []
        for user in users_list:
            filtered_users.append({
                "name": user.get("name"),
                "total_budget": user.get("total_budget"),
                "monthly_saving_capacity": user.get("monthly_saving_capacity"),
                "preference_weights": user.get("preference_weights")
            })

        json_data = dumps(filtered_users)  # update global
        print(json_data)
        return app.response_class(response=json_data, status=200, mimetype='application/json')

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/adduser", methods=["POST"])
def add_user():
    try:
        if users_collection is None:
            return jsonify({"error": "Database connection failed"}), 500
        data = request.get_json()
        result = users_collection.insert_one(data)
        return jsonify({"message": "User added successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/deluser/<string:user_name>", methods=["DELETE"])
def del_user(user_name):
    try:
        if users_collection is None:
            return jsonify({"error": "Database connection failed"}), 500
        user_name = user_name.strip()
        delete_result = users_collection.delete_one({"name": user_name})
        if delete_result.deleted_count == 1:
            return jsonify({"message": f"User with name '{user_name}' deleted successfully"}), 200
        return jsonify({"message": f"User with name '{user_name}' not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

import re
@app.route("/planmytrip", methods=["GET"])
def get_cities():
    try:
        prompt = f"""
          Recommend exactly 3 distinct activities in Madison, Wisconsin for the users in {json_data}, maximizing fairness by minimizing the unhappiness of the least satisfied user,
          keeping the total cost strictly below the lowest user's total_budget,
          including at least one activity they haven’t tried, using Nightlife, Food, Urban, Nature, Culture, and Relaxation categories;
          return strictly a JSON array of 3 objects with "name", "budget" (group cost), and "justification_score" (one sentence linking the activity to top preference categories) with no extra text.
        """
        response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.text.strip(), flags=re.MULTILINE)
        return jsonify(cleaned), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    try:
        app.run(port=5000, debug=True)
    except Exception as e:
        print(f"Failed to start Flask app: {e}")
