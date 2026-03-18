# 🐳 Intellica Project - Docker & Coolify Deployment

## 📦 Complete Docker Setup for Single Repository Deployment

This project is fully configured for containerized deployment with:
- ✅ **Curl included** in Docker image
- ✅ **Single repository** (backend serves frontend)
- ✅ **Multi-stage build** (optimized image size)
- ✅ **Health checks** (automatic monitoring)
- ✅ **Security headers** (production-ready)
- ✅ **Signal handling** (graceful shutdowns)
- ✅ **Persistent volumes** (for uploads)

---

## 🎯 Quick Start

### Local Testing

```bash
# 1. Build the Docker image
bash build-docker.sh          # Linux/Mac
build-docker.bat              # Windows

# 2. Start with Docker Compose
docker-compose up --build

# 3. Test the application
# Frontend: http://localhost:5000
# API: curl http://localhost:5000/api/health

# 4. Stop containers
docker-compose down
```

### Deploy to Coolify

```bash
# 1. Push code to Git
git add .
git commit -m "Deploy: Ready for Coolify"
git push origin main

# 2. In Coolify Dashboard:
# - Create New Application (Docker Compose)
# - Connect your Git repository
# - Set environment variables (MONGO_URI, etc.)
# - Click Deploy

# ✅ Done! Your app is live
```

---

## 📋 Files Included

### Core Docker Files
| File | Purpose |
|------|---------|
| **Dockerfile** | Multi-stage build: Frontend → Backend |
| **docker-compose.yml** | Orchestration, volumes, health checks |
| **.dockerignore** | Exclude unnecessary files from build |

### Configuration Files
| File | Purpose |
|------|---------|
| **.env.example** | Environment variables template |
| **.env.production** | Production environment template |
| **.gitignore** | Git ignore patterns |

### Documentation
| File | Purpose |
|------|---------|
| **DEPLOY_TO_COOLIFY.md** | Complete step-by-step guide |
| **DOCKER_COMMANDS.md** | Docker commands reference |
| **COOLIFY_DEPLOYMENT.md** | Advanced Coolify setup |

### Build Scripts
| File | Purpose |
|------|---------|
| **build-docker.sh** | Build script for Linux/Mac |
| **build-docker.bat** | Build script for Windows |

### Backend Security
| File | Purpose |
|------|---------|
| **backend/middleware/securityMiddleware.js** | Security headers |
| **backend/utils/validateEnv.js** | Environment validation |

---

## 🔧 Dockerfile Breakdown

### What's Inside?

```dockerfile
# Stage 1: Frontend Build
├─ Builds React/Vite app
├─ Creates: /dist folder with static assets
└─ Output: React SPA using npm run build

# Stage 2: Runtime
├─ Base: node:20-alpine (lightweight)
├─ Installs: curl + tini (process manager)
├─ Copies: frontend dist to backend
├─ Installs: backend dependencies
├─ Exposes: port 5000
├─ Health check: curl /api/health
└─ Runs: node server.js
```

### Key Features in Dockerfile

✅ **Curl included**: line 26 `RUN apk add --no-cache curl tini`
✅ **Signal handling**: Uses tini as PID 1
✅ **Health checks**: Built-in container monitoring
✅ **Production mode**: npm ci with --only=production
✅ **Persistent uploads**: mkdir -p backend/uploads

---

