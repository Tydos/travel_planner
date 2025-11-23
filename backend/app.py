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
        # Always fetch fresh user data
        cursor = users_collection.find({})
        users_list = list(cursor)

        if not users_list:
            return jsonify({"error": "No users found in database."}), 400

        filtered_users = []
        for user in users_list:
            filtered_users.append({
                "name": user.get("name"),
                "total_budget": user.get("total_budget"),
                "monthly_saving_capacity": user.get("monthly_saving_capacity"),
                "preference_weights": user.get("preference_weights")
            })

        json_data = dumps(filtered_users)

        prompt = f"""
Recommend exactly 3 distinct activities in Madison, WI for the users in {json_data}, 
ensuring the total group cost is strictly less than the lowest user's total_budget. 
Ensure taking into account each user's preference categories and past activities,
including at least one activity they haven’t tried.
Use the categories Nightlife, Food, Urban, Nature, Culture, and Relaxation. 
For each activity, include:

- "name": the activity name
- "budget": total group cost
- "justification_score": one sentence explaining how it aligns with each user's top preference categories. Write the user names with no bold text in the justification.

Give one expensive activity, one moderate activity , and one free activity.
Return strictly a JSON array of 3 objects, with no extra text, explanations, or formatting.
"""
        response = client.models.generate_content(model="gemini-2.0-flash-lite-001", contents=prompt)
        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.text.strip(), flags=re.MULTILINE)
        return jsonify(cleaned), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from flask import Flask, request, jsonify
import json
from datetime import datetime, timedelta
from collections import Counter

app = Flask(__name__)

# --- Helper Functions ---

def find_most_common_window(group_members):
    """
    Find the most common trip window across all members.
    Returns a dict with trip_start and trip_end.
    """
    windows = [(m["trip_start"], m["trip_end"]) for m in group_members if "trip_start" in m and "trip_end" in m]
    if not windows:
        return None
    # Use Counter to find the most common window
    window_counts = Counter(windows)
    most_common_window, _ = window_counts.most_common(1)[0]
    return {"trip_start": most_common_window[0], "trip_end": most_common_window[1]}

def choose_best_city(group_members):
    """
    Dummy city choice: pick city that appears most in member preferences.
    """
    city_preferences = [m.get("preferred_city", "DefaultCity") for m in group_members]
    most_common_city, _ = Counter(city_preferences).most_common(1)[0]
    return {"best_city": most_common_city, "city_scores": {}, "explanation": "Chosen based on majority preference"}

def search_flights(member, destination, start_date, end_date):
    """
    Dummy flight search: returns placeholder flight info.
    """
    return {
        "member_id": member["id"],
        "flights": [
            {"flight_id": "F123", "price": 500, "departure": start_date, "return": end_date}
        ]
    }

def search_hotels(city, start_date, end_date):
    """
    Dummy hotel search.
    """
    return [
        {"hotel_id": "H001", "name": f"{city} Grand Hotel", "price_per_night": 150}
    ]

def compute_activity_scores(city, group_members, top_k=10):
    """
    Returns placeholder activities with dummy enjoyment scores.
    """
    activities = []
    for i in range(top_k):
        activities.append({
            "business_id": f"A{i+1}",
            "name": f"{city} Activity {i+1}",
            "adjusted_enjoyment_score": 100 - i  # decreasing scores
        })
    return activities

def build_itinerary(activities):
    """
    Simple 2-day itinerary: morning, afternoon, evening.
    """
    itinerary = {"day1": {}, "day2": {}}
    times = ["morning", "afternoon", "evening"]
    for day in ["day1", "day2"]:
        for i, t in enumerate(times):
            if i < len(activities):
                itinerary[day][t] = {"activity": activities[i]["business_id"], "score": activities[i]["adjusted_enjoyment_score"]}
    return itinerary

def compute_fairness(group_members):
    """
    Placeholder fairness calculation.
    """
    summary = {}
    for m in group_members:
        total = m.get("flight_price", 0) + m.get("hotel_share", 0) + m.get("activities_spend", 0)
        summary[m["id"]] = {"total_spent": total}
    return summary

# --- Endpoint ---

@app.route("/plan_trip", methods=["POST"])
def plan_trip():
    data = request.get_json()
    group_members = data.get("group_members", [])
    top_k = data.get("top_k_activities", 10)
    
    if not group_members:
        return jsonify({"error": "No group members provided"}), 400

    # 1. Determine common trip window
    window = find_most_common_window(group_members)
    if not window:
        return jsonify({"error": "No common trip window found"}), 400

    trip_start = window["trip_start"]
    trip_end = window["trip_end"]

    # 2. Choose best city
    city_result = choose_best_city(group_members)
    best_city = city_result["best_city"]

    # 3. Search flights for each member
    flights = []
    for member in group_members:
        flight_info = search_flights(member, best_city, trip_start, trip_end)
        flights.append(flight_info)
        # Assign dummy costs for fairness calculation
        member["flight_price"] = flight_info["flights"][0]["price"]

    # 4. Search hotels
    hotels = search_hotels(best_city, trip_start, trip_end)
    for member in group_members:
        member["hotel_share"] = hotels[0]["price_per_night"]  # simple share

    # 5. Compute activities
    activities = compute_activity_scores(best_city, group_members, top_k)

    # 6. Build itinerary
    itinerary = build_itinerary(activities)

    # 7. Assign dummy activity spend for fairness
    for member in group_members:
        member["activities_spend"] = 100  # placeholder

    # 8. Compute fairness
    fairness_summary = compute_fairness(group_members)

    # 9. Return consolidated response
    response = {
        "chosen_city": best_city,
        "trip_window": {"start": trip_start, "end": trip_end},
        "flights": flights,
        "hotels": hotels,
        "itinerary": itinerary,
        "fairness_summary": fairness_summary,
        "city_scores": city_result.get("city_scores"),
        "explanation": city_result.get("explanation")
    }

    return jsonify(response)


if __name__ == "__main__":
    try:
        app.run(port=5000, debug=True)
    except Exception as e:
        print(f"Failed to start Flask app: {e}")
