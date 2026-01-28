# HealthSync AI 🏥

**AI-Powered Personal Health Monitoring & Recommendation Platform**

A full-stack health monitoring application that tracks daily health metrics, calculates personalized health scores, and provides AI-generated recommendations using machine learning.

---

## 🚀 Tech Stack

### Frontend
- **React 18** with **Vite** - Fast, modern frontend
- **Tailwind CSS** - Styling
- **Chart.js / Recharts** - Data visualization
- **Axios** - API communication
- **React Router** - Client-side routing

### Backend
- **Node.js & Express.js** - REST API
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### AI Service
- **Python 3.11** - Core language
- **FastAPI** - Microservice framework
- **NumPy** - Data analysis
- **Rule-based ML** - Health scoring algorithm

### DevOps
- **Docker & Docker Compose** - Containerization
- **Git** - Version control

---

## 📋 Features

✅ **User Authentication**
- Secure signup/login with JWT
- Password hashing with bcrypt
- Protected routes

✅ **Health Data Tracking**
- Daily steps, sleep hours, water intake
- Calorie tracking and mood logging
- Historical data with date-based queries

✅ **AI-Powered Analysis**
- Health score calculation (0-100)
- Personalized recommendations
- Trend analysis over time

✅ **Dashboard & Analytics**
- Visual charts and graphs
- Weekly/monthly statistics
- Progress tracking

✅ **Microservices Architecture**
- Separate backend and AI service
- RESTful API design
- Scalable and maintainable

---

## 📁 Project Structure

```
HealthSync-AI/
├── backend/                    # Express.js Backend API
│   ├── src/
│   │   ├── config/            # Database & app configuration
│   │   ├── models/            # Mongoose schemas
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── middlewares/       # Auth & error handling
│   │   ├── utils/             # Helper functions
│   │   └── server.js          # Entry point
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── ai-service/                # FastAPI AI Microservice
│   ├── app/
│   │   ├── services/         # Health analysis logic
│   │   └── main.py           # FastAPI app
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                  # React + Vite Frontend (Coming soon)
│   └── ...
│
├── docker-compose.yml         # Docker orchestration
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.11+)
- **MongoDB** (v7.0+)
- **Docker & Docker Compose** (optional)

---

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd HealthSync-AI
```

2. **Create environment files**
```bash
# Backend
cp backend/.env.example backend/.env

# AI Service
cp ai-service/.env.example ai-service/.env
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Access the services**
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000
- MongoDB: localhost:27017

---

### Option 2: Manual Setup

#### 1. MongoDB Setup
```bash
# Install MongoDB locally or use MongoDB Atlas
# Connection string: mongodb://localhost:27017/healthsync
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/healthsync
# JWT_SECRET=your_secret_key

# Start development server
npm run dev
```

#### 3. AI Service Setup
```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

---

## 📡 API Documentation

### Base URLs
- Backend: `http://localhost:5000/api`
- AI Service: `http://localhost:8000/api`

### Authentication Endpoints

#### 1. Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "age": 25,
  "gender": "male",
  "height": 175,
  "weight": 70
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Health Data Endpoints

#### 1. Create/Update Health Data
```http
POST /api/health
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2026-01-27",
  "steps": 8500,
  "sleepHours": 7.5,
  "waterIntake": 2.5,
  "calories": 2000,
  "mood": "good",
  "notes": "Felt energetic today"
}
```

#### 2. Get Health Data
```http
GET /api/health?startDate=2026-01-20&endDate=2026-01-27&limit=30
Authorization: Bearer <token>
```

#### 3. Get Health Stats
```http
GET /api/health/stats/summary?days=7
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "avgSteps": 8234,
      "avgSleep": "7.5",
      "avgWater": "2.3",
      "avgCalories": 1950,
      "totalDays": 7
    }
  }
}
```

---

### AI Analysis Endpoints

#### 1. Generate Health Analysis
```http
POST /api/ai/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "days": 7
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report": {
      "healthScore": 78,
      "recommendations": [
        {
          "category": "exercise",
          "priority": "medium",
          "suggestion": "Increase daily steps to 10000..."
        }
      ],
      "insights": "Good work! You're on the right track..."
    }
  }
}
```

#### 2. Get Latest Report
```http
GET /api/ai/latest
Authorization: Bearer <token>
```

---

## 🧪 Testing APIs

### Using cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Create health data (replace TOKEN)
curl -X POST http://localhost:5000/api/health \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"steps":10000,"sleepHours":8,"waterIntake":3,"mood":"excellent"}'
```

### Using Postman/Thunder Client

1. Import the API collection (create one with above endpoints)
2. Set Authorization header: `Bearer <your_jwt_token>`
3. Test all endpoints sequentially

---

## 🎯 Health Score Algorithm

The AI service calculates health scores using weighted metrics:

| Metric | Weight | Optimal Range |
|--------|--------|---------------|
| Steps | 25% | 8,000-15,000 |
| Sleep | 30% | 7-9 hours |
| Water | 20% | 2-4 liters |
| Calories | 15% | 1,500-2,500 |
| Mood | 10% | excellent/good |

**Score Ranges:**
- 85-100: Excellent health habits
- 70-84: Good progress
- 55-69: Needs improvement
- 0-54: Requires attention

---

## 🔐 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Protected routes with authentication middleware
- Input validation with express-validator
- CORS configuration for security
- MongoDB injection prevention

---

## 📊 Future Enhancements

- [ ] Frontend dashboard with React + Vite
- [ ] Real-time notifications
- [ ] Social features (friend challenges)
- [ ] Integration with fitness devices
- [ ] Advanced ML models (scikit-learn, TensorFlow)
- [ ] Data export (PDF reports)
- [ ] Mobile app (React Native)

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Ensure MongoDB is running
# Docker: docker-compose up mongodb
# Local: mongod --dbpath /path/to/data
```

### Port Already in Use
```bash
# Kill process on port
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -ti:5000 | xargs kill -9
```

### AI Service Not Responding
```bash
# Check if AI service is running
curl http://localhost:8000/health

# Check logs
docker-compose logs ai-service
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername]
- LinkedIn: [Your LinkedIn]
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Inspired by modern health-tech applications
- Built with industry-standard tools and practices
- Designed for learning and portfolio purposes

---

## 📞 Support

For issues or questions:
1. Open an issue on GitHub
2. Email: support@healthsync-ai.com
3. Documentation: [Wiki](#)

---

**⭐ If you find this project helpful, please give it a star!**
