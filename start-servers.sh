#!/bin/bash

# Data_Bleed Server Startup Script
# This script starts both the FastAPI and Node.js servers for development

echo "🎮 Starting Data_Bleed Development Servers..."

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js and try again."
    exit 1
fi

# Install Python dependencies if needed
if [ ! -f ".venv/bin/activate" ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Install Node.js dependencies if needed
if [ ! -d "chroma-bot/node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    cd chroma-bot && npm install && cd ..
fi

# Function to start FastAPI server
start_fastapi() {
    echo "🐍 Starting FastAPI server on port 8001..."
    python main.py &
    FASTAPI_PID=$!
    echo "FastAPI PID: $FASTAPI_PID"
}

# Function to start Node.js server
start_nodejs() {
    echo "🟢 Starting Node.js Chroma Bot server on port 3001..."
    cd chroma-bot && npm start &
    NODEJS_PID=$!
    cd ..
    echo "Node.js PID: $NODEJS_PID"
}

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    if [ ! -z "$FASTAPI_PID" ]; then
        kill $FASTAPI_PID 2>/dev/null
        echo "FastAPI server stopped"
    fi
    if [ ! -z "$NODEJS_PID" ]; then
        kill $NODEJS_PID 2>/dev/null
        echo "Node.js server stopped"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start servers
start_fastapi
start_nodejs

echo ""
echo "🚀 Servers are starting up..."
echo "📍 FastAPI Server: http://localhost:8001"
echo "📍 Node.js Server: http://localhost:3001"
echo "🎮 Game Interface: http://localhost:8001/static/index.html"
echo "🧪 Trust Score Test: http://localhost:8001/static/test-trust-score-system.html"
echo "🤖 Adaptive AI Test: http://localhost:8001/static/test-adaptive-ai-system.html"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for servers to start
sleep 3

# Check if servers are running
echo "🔍 Checking server status..."

# Check FastAPI
if curl -s http://localhost:8001/api/health > /dev/null; then
    echo "✅ FastAPI server is running"
else
    echo "❌ FastAPI server failed to start"
fi

# Check Node.js
if curl -s http://localhost:3001/api/3d/capabilities > /dev/null; then
    echo "✅ Node.js server is running"
else
    echo "❌ Node.js server failed to start"
fi

echo ""
echo "🎯 Ready to test your advanced gaming mechanics!"
echo "   • Character-themed trust scores"
echo "   • Adaptive AI deception engine"
echo "   • Time pressure mechanics"
echo "   • Tactic escalation system"

# Keep script running
wait