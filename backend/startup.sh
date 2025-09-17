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
    
    # Create admin user only if INIT_ADMIN env var is set or we're in development
    if [ "$INIT_ADMIN" = "true" ] || [ "$ENV" = "development" ]; then
        echo "👤 Creating admin user (if needed)..."
        python create_admin.py
    else
        echo "⏭️ Skipping admin user creation (set INIT_ADMIN=true to force)"

    # Start the main application
    echo "🌟 Starting the FastAPI application..."
    uvicorn app.main:app --host 0.0.0.0 --port 8222 ${UVICORN_ARGS:-}
else
    echo "❌ Failed to connect to MongoDB. Exiting."
    exit 1
fi
