@echo off
REM HealthSync AI - Windows Setup Verification & Startup
REM Run this script to verify setup and start all services

cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║          🏥 HealthSync AI - Windows Setup & Startup               ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

echo Checking prerequisites...
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js %NODE_VERSION%
) else (
    echo [ERROR] Node.js not found - Install Node.js 16+
    pause
    exit /b 1
)

REM Check Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version') do set PY_VERSION=%%i
    echo [OK] %PY_VERSION%
) else (
    echo [ERROR] Python not found - Install Python 3.11+
    pause
    exit /b 1
)

REM Check MongoDB
where mongod >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB found
) else (
    echo [WARN] MongoDB not found - Ensure MongoDB service is running or use Atlas
)

echo.
echo ════════════════════════════════════════════════════════════════════
echo Project Structure:
echo ════════════════════════════════════════════════════════════════════
echo.
echo Backend:          z:\HealthSync-AI\backend
echo Frontend:         z:\HealthSync-AI\frontend
echo AI Service:       z:\HealthSync-AI\ai-service
echo.

echo ════════════════════════════════════════════════════════════════════
echo QUICK START - OPTION 1: Auto-start all services (requires 3 windows)
echo ════════════════════════════════════════════════════════════════════
echo.
echo Open 3 Command Prompts and run:
echo.
echo [Window 1] cd backend ^&^& npm start
echo [Window 2] cd frontend ^&^& npm run dev
echo [Window 3] cd ai-service ^&^& python -m venv venv ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt ^&^& uvicorn app.main:app --reload
echo.

echo ════════════════════════════════════════════════════════════════════
echo Setup Instructions:
echo ════════════════════════════════════════════════════════════════════
echo.
echo 1. Start MongoDB:
echo    Press Windows key, search "Services", find "MongoDB" and start it
echo    OR run: mongod
echo.
echo 2. Install Backend Dependencies:
echo    cd backend
echo    npm install
echo.
echo 3. Seed Database (optional - loads sample data):
echo    cd backend
echo    node seed.js
echo.
echo 4. Install Frontend Dependencies:
echo    cd frontend
echo    npm install
echo.
echo 5. Install AI Service Dependencies:
echo    cd ai-service
echo    python -m venv venv
echo    venv\Scripts\activate
echo    pip install -r requirements.txt
echo.

echo ════════════════════════════════════════════════════════════════════
echo Available Services:
echo ════════════════════════════════════════════════════════════════════
echo.
echo Backend API:      http://localhost:5000
echo Frontend App:     http://localhost:5173
echo AI Service:       http://localhost:8000
echo.

echo ════════════════════════════════════════════════════════════════════
echo Useful Commands:
echo ════════════════════════════════════════════════════════════════════
echo.
echo Backend:
echo   npm start       - Start server
echo   npm run dev     - Start with hot reload
echo   npm test        - Run tests
echo   node seed.js    - Load sample data
echo.
echo Frontend:
echo   npm run dev     - Start dev server
echo   npm run build   - Build for production
echo.
echo AI Service:
echo   python -m pip freeze     - Check packages
echo   deactivate               - Exit virtual environment
echo.

echo.
echo ════════════════════════════════════════════════════════════════════
echo Documentation:
echo ════════════════════════════════════════════════════════════════════
echo.
echo README.md           - Main documentation
echo START.md            - Startup guide
echo API_TESTING.json    - API endpoints for testing
echo.

echo [INFO] Review START.md for detailed startup instructions
echo.
pause
