from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGO_URI")
dbname = os.getenv("DB_NAME", "sample_mflix")  # Default to sample_mflix if not set

# Create a new client and connect to the server
try:
    if not uri:
        print("ERROR: MONGO_URI is not set in environment variables")
        users_collection = None
    elif not dbname:
        print("ERROR: DB_NAME is not set in environment variables")
        users_collection = None
    else:
        client = MongoClient(uri, server_api=ServerApi('1'))
        client.admin.command('ping')
        print("✅ Pinged your deployment. You successfully connected to MongoDB!")
        
        # Access the main collection
        db = client[dbname]
        users_collection = db.users
        print(f"✅ Connected to database: {dbname}")
        print(f"✅ Using collection: {users_collection.name}")
except Exception as e:
    print(f"❌ MongoDB connection error: {e}")
    users_collection = None

