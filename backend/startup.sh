#!/bin/bash

# Startup script for the backend service
# This script waits for MongoDB and then sets up the application

set -e

echo "🚀 Starting GuofSyrians Backend..."

# Wait for MongoDB to be ready
echo "📡 Checking MongoDB connection..."
python wait-for-mongo.py

if [ $? -eq 0 ]; then
    echo "✅ MongoDB is ready!"
    
    # Create admin user
    echo "👤 Creating admin user..."
    python create_admin.py
    
    # Check if we're in development mode and populate dummy data
    if [ "$ENV" = "development" ]; then
        echo "🔧 Development mode detected - populating dummy data..."
        if [ -f "populate_dummy_members.py" ]; then
            python populate_dummy_members.py
        fi
    fi
    
    # Start the main application
    echo "🌟 Starting the FastAPI application..."
    uvicorn app.main:app --host 0.0.0.0 --port 8222 ${UVICORN_ARGS:-}
else
    echo "❌ Failed to connect to MongoDB. Exiting."
    exit 1
fi
