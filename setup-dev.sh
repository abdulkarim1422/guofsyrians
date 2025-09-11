#!/bin/bash
echo "====================================================="
echo "   Training Employment Platform - Development Setup"
echo "====================================================="
echo

echo "[1/5] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

echo
echo "[2/5] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo
echo "[3/5] Installing backend dependencies..."
cd ../backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo
echo "[4/5] Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not running"
    echo "Please install Docker and start it before running the project"
    exit 1
fi

echo
echo "[5/5] Setting up MongoDB container..."
cd ..
docker-compose up -d db
if [ $? -ne 0 ]; then
    echo "❌ Failed to start MongoDB container"
    exit 1
fi

echo
echo "✅ Setup complete! You can now run the project with:"
echo "   npm run dev"
echo
