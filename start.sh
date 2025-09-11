#!/bin/bash
# Startup script for Training Employment Platform

echo "🚀 Starting Training Employment Platform..."
echo "======================================"

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Start MongoDB via Docker Compose
echo "📦 Starting MongoDB database..."
cd "$(dirname "$0")"
docker-compose up -d db

if [ $? -eq 0 ]; then
    echo "✅ MongoDB started successfully"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 3

# Start Backend Server
echo "🔧 Starting FastAPI backend server..."
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8222 &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend started successfully
if check_port 8222; then
    echo "✅ Backend server started on http://localhost:8222"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start Frontend Development Server
echo "🎨 Starting Vite frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 3

# Check if frontend started successfully
if check_port 5173 || check_port 5174; then
    echo "✅ Frontend server started"
    if check_port 5173; then
        echo "🌐 Frontend available at: http://localhost:5173"
    else
        echo "🌐 Frontend available at: http://localhost:5174"
    fi
else
    echo "❌ Frontend server failed to start"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Training Employment Platform is now running!"
echo "======================================"
echo "Frontend: http://localhost:5173 or http://localhost:5174"
echo "Backend API: http://localhost:8222"
echo "API Documentation: http://localhost:8222/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interruption
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker-compose stop db; echo "✅ All services stopped"; exit 0' INT

# Keep script running
wait
