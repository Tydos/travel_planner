from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from db import users_collection
import jwt
from datetime import datetime, timedelta

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'your-secret-key-change-this')

def verify_google_token(token):
    """Verify Google ID token and return user info"""
    try:
        if not GOOGLE_CLIENT_ID:
            print("ERROR: GOOGLE_CLIENT_ID is not set in environment variables")
            return None
        
        print(f"Verifying token with Client ID: {GOOGLE_CLIENT_ID[:20]}...")
        
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # Check if token is from the correct issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            print(f"ERROR: Wrong issuer: {idinfo['iss']}")
            raise ValueError('Wrong issuer.')
        
        print(f"Token verified successfully for: {idinfo.get('email')}")
        
        return {
            'google_id': idinfo['sub'],
            'email': idinfo['email'],
            'name': idinfo.get('name', ''),
            'picture': idinfo.get('picture', ''),
            'email_verified': idinfo.get('email_verified', False)
        }
    except ValueError as e:
        print(f"Token verification failed: {e}")
        import traceback
        traceback.print_exc()
        return None
    except Exception as e:
        print(f"Unexpected error verifying token: {e}")
        import traceback
        traceback.print_exc()
        return None

def create_jwt_token(user_data):
    """Create JWT token for session management"""
    payload = {
        'google_id': user_data['google_id'],
        'email': user_data['email'],
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def save_or_update_user(user_data):
    """Save or update user in MongoDB"""
    try:
        user_doc = {
            'google_id': user_data['google_id'],
            'email': user_data['email'],
            'name': user_data['name'],
            'picture': user_data.get('picture', ''),
            'email_verified': user_data.get('email_verified', False),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        # Update or insert user
        result = users_collection.update_one(
            {'google_id': user_data['google_id']},
            {
                '$set': {
                    **user_doc,
                    'updated_at': datetime.utcnow().isoformat()
                },
                '$setOnInsert': {
                    'created_at': datetime.utcnow().isoformat()
                }
            },
            upsert=True
        )
        
        return user_doc
    except Exception as e:
        print(f"Error saving user: {e}")
        return None

