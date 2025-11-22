"""
Simple Flight Search API
Usage: 
    from api_version import get_flights
    result = get_flights("JFK", "LAX", "2025-12-25", "2025-12-30")
"""

import os
import json
import requests
import uuid
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB setup
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DB_NAME', 'flight_search_db')
COLLECTION_NAME = 'Flights'

def store_to_mongodb(flight_data):
    """Store flight data to MongoDB with unique ID"""
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # Generate unique ID
        unique_id = str(uuid.uuid4())
        
        # Prepare document
        document = {
            "_id": unique_id,
            "search_id": unique_id,
            "timestamp": datetime.utcnow().isoformat(),
            "origin": flight_data.get("origin"),
            "destination": flight_data.get("destination"),
            "outbound_date": flight_data.get("outbound_date"),
            "return_date": flight_data.get("return_date"),
            "flights": flight_data.get("flights", []),
            "total_results": len(flight_data.get("flights", []))
        }
        
        # Insert into MongoDB
        collection.insert_one(document)
        client.close()
        
        return unique_id
    except Exception as e:
        print(f"MongoDB Error: {e}")
        return None

def get_flights(origin, destination, outbound_date, return_date):
    """
    Get 3 cheapest round-trip flights
    
    Args:
        origin: Airport code (e.g., 'JFK', 'LAX')
        destination: Airport code (e.g., 'LHR', 'CDG')
        outbound_date: Departure date in YYYY-MM-DD format
        return_date: Return date in YYYY-MM-DD format
    
    Returns:
        dict with flight results in JSON format
    """
    
    SERPAPI_KEY = os.getenv('SERPAPI_KEY')
    
    if not SERPAPI_KEY:
        return {"error": "SERPAPI_KEY not found in .env file"}
    
    # Normalize to uppercase
    origin = origin.strip().upper()
    destination = destination.strip().upper()
    
    # API call
    params = {
        "engine": "google_flights",
        "departure_id": origin,
        "arrival_id": destination,
        "outbound_date": outbound_date,
        "return_date": return_date,
        "currency": "USD",
        "hl": "en",
        "api_key": SERPAPI_KEY
    }
    
    try:
        response = requests.get("https://serpapi.com/search.json", params=params, timeout=30)
        
        if response.status_code != 200:
            return {"error": f"API Error: {response.status_code}"}
        
        data = response.json()
        
        if "error" in data:
            return {"error": data["error"]}
        
        # Get all flights
        all_flights = data.get("best_flights", []) + data.get("other_flights", [])
        
        if not all_flights:
            return {"error": "No flights found"}
        
        # Sort by price, get top 3
        cheapest = sorted(all_flights, key=lambda x: x.get('price', 999999))[:3]
        
        # Format results simply
        results = []
        for flight in cheapest:
            legs = flight.get("flights", [])
            if not legs:
                continue
            
            results.append({
                "price": flight.get("price"),
                "airline": legs[0].get("airline"),
                "flight_number": legs[0].get("flight_number"),
                "departure_time": legs[0].get("departure_airport", {}).get("time"),
                "arrival_time": legs[-1].get("arrival_airport", {}).get("time"),
                "duration_minutes": flight.get("total_duration"),
                "stops": len(legs) - 1,
                "all_legs": [
                    {
                        "airline": leg.get("airline"),
                        "flight_number": leg.get("flight_number"),
                        "from": leg.get("departure_airport", {}).get("id"),
                        "to": leg.get("arrival_airport", {}).get("id"),
                        "depart": leg.get("departure_airport", {}).get("time"),
                        "arrive": leg.get("arrival_airport", {}).get("time"),
                        "duration": leg.get("duration")
                    }
                    for leg in legs
                ]
            })
        
        return {
            "origin": origin,
            "destination": destination,
            "outbound_date": outbound_date,
            "return_date": return_date,
            "flights": results
        }
    
    except Exception as e:
        return {"error": str(e)}


def main():
    """Interactive user input for flight search"""
    origin = input("Origin: ").strip()
    destination = input("Destination: ").strip()
    outbound_date = input("Departure date (YYYY-MM-DD): ").strip()
    return_date = input("Return date (YYYY-MM-DD): ").strip()
    
    result = get_flights(origin, destination, outbound_date, return_date)
    
    print(json.dumps(result, indent=2))
    
    # Save to JSON file
    with open("flight_results.json", "w") as f:
        json.dump(result, f, indent=2)
    
    # Store in MongoDB
    if "error" not in result:
        search_id = store_to_mongodb(result)
        if search_id:
            print(f"\nMongoDB ID: {search_id}")
        else:
            print("\nMongoDB storage failed (check if MongoDB is running)")

if __name__ == "__main__":
    main()
