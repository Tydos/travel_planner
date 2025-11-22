from flask import Flask, request, jsonify
from flask_cors import CORS
from db import items

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return {"message": "Flask backend running"}


@app.route("/dummy")
def get_dummies():
    return {"id": "value"}
    
@app.route("/items", methods=["GET"])
def get_items():
    try:
        print(items)
        docs = list(items.find())
        data = []
        for doc in docs:
            doc_id = str(doc.pop("_id"))
            doc["id"] = doc_id
            data.append(doc)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/items2", methods=["POST"])
def add_item():
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "Missing JSON body"}), 400

        result = items.insert_one(payload)
        payload["id"] = str(result.inserted_id)
        return jsonify(payload), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
