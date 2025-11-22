from flask import Flask, request, jsonify
from flask_cors import CORS
from db import dbname,users_collection
from bson.objectid import ObjectId
from bson.json_util import dumps
app = Flask(__name__)
CORS(app)
print(f"Connected to DB: {dbname}")
print(f"Available collections: {users_collection.name}")

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
    pass

if __name__ == "__main__":
    app.run(port=5000, debug=True)