## 🌐 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│           Coolify (Your Server)                    │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │    Docker Container (intellica-app)          │  │
│  │                                              │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │  Express Server (Node.js)               │ │  │
│  │  │  Port 5000                              │ │  │
│  │  │                                         │ │  │
│  │  │  ├─ /api/*        → Backend routes   │ │ │  │
│  │  │  ├─ /uploads/*    → File uploads    │ │ │  │
│  │  │  ├─ /              → Frontend SPA    │ │ │  │
│  │  │  └─ /api/health    → Health check  │ │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │                                              │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │  Static Files (React Built)            │ │  │
│  │  │  /dist folder (served by Express)      │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │                                              │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │  Volumes (Persistent Storage)          │ │  │
│  │  │  /uploads/ → File uploads             │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  External Services:                                │
│  ├─ MongoDB Atlas (Database)                      │
│  └─ Gmail SMTP (Email/OTP)                        │
└─────────────────────────────────────────────────────┘

User Access:
  https://your-domain.com/          → Frontend (React SPA)
  https://your-domain.com/api/*     → Backend APIs
  https://your-domain.com/api/health → Health Check
  https://your-domain.com/uploads/* → Uploaded Files
```

---

## 🔐 Security Features

### Included Security Middleware

✅ **X-Frame-Options**: Prevents clickjacking
✅ **X-Content-Type-Options**: Prevents MIME sniffing
✅ **X-XSS-Protection**: Enables browser XSS filter
✅ **Referrer-Policy**: Restricts referrer info
✅ **Permissions-Policy**: Disables sensitive APIs
✅ **HSTS**: Enforces HTTPS (production)

### Environment Validation

✅ Checks required environment variables at startup
✅ Fails fast if credentials missing
✅ Clear error messages in logs

### Best Practices Implemented

✅ JWT authentication on protected routes
✅ CORS properly configured
✅ Input validation on all endpoints
✅ Secure password hashing (bcryptjs)
✅ OTP-based authentication for faculty/HOD

---

## 📊 Environment Variables Required

```bash
# Database (MongoDB Atlas)
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db

# Application
PORT=5000
NODE_ENV=production

# Authentication
JWT_SECRET=your_jwt_secret_here

# Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_app_password_here
```

---

## 🚀 Deployment Steps

### Step 1: Prepare Repository

```bash
cd /path/to/Intellica_Project_M

# Add all files
git add .

# Commit
git commit -m "Deploy: Docker setup for Coolify"

# Push to repository
git push origin main
```

### Step 2: Create Coolify Application

1. Go to Coolify Dashboard
2. Click **New Application**
3. Select **Docker Compose**
4. Connect your Git repository
5. Set base directory to `/`

### Step 3: Configu­re Environment

In Coolify → Application Settings → **Environment Variables**:

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
NODE_ENV=production
PORT=5000
```

### Step 4: Deploy

Click **Deploy** and wait for:
- ✅ Git clone
- ✅ Docker build
- ✅ Container start
- ✅ Health checks passing

### Step 5: Access Application

```
Frontend: https://your-domain.com/
API Health: https://your-domain.com/api/health
```

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Frontend loads at `https://your-domain.com/`
- [ ] Health check returns status: `curl https://your-domain.com/api/health`
- [ ] Login page displays correctly
- [ ] Can login with test credentials
- [ ] OTP email is received
- [ ] Dashboard loads after authentication
- [ ] Can upload files (if testing with faculty role)
- [ ] Check Coolify logs for any errors
- [ ] SSL certificate is valid (green lock icon)

---

## 🐛 Troubleshooting

### Container won't start?
```bash
# Check Coolify logs
# Common issues:
1. MONGO_URI is missing or invalid
2. JWT_SECRET not set
3. MongoDB network access not whitelisted
```

### Frontend not loading?
```bash
# Check browser console (F12)
# Verify:
1. Frontend build completed (dist folder exists)
2. API endpoint is accessible
3. CORS headers are correct
```

### API calls failing?
```bash
# Test health endpoint:
curl https://your-domain.com/api/health

# If 404: Check frontend/backend routing
# If 500: Check server logs in Coolify
```

### Emails not sending?
```bash
# Verify Gmail settings:
1. 2FA enabled on Gmail
2. App Password generated (not regular password)
3. EMAIL_USER and EMAIL_APP_PASSWORD correct
4. Sending IP whitelisted (if necessary)
```

---

## 📈 Scaling & Performance

### Default Resources (docker-compose.yml)
- **CPU Limit**: 2 CPUs
- **RAM Limit**: 1GB
- **CPU Reservation**: 1 CPU
- **RAM Reservation**: 512MB

### Adjust for Larger Deployments

Edit `docker-compose.yml`:
```yaml
services:
  intellica-app:
    deploy:
      resources:
        limits:
          cpus: '4'           # Increase CPU
          memory: 2G          # Increase RAM
```

### Auto-redeploy on Git Push

In Coolify:
1. Application → Settings → Webhooks
2. Copy webhook URL
3. Add to GitHub/GitLab repository settings
4. Now pushes automatically trigger builds

---

## 🎯 What You Get

With this Docker setup, Coolify will:

| Feature | Benefit |
|---------|---------|
| **Single Container** | Easy management, lower resource usage |
| **Auto Health Checks** | Automatic restart if unhealthy |
| **Persistent Uploads** | Files survive container restarts |
| **SSL Certificate** | HTTPS with Let's Encrypt |
| **Auto Logging** | JSON logs with rotation |
| **Signal Handling** | Graceful shutdowns |
| **Security Headers** | Production-ready protection |

---

## 📞 Support

### Common Commands

```bash
# Build locally
docker build -t intellica-app:latest .

# Run locally
docker-compose up --build

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Clean up
docker system prune
```

### Check Documentation

1. **Quick Deployment**: See `DEPLOY_TO_COOLIFY.md`
2. **Docker Commands**: See `DOCKER_COMMANDS.md`
3. **Advanced Setup**: See `COOLIFY_DEPLOYMENT.md`

### Verify Setup

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Expected response
{"status":"Faculty Research Management API Running"}
```

---

## ✨ Key Highlights

🎯 **Production-Ready**: Security, health checks, monitoring
🐳 **Docker Optimized**: Multi-stage build, Alpine base, minimal image
📦 **Single Repo**: Both frontend and backend in one repository
🚀 **Easy Deployment**: One-click deploy to Coolify
💾 **Persistent Storage**: Volumes for uploads
🔒 **Secure**: Environment validation, security headers
📊 **Monitorable**: Health checks, logs, metrics
🔄 **Auto-Restart**: Failed containers restart automatically

---

## 🎉 Ready to Deploy!

Your Intellica Project is fully configured for Coolify deployment:

1. ✅ Push to Git
2. ✅ Create Coolify application
3. ✅ Set environment variables
4. ✅ Click Deploy
5. ✅ Access your live application

**Happy deploying! 🚀**

---

For detailed step-by-step instructions, see: **`DEPLOY_TO_COOLIFY.md`**
