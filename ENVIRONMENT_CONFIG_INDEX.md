# HealthSync AI - Configuration & Setup Index

## 🎯 Where to Start?

Choose based on your situation:

### 👤 First Time Setup?
→ **[ENV_QUICK_REFERENCE.md](ENV_QUICK_REFERENCE.md)** (5 min read)
- Quick 30-second setup
- Essential variables
- Common troubleshooting

### 📖 Need Complete Guide?
→ **[ENV_SETUP.md](ENV_SETUP.md)** (20 min read)
- Detailed configuration for each service
- Production deployment checklist
- Security best practices
- Docker support

### 🚀 Ready to Launch?
→ **[START.md](START.md)** (Terminal guide)
- Prerequisites check
- 3-terminal startup
- API endpoints overview

### 🔧 What Changed?
→ **[ENV_IMPLEMENTATION.md](ENV_IMPLEMENTATION.md)** (Reference)
- All files modified/created
- Code changes explained
- Implementation summary

---

## 📂 Environment Files by Service

### Backend Service
| File | Purpose | Action |
|------|---------|--------|
| `backend/.env.example` | Configuration template | Copy to `.env` |
| `backend/.env` | **Create this** | Run: `cp .env.example .env` |
| `backend/src/config/config.js` | Load environment variables | ✅ Already updated |

**Key Variables:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/healthsync
JWT_SECRET=your_secret_32_chars_minimum
```

### Frontend Service
| File | Purpose | Action |
|------|---------|--------|
| `frontend/.env.example` | Configuration template | Copy to `.env.local` |
| `frontend/.env.local` | **Create this** | Run: `cp .env.example .env.local` |
| `frontend/src/services/api.js` | Use environment variables | ✅ Already updated for Vite |

**Key Variables:**
```
VITE_API_URL=http://localhost:5000/api
VITE_AI_URL=http://localhost:8000/api
```

### AI Service
| File | Purpose | Action |
|------|---------|--------|
| `ai-service/.env.example` | Configuration template | Copy to `.env` |
| `ai-service/.env` | **Create this** | Run: `cp .env.example .env` |
| `ai-service/app/main.py` | Load environment variables | ✅ Already updated |

**Key Variables:**
```
PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## ⚡ Quick Start Commands

### Setup All Services (One-Liner)
```bash
# Unix/Linux/Mac
for dir in backend ai-service; do cp $dir/.env.example $dir/.env; done && cp frontend/.env.example frontend/.env.local

# Windows PowerShell
Copy-Item backend\.env.example backend\.env; Copy-Item frontend\.env.example frontend\.env.local; Copy-Item ai-service\.env.example ai-service\.env
```

### Verify All .env Files
```bash
test -f backend/.env && test -f frontend/.env.local && test -f ai-service/.env && echo "✅ All ready!" || echo "❌ Missing files"
```

### Start Services (3 Terminals)
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev

# Terminal 3
cd ai-service && uvicorn app.main:app --reload
```

---

## 📋 Configuration Checklist

### Initial Setup
- [ ] Copy `backend/.env.example` → `backend/.env`
- [ ] Copy `frontend/.env.example` → `frontend/.env.local`
- [ ] Copy `ai-service/.env.example` → `ai-service/.env`
- [ ] Verify MongoDB is accessible
- [ ] Run `npm install` in backend and frontend
- [ ] Create Python venv in ai-service

### Verify Configuration
- [ ] Backend environment variables loaded (check config.js)
- [ ] Frontend API URL correct (check api.js)
- [ ] AI Service CORS origins set
- [ ] JWT_SECRET is strong (>32 chars)
- [ ] Database connection works

### Pre-Launch
- [ ] MongoDB running (mongod)
- [ ] All .env files created
- [ ] Dependencies installed
- [ ] Python environment activated
- [ ] No port conflicts (5000, 5173, 8000)

---

## 🔐 Environment-Specific Values

### Local Development (Default)
```dotenv
# backend/.env
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ai-service/.env
ENVIRONMENT=development
```

### Production
```dotenv
# backend/.env
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
JWT_SECRET=generate_strong_random_key_32_chars

# frontend/.env.production
VITE_API_URL=https://api.yourdomain.com/api

# ai-service/.env
ENVIRONMENT=production
CORS_ORIGINS=https://yourdomain.com
```

---

## 🆘 Common Issues & Solutions

### "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### "Port already in use"
- Backend: `PORT=5000` conflict → Change PORT in backend/.env
- Frontend: `5173` conflict → Vite will auto-assign if unavailable
- AI Service: `PORT=8000` conflict → Change PORT in ai-service/.env

### "CORS error - blocked by CORS policy"
1. Check frontend URL in `ALLOWED_ORIGINS` (backend)
2. Check backend URL in `VITE_API_URL` (frontend)
3. Verify protocol (http:// or https://)
4. Verify port numbers match

### "Cannot connect to MongoDB"
1. Ensure MongoDB is running: `mongod`
2. Check `MONGODB_URI` format in backend/.env
3. For Atlas: Whitelist IP in cluster settings
4. Test with `mongosh` or MongoDB Compass

---

## 📚 Documentation Map

```
Project Root/
├── ENV_QUICK_REFERENCE.md ............ ⭐ START HERE (5 min)
├── ENV_SETUP.md ..................... Complete guide (20 min)
├── ENV_IMPLEMENTATION.md ............ What changed (Reference)
├── START.md ......................... Launch guide
│
├── backend/
│   ├── .env.example ................. Configuration template
│   ├── .env ......................... (Create from .env.example)
│   └── README.md
│
├── frontend/
│   ├── .env.example ................. Configuration template
│   ├── .env.local ................... (Create from .env.example)
│   └── README.md
│
└── ai-service/
    ├── .env.example ................. Configuration template
    ├── .env ......................... (Create from .env.example)
    └── README.md
```

---

## ✨ Key Improvements

✅ **No Hardcoded Values** - All configuration via environment variables  
✅ **Security** - .env files in .gitignore, never committed  
✅ **Flexibility** - Same code for dev/staging/production  
✅ **Templates** - .env.example files show all options  
✅ **Validation** - Backend validates required variables  
✅ **Documentation** - Comprehensive guides for each service  
✅ **Best Practices** - Industry-standard configuration patterns  

---

## 🎯 Next Actions

1. **Read** → [ENV_QUICK_REFERENCE.md](ENV_QUICK_REFERENCE.md) (5 min)
2. **Copy** → `.env.example` files to `.env/.env.local`
3. **Update** → Values specific to your environment (optional)
4. **Launch** → Follow [START.md](START.md)
5. **Reference** → [ENV_SETUP.md](ENV_SETUP.md) for advanced config

---

## 📞 Quick Links

| Document | Purpose | Time |
|----------|---------|------|
| [ENV_QUICK_REFERENCE.md](ENV_QUICK_REFERENCE.md) | Fast setup guide | 5 min |
| [ENV_SETUP.md](ENV_SETUP.md) | Detailed configuration | 20 min |
| [ENV_IMPLEMENTATION.md](ENV_IMPLEMENTATION.md) | What was changed | Reference |
| [START.md](START.md) | Launch all services | 10 min |
| [README.md](README.md) | Project overview | 15 min |

---

**Status**: ✅ Environment configuration complete and production-ready  
**Updated**: January 27, 2026
