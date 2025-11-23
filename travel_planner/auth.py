from google.oauth2 import id_token
from google.auth.transport import requests
import os
from db import users_collection
from datetime import datetime

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

def verify_google_token(token):
    """Verify Google ID token and return user info"""
    try:
        if not token or not GOOGLE_CLIENT_ID:
            return None
        
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # Check issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return None
        
        return {
            'google_id': idinfo['sub'],
            'name': idinfo.get('name', ''),
            'email': idinfo.get('email', '')
        }
    except Exception as e:
        print(f"Token verification error: {e}")
        return None

def save_or_update_user(user_data):
    """Save user to MongoDB - only name and google_id"""
    try:
        if users_collection is None:
            print("ERROR: users_collection is None - MongoDB not connected")
            return None
        
        user_doc = {
            'google_id': user_data['google_id'],
            'name': user_data.get('name', ''),
            'email': user_data.get('email', ''),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        print(f"Attempting to save user to MongoDB...")
        print(f"User data: {user_doc}")
        
        # Update or insert user
        result = users_collection.update_one(
            {'google_id': user_data['google_id']},
            {
                '$set': {
                    'name': user_doc['name'],
                    'email': user_doc['email'],
                    'updated_at': datetime.utcnow().isoformat()
                },
                '$setOnInsert': {
                    'google_id': user_doc['google_id'],
                    'created_at': datetime.utcnow().isoformat()
                }
            },
            upsert=True
        )
        
        print(f"MongoDB update result: matched={result.matched_count}, modified={result.modified_count}, upserted={result.upserted_id}")
        
        if result.upserted_id or result.matched_count > 0:
            print(f"✅ User saved successfully!")
            return user_doc
        else:
            print("⚠️ User save operation completed but no changes detected")
            return user_doc
            
    except Exception as e:
        print(f"❌ Error saving user: {e}")
        import traceback
        traceback.print_exc()
        return None
