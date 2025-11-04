@echo off
REM Data_Bleed Server Startup Script for Windows
REM This script starts both the FastAPI and Node.js servers for development

echo 🎮 Starting Data_Bleed Development Servers...

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js and try again.
    pause
    exit /b 1
)

REM Install Python dependencies if needed
if not exist "requirements.txt" (
    echo ❌ requirements.txt not found. Make sure you're in the correct directory.
    pause
    exit /b 1
)

echo 📦 Installing Python dependencies...
pip install -r requirements.txt

REM Install Node.js dependencies if needed
if not exist "chroma-bot\node_modules" (
    echo 📦 Installing Node.js dependencies...
    cd chroma-bot
    npm install
    cd ..
)

echo.
echo 🚀 Starting servers...
echo 📍 FastAPI Server: http://localhost:8001
echo 📍 Node.js Server: http://localhost:3001
echo 🎮 Game Interface: http://localhost:8001/static/index.html
echo 🧪 Trust Score Test: http://localhost:8001/static/test-trust-score-system.html
echo 🤖 Adaptive AI Test: http://localhost:8001/static/test-adaptive-ai-system.html
echo.

REM Start FastAPI server in background
echo 🐍 Starting FastAPI server...
start "FastAPI Server" python main.py

REM Wait a moment for FastAPI to start
timeout /t 3 /nobreak >nul

REM Start Node.js server in background
echo 🟢 Starting Node.js Chroma Bot server...
cd chroma-bot
start "Node.js Server" npm start
cd ..

echo.
echo 🎯 Servers are starting up...
echo    Both servers will open in separate windows
echo    Close those windows to stop the servers
echo.
echo 🎯 Ready to test your advanced gaming mechanics!
echo    • Character-themed trust scores
echo    • Adaptive AI deception engine  
echo    • Time pressure mechanics
echo    • Tactic escalation system
echo.

pause