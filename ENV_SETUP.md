# Environment Configuration Guide

## Overview
This project uses environment variables for configuration management. Each service has its own `.env` file that should be created from the provided `.env.example` files.

---

## Backend Setup

### 1. Create .env file
```bash
cd backend
cp .env.example .env
```

### 2. Configure values in `.env`

```dotenv
# Server Configuration
PORT=5000                          # Backend server port
NODE_ENV=development               # Options: development, production, staging

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/healthsync
# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthsync?retryWrites=true&w=majority

# JWT Authentication (IMPORTANT: Change in production!)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d                      # Token expiration (e.g., 7d, 24h)

# External Services
AI_SERVICE_URL=http://localhost:8000

# CORS - Allowed Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
# For production: https://yourdomain.com,https://www.yourdomain.com
```

### 3. Important Notes for Backend
- **JWT_SECRET**: Must be at least 32 characters long in production. Use a strong random string.
- **MONGODB_URI**: Update for your database. Use MongoDB Atlas for cloud hosting.
- **ALLOWED_ORIGINS**: Add all frontend URLs. Separate multiple origins with commas.
- **NODE_ENV**: Set to `production` when deploying to avoid debug logging.

---

## Frontend Setup

### 1. Create .env.local file
```bash
cd frontend
cp .env.example .env.local
```

### 2. Configure values in `.env.local`

```dotenv
# API Configuration
VITE_API_URL=http://localhost:5000/api        # Backend API endpoint
VITE_AI_URL=http://localhost:8000/api         # AI service endpoint

# Application Configuration
VITE_APP_NAME=HealthSync AI                   # App name (for display)
VITE_APP_VERSION=1.0.0                        # Current version

# Development Settings
VITE_DEBUG=false                              # Enable/disable debug logging
```

### 3. Important Notes for Frontend
- **Vite uses .env.local for local development**, not .env
- **VITE_ prefix required**: All variables must start with `VITE_` to be accessible
- **Update API URLs**: Change to production URLs when deploying
- Example production URLs:
  ```
  VITE_API_URL=https://api.yourdomain.com/api
  VITE_AI_URL=https://ai-api.yourdomain.com/api
  ```

---

## AI Service Setup

### 1. Create .env file
```bash
cd ai-service
cp .env.example .env
```

### 2. Configure values in `.env`

```dotenv
# Server Configuration
PORT=8000                                      # AI service port
ENVIRONMENT=development                       # Options: development, production, testing

# Backend API URL (for future direct communication)
BACKEND_URL=http://localhost:5000

# CORS Configuration (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
# For production: https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=info                                 # Options: debug, info, warning, error
```

### 3. Important Notes for AI Service
- **ENVIRONMENT**: Controls CORS strictness. In production, uses specific origins instead of allowing all.
- **CORS_ORIGINS**: Production environments will enforce these origins only.
- **LOG_LEVEL**: Set to `warning` or `error` in production for cleaner logs.

---

## Quick Start (All Services)

### 1. Setup all .env files
```bash
# Backend
cd backend
cp .env.example .env

# Frontend  
cd frontend
cp .env.example .env.local

# AI Service
cd ai-service
cp .env.example .env
```

### 2. Update values as needed (local development defaults work for localhost)

### 3. Start all services
```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: AI Service
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Production Deployment Checklist

### Backend (.env)
- [ ] Change `NODE_ENV=production`
- [ ] Use strong, unique `JWT_SECRET` (minimum 32 characters)
- [ ] Update `MONGODB_URI` to production database
- [ ] Set `ALLOWED_ORIGINS` to production domain(s) only
- [ ] Update `AI_SERVICE_URL` to production AI service
- [ ] Use HTTPS URLs where applicable
- [ ] Store `.env` securely (never commit to git)

### Frontend (.env.local → .env.production)
- [ ] Create `.env.production` with production URLs
- [ ] Set `VITE_API_URL=https://api.yourdomain.com/api`
- [ ] Set `VITE_AI_URL=https://ai-api.yourdomain.com/api`
- [ ] Set `VITE_DEBUG=false`
- [ ] Ensure backend API is accessible from production domain

### AI Service (.env)
- [ ] Change `ENVIRONMENT=production`
- [ ] Update `BACKEND_URL` to production backend
- [ ] Set `CORS_ORIGINS` to production frontend domain(s)
- [ ] Set `LOG_LEVEL=warning` or `error`
- [ ] Store `.env` securely (never commit to git)

---

## Environment Variables Reference

### Backend Variables
| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| PORT | 5000 | No | Backend server port |
| NODE_ENV | development | No | Set to production for deployment |
| MONGODB_URI | mongodb://localhost:27017/healthsync | Yes | Database connection string |
| JWT_SECRET | abc123xyz... (32+ chars) | Yes | Secret key for JWT signing |
| JWT_EXPIRE | 7d | No | Token expiration period |
| AI_SERVICE_URL | http://localhost:8000 | No | AI service endpoint |
| ALLOWED_ORIGINS | http://localhost:5173 | No | CORS allowed origins |

### Frontend Variables
| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| VITE_API_URL | http://localhost:5000/api | No | Backend API endpoint |
| VITE_AI_URL | http://localhost:8000/api | No | AI service endpoint |
| VITE_APP_NAME | HealthSync AI | No | Application name |
| VITE_APP_VERSION | 1.0.0 | No | Current version |
| VITE_DEBUG | false | No | Debug mode flag |

### AI Service Variables
| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| PORT | 8000 | No | AI service port |
| ENVIRONMENT | development | No | Environment type |
| BACKEND_URL | http://localhost:5000 | No | Backend URL |
| CORS_ORIGINS | http://localhost:5173 | No | Allowed CORS origins |
| LOG_LEVEL | info | No | Logging level |

---

## Troubleshooting

### Frontend not connecting to API
1. Check `VITE_API_URL` in `.env.local`
2. Verify backend is running on the specified port
3. Check browser console for CORS errors
4. Ensure `ALLOWED_ORIGINS` in backend includes frontend URL

### AI Service not responding
1. Verify `.env` exists and PORT is correct
2. Check `VITE_AI_URL` in frontend `.env.local`
3. Verify Python virtual environment is activated
4. Check `CORS_ORIGINS` includes frontend URL

### Database connection errors
1. Verify MongoDB is running (local or Atlas)
2. Check `MONGODB_URI` is correct and accessible
3. For MongoDB Atlas: whitelist IP address in cluster settings
4. Test connection with `mongosh` or MongoDB Compass

### JWT Authentication failures
1. Verify `JWT_SECRET` is set and consistent across restarts
2. Check token expiration time (`JWT_EXPIRE`)
3. Ensure token is being sent in `Authorization: Bearer <token>` header

---

## Security Best Practices

1. **Never commit .env files** - Always use `.env.example` as template
2. **Use strong secrets** - Generate with `openssl rand -hex 32`
3. **Rotate secrets regularly** - Especially in production
4. **Use HTTPS in production** - All URLs should be https://
5. **Limit CORS origins** - Never use `*` in production
6. **Environment-specific configs** - Use separate .env files for dev/prod
7. **Secrets management** - Use AWS Secrets Manager, HashiCorp Vault, etc. for sensitive values

---

## Docker Support

When running with Docker, environment variables can be passed via:

```bash
# Using --env flag
docker run -e PORT=5000 -e MONGODB_URI=mongodb://db:27017 healthsync-backend

# Using --env-file
docker run --env-file .env healthsync-backend

# Using docker-compose
# Set variables in docker-compose.yml or use .env file automatically
```

---

**Last Updated**: January 27, 2026
