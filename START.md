#!/bin/bash

# HealthSync AI - Complete Project Startup Guide
# Run this script to start all services

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║          🏥 HealthSync AI - Project Startup Guide                  ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Prerequisites Check:${NC}"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js ${NODE_VERSION}"
else
    echo -e "${RED}✗${NC} Node.js not found - Please install Node.js 16+"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} ${PYTHON_VERSION}"
else
    echo -e "${RED}✗${NC} Python3 not found - Please install Python 3.11+"
    exit 1
fi

# Check MongoDB
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB found"
else
    echo -e "${YELLOW}⚠${NC} MongoDB not found - Using MongoDB Atlas or ensure mongod is running"
fi

echo ""
echo -e "${BLUE}Quick Start - Open 3 Terminal Windows:${NC}"
echo ""
echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│ Terminal 1: Backend (Node.js + Express)                        │"
echo "├─────────────────────────────────────────────────────────────────┤"
echo "│ cd backend                                                      │"
echo "│ npm install                                                     │"
echo "│ npm start                                                       │"
echo "│ → Runs on http://localhost:5000                               │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│ Terminal 2: Frontend (React + Vite)                            │"
echo "├─────────────────────────────────────────────────────────────────┤"
echo "│ cd frontend                                                     │"
echo "│ npm install                                                     │"
echo "│ npm run dev                                                     │"
echo "│ → Runs on http://localhost:5173                               │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│ Terminal 3: AI Service (Python + FastAPI)                      │"
echo "├─────────────────────────────────────────────────────────────────┤"
echo "│ cd ai-service                                                   │"
echo "│ python3 -m venv venv                                            │"
echo "│ source venv/bin/activate     # On Windows: venv\Scripts\activate│"
echo "│ pip install -r requirements.txt                                 │"
echo "│ uvicorn app.main:app --reload --port 8000                       │"
echo "│ → Runs on http://localhost:8000                               │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo -e "${BLUE}Setup Steps:${NC}"
echo ""
echo "1. ${YELLOW}Create Environment Files${NC}"
echo "   backend/.env (copy from .env.example and configure)"
echo "   frontend/.env.local (copy from .env.example)"
echo "   ai-service/.env (copy from .env.example)"
echo ""
echo "   Command: See ENV_SETUP.md for detailed configuration guide"
echo ""
echo "2. ${YELLOW}Start MongoDB${NC}"
echo "   mongod"
echo ""
echo "3. ${YELLOW}Seed Database with Sample Data${NC}"
echo "   cd backend && npm run seed"
echo ""
echo "4. ${YELLOW}Open http://localhost:5173${NC}"
echo "   Sign up or login"
echo "   Explore dashboard, workouts, meals, pose detection"
echo ""
echo -e "${BLUE}API Endpoints:${NC}"
echo ""
echo "Backend (http://localhost:5000):"
echo "  POST   /api/auth/signup"
echo "  POST   /api/auth/login"
echo "  GET    /api/workouts/plans"
echo "  GET    /api/meals/plans"
echo "  POST   /api/pose/session/start"
echo ""
echo "AI Service (http://localhost:8000):"
echo "  POST   /api/analyze"
echo "  POST   /api/workouts/recommend"
echo "  POST   /api/meals/plan"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo ""
echo "Backend:"
echo "  npm test              # Run tests"
echo "  npm run build         # Build for production"
echo "  node seed.js          # Seed sample data"
echo ""
echo "Frontend:"
echo "  npm run build         # Build bundle"
echo "  npm run preview       # Preview production build"
echo ""
echo "AI Service:"
echo "  python -m pip freeze  # Check installed packages"
echo "  deactivate            # Deactivate virtual environment"
echo ""
echo -e "${GREEN}✨ Ready to start developing!${NC}"
echo ""
