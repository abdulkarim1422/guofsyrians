#!/usr/bin/env python3
"""
Script to wait for MongoDB to be ready before proceeding
"""

import time
import os
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

def wait_for_mongo(max_retries=30, retry_interval=2):
    """
    Wait for MongoDB to be available
    
    Args:
        max_retries (int): Maximum number of connection attempts
        retry_interval (int): Seconds to wait between attempts
    """
    mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
    
    print(f"Waiting for MongoDB at {mongodb_uri}...")
    
    for attempt in range(max_retries):
        try:
            # Try to connect to MongoDB
            client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
            # Try to get server info to verify connection
            client.admin.command('ping')
            print("✅ MongoDB is ready!")
            client.close()
            return True
            
        except ConnectionFailure as e:
            print(f"⏳ Attempt {attempt + 1}/{max_retries}: MongoDB not ready yet ({e})")
            if attempt < max_retries - 1:
                time.sleep(retry_interval)
            else:
                print("❌ Failed to connect to MongoDB after maximum retries")
                return False
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return False
    
    return False

if __name__ == "__main__":
    if not wait_for_mongo():
        print("Exiting due to MongoDB connection failure")
        sys.exit(1)
