
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGO_URI")
dbname = os.getenv("DB_NAME")

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Access the main collection for travel plans
db = client[dbname]
users_collection = db.users 
cities_collection = db.cities
trips_collection = db.trips
