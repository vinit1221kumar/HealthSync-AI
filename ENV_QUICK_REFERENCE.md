# Environment Configuration - Quick Reference

## 🚀 30-Second Setup

```bash
# 1. Copy .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp ai-service/.env.example ai-service/.env

# 2. Update values (optional - defaults work for localhost)
# Edit the .env files if needed

# 3. Start services (in separate terminals)
cd backend && npm start
cd frontend && npm run dev
cd ai-service && uvicorn app.main:app --reload --port 8000
```

---

## 📋 Essential Environment Variables

### Backend (.env)
```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/healthsync
JWT_SECRET=your_secret_key_minimum_32_characters
AI_SERVICE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env.local)  
```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_AI_URL=http://localhost:8000/api
```

### AI Service (.env)
```dotenv
PORT=8000
ENVIRONMENT=development
BACKEND_URL=http://localhost:5000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 📍 File Locations

| Service | Config File | Example File |
|---------|------------|-------------|
| Backend | `backend/.env` | `backend/.env.example` |
| Frontend | `frontend/.env.local` | `frontend/.env.example` |
| AI Service | `ai-service/.env` | `ai-service/.env.example` |

---

## 🔧 Where to Configure

### Different Databases
**backend/.env**
```dotenv
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/healthsync

# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/healthsync?retryWrites=true&w=majority
```

### Production Deployment
**backend/.env** (Production)
```dotenv
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/healthsync
JWT_SECRET=use_a_strong_randomly_generated_key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**frontend/.env.local** (Production)
```dotenv
VITE_API_URL=https://api.yourdomain.com/api
VITE_AI_URL=https://ai-api.yourdomain.com/api
```

---

## ⚠️ Important Notes

- **Never commit .env files** - They contain sensitive data
- **Use .env.example as template** - Copy and customize for your environment
- **Frontend uses .env.local** - Not .env (Vite convention)
- **Vite variables need VITE_ prefix** - `VITE_API_URL` not `API_URL`
- **JWT_SECRET must be strong** - Minimum 32 characters in production
- **CORS_ORIGINS must match** - Frontend domain in backend ALLOWED_ORIGINS

---

## 🔍 Troubleshooting

**Frontend can't connect to backend?**
1. Check `VITE_API_URL` in frontend/.env.local
2. Verify backend is running on port 5000
3. Check CORS: `ALLOWED_ORIGINS` in backend/.env includes frontend URL

**AI Service not responding?**
1. Verify `.env` file exists with PORT=8000
2. Check `VITE_AI_URL` in frontend/.env.local
3. Ensure Python environment is activated

**Database connection fails?**
1. Verify MongoDB is running (mongod)
2. Check `MONGODB_URI` format
3. For MongoDB Atlas: whitelist your IP address

---

## 📚 Full Documentation

See **ENV_SETUP.md** for comprehensive guide covering:
- Detailed setup instructions
- Production deployment checklist
- Security best practices
- Docker support
- Advanced configuration

---

## ✨ One-Liner Setups

**Quick development setup (Unix/Linux/Mac):**
```bash
for dir in backend ai-service; do cp $dir/.env.example $dir/.env; done && cp frontend/.env.example frontend/.env.local
```

**Verify all .env files exist:**
```bash
test -f backend/.env && test -f frontend/.env.local && test -f ai-service/.env && echo "✅ All .env files present" || echo "❌ Missing .env files"
```

---

**Need more details?** → See **ENV_SETUP.md**  
**Want to start?** → See **START.md**  
**Check what was changed?** → See **ENV_IMPLEMENTATION.md**
