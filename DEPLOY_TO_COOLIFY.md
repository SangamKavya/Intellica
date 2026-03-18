# 🚀 Intellica Project - Complete Coolify Deployment Guide

## 📋 Project Overview

**Intellica Project** - Faculty Research Management System
- **Frontend**: React 19 + Vite 5 (builds to static assets)
- **Backend**: Node.js 20 + Express (serves frontend + APIs)
- **Database**: MongoDB Atlas
- **Container**: Docker (single container for both frontend & backend)
- **Port**: 5000

---

## ✅ Pre-Deployment Checklist

### 1. Code Repository
- [ ] Push all code to Git (GitHub, GitLab, Gitea, Gitee, etc.)
- [ ] Ensure `.env` files are in `.gitignore` (credentials not committed)
- [ ] Confirm `Dockerfile` exists in root directory
- [ ] Confirm `docker-compose.yml` exists in root directory

### 2. MongoDB Atlas Setup
- [ ] Create MongoDB cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create database user with admin privileges
- [ ] Whitelist **0.0.0.0/0** (or Coolify server IP) for network access
- [ ] Copy connection string: `mongodb+srv://user:password@cluster.mongodb.net/db`

### 3. Email Configuration (Gmail)
- [ ] Use Gmail account (or any SMTP service)
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password at: https://myaccount.google.com/apppasswords
- [ ] Save app password (used for EMAIL_APP_PASSWORD)

### 4. Coolify Instance
- [ ] Coolify server is running and accessible
- [ ] Docker is installed on Coolify machine
- [ ] Sufficient disk space (minimum 5GB for images)

---

## 🔧 Step-by-Step Deployment

### Step 1: Git Repository Setup

```bash
# Initialize git if not already done
cd /path/to/Intellica_Project_M
git init

# Add all files
git add .

# Create initial commit
git commit -m "initial: Faculty Research Management System with Docker setup"

# Add remote repository
git remote add origin https://github.com/your-username/intellica-project.git

# Push to repository
git branch -M main
git push -u origin main
```

### Step 2: Access Coolify Dashboard

1. Open Coolify web interface: `http://your-coolify-domain:3000`
2. Login with your credentials
3. Navigate to **Applications** or **Projects**

### Step 3: Create New Application

**Option A: Docker Compose (Recommended)**

1. Click **New** → **New Application**
2. Select **Docker Compose**
3. Choose your Git Repository
4. Repository URL: `https://github.com/your-username/intellica-project.git`
5. Base directory: `/` (root)
6. Click **Create**

**Option B: Docker**

1. Click **New** → **New Application**
2. Select **Docker**
3. Choose your Git Repository
4. Base directory: `/` (root)
5. Click **Create**

### Step 4: Configure Environment Variables

In Coolify Application Settings → **Environment Variables** (or **Build Variables**), add:

```bash
# Database Configuration
MONGO_URI=mongodb+srv://nithinpandu9_db_user:bJPb5iFwDe3rfp0I@cluster0.1ryotkr.mongodb.net/intellica_db?retryWrites=true&w=majority

# Application Configuration
PORT=5000
NODE_ENV=production

# JWT Secret (generate secure string)
JWT_SECRET=your_secure_jwt_secret_change_this

# Email Configuration
EMAIL_USER=mic.intellica.project.2026@gmail.com
EMAIL_APP_PASSWORD=usfwnzfwgkqyfmsz
```

⚠️ **IMPORTANT**: In production, use Coolify's **Secrets** feature instead of plain environment variables for sensitive data.

### Step 5: Configure Domains & SSL

1. Application Settings → **Domains**
2. Add your domain: `intellica.yourdomain.com`
3. Enable **SSL via Let's Encrypt**
4. Set port to **5000**

### Step 6: Build & Deploy

1. Click **Deploy** or **Redeploy Latest**
2. Coolify will:
   - Clone the repository
   - Execute `docker build -t intellica-app .`
   - Start the container
   - Run health checks
   - Expose via your domain

### Step 7: Verify Deployment

```bash
# Access application
https://intellica.yourdomain.com/

# Check API health
curl https://intellica.yourdomain.com/api/health

# Expected response
{"status":"Faculty Research Management API Running"}
```

---

## 🔍 Post-Deployment Verification

### 1. Frontend Access
- Visit: `https://your-domain.com/`
- Should see login page
- Check browser console (F12) for any errors

### 2. API Health Check
```bash
curl -X GET https://your-domain.com/api/health
# Response: {"status":"Faculty Research Management API Running"}
```

### 3. Test Authentication
- Try login with known credentials
- Check if OTP email is sent

### 4. Test File Upload
- Login as faculty
- Try uploading a PDF to test file handling

### 5. Monitor Logs
In Coolify:
- Application → **Logs**
- Check for any errors or warnings
- Verify MongoDB connection message

---

## 🐛 Troubleshooting

### Issue 1: Container won't start

**Solution:**
```bash
# Check logs in Coolify
Application → Logs → View full logs

# Common issues:
1. Missing MONGO_URI - verify connection string format
2. Invalid JWT_SECRET - ensure it's set
3. MongoDB network access - whitelist Coolify server IP in Atlas
```

### Issue 2: Frontend not loading

**Solution:**
```bash
# Verify dist folder exists
curl https://your-domain.com/api/health

# If API responds but frontend doesn't:
1. Check browser DevTools → Network tab
2. Look for 404 errors on static assets
3. Check Coolify logs for errors
```

### Issue 3: API calls returning 401

**Solution:**
```bash
# Usually JWT token issue
1. Clear browser localStorage
2. Login again to get new token
3. Check JWT_SECRET matches between builds
```

### Issue 4: MongoDB connection timeout

**Solution:**
```bash
# In MongoDB Atlas:
1. Check cluster is running (green status)
2. Whitelist Coolify server IP: 0.0.0.0/0
3. Verify connection string format:
   mongodb+srv://USER:PASSWORD@cluster.mongodb.net/DB?retryWrites=true&w=majority
```

### Issue 5: Emails not being sent

**Solution:**
```bash
# Check Gmail settings:
1. Ensure 2FA is enabled on Gmail account
2. Use App Password (not regular password)
3. Whitelist sending IP if needed
4. Check EMAIL_USER and EMAIL_APP_PASSWORD are correct
```

---

## 📊 Monitoring & Maintenance

### Health Check Endpoint
```bash
# Responds every 30 seconds (Docker health check)
curl https://your-domain.com/api/health

# If this fails, container will restart automatically
```

### View Application Logs
```bash
# In Coolify Dashboard
Applications → Your App → Logs

# Or via Docker CLI (if SSH access)
docker logs -f intellica-app
```

### Update Application
```bash
# When you push code changes
git push origin main

# In Coolify:
1. Application → Deployment
2. Click "Redeploy Latest"

# Coolify will automatically:
- Git pull latest code
- Rebuild Docker image
- Restart container
```

### Backup MongoDB
```bash
# Configure in MongoDB Atlas:
1. Backup & Restore
2. Enable automated backups
3. Set retention period (daily, weekly, monthly)
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
✅ Use Coolify Secrets for sensitive data
❌ Do NOT commit `.env` files to repository
✅ Rotate JWT_SECRET periodically
✅ Use strong MongoDB passwords

### 2. Database Security
✅ Enable network access restrictions (whitelist IPs)
✅ Use strong MongoDB passwords
✅ Enable MongoDB authentication
✅ Regular backups enabled

### 3. SSL/HTTPS
✅ Enable SSL via Let's Encrypt (Coolify default)
✅ Redirect HTTP to HTTPS
✅ Use secure cookies (when implementing)

### 4. Application Security
✅ Security headers enabled (see middleware/securityMiddleware.js)
✅ CORS properly configured
✅ Input validation on all endpoints
✅ JWT token validation on protected routes

### 5. General Best Practices
✅ Regular security updates
✅ Monitor logs for suspicious activity
✅ Implement rate limiting for APIs
✅ Use strong, unique passwords everywhere
✅ Enable two-factor authentication

---

## 📝 Docker Details

### Dockerfile Execution Flow

```
1. Frontend Build Stage (frontend-builder)
   └─ Installs dependencies
   └─ Runs: npm run build
   └─ Creates: /dist folder

2. Main App Stage
   └─ Base: node:20-alpine
   └─ Installs: curl, tini
   └─ Installs backend dependencies
   └─ Copies frontend /dist to /backend/dist
   └─ Health check: curl to /api/health
   └─ Exposes: port 5000
   └─ Runs: node server.js
```

### Build Commands

```bash
# Coolify automatically runs:

# Build image
docker build -t intellica-app:latest .

# Run container
docker run -d \
  --name intellica-app \
  -p 5000:5000 \
  -e MONGO_URI=... \
  -e JWT_SECRET=... \
  -e EMAIL_USER=... \
  -e EMAIL_APP_PASSWORD=... \
  -e NODE_ENV=production \
  intellica-app:latest
```

### Docker Compose Services

The `docker-compose.yml` includes:
- ✅ Automatic restart policy
- ✅ Health checks every 30s
- ✅ CPU/Memory limits (2 CPU, 1GB RAM)
- ✅ Persistent volumes for uploads
- ✅ JSON logging with rotation (10MB, 3 files)
- ✅ Resource reservations (1 CPU, 512MB base)

---

## 🌐 Access Points After Deployment

| Service | URL |
|---------|-----|
| **Frontend** | `https://your-domain.com/` |
| **API Base** | `https://your-domain.com/api/` |
| **Health Check** | `https://your-domain.com/api/health` |
| **Auth Endpoint** | `https://your-domain.com/api/auth/` |
| **Uploads** | `https://your-domain.com/uploads/` |

---

## 📞 Support & Troubleshooting

### Useful Commands

```bash
# View all containers (if SSH access)
docker ps -a

# View image size
docker images intellica-app

# View running logs
docker logs -f intellica-app

# Execute command in container
docker exec intellica-app curl http://localhost:5000/api/health

# Stop container
docker stop intellica-app

# Remove container
docker rm intellica-app
```

### Check Coolify Logs

In Coolify Dashboard:
1. Application Name → **Logs** tab
2. Filter by date/time
3. Search for errors

### Common Error Messages

| Error | Solution |
|-------|----------|
| `Cannot connect to MongoDB` | Check MONGO_URI, whitelist IP in Atlas |
| `404 Not Found` | Check frontend dist folder was built |
| `401 Unauthorized` | Check JWT token in localStorage |
| `ECONNREFUSED` | Check if services are running |

---

## ✨ Advanced Coolify Features

### Auto-Redeploy on Git Push

1. Application Settings → **Webhooks**
2. Copy webhook URL
3. Add to GitHub/GitLab repository:
   - GitHub: Settings → Webhooks → Add webhook
   - GitLab: Settings → Integrations → Webhooks
   - Add: `Push events`
   - Trigger: Coolify will auto-deploy on push

### Custom Domain SSL

1. Domain Settings → **SSL**
2. Option 1: Auto (Let's Encrypt) - recommended
3. Option 2: Custom certificate

### Scaling (Coolify Pro)

1. Application Settings → **Scaling**
2. Set minimum/maximum instances
3. Enable horizontal scaling

---

## 📂 File Structure for Deployment

```
Repository Root/
├── Dockerfile          ← Multi-stage build
├── docker-compose.yml  ← Docker Compose config
├── .dockerignore       ← Ignore unnecessary files
├── .env.example        ← Environment template
├── .env.production     ← Production template
├── .gitignore          ← Git ignore patterns
├── package.json        ← Root config
│
├── backend/
│   ├── server.js       ← Serves frontend + APIs
│   ├── package.json
│   ├── .env            ← LOCAL ONLY (not committed)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── uploads/        ← User files (volume mounted)
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── src/
    └── dist/           ← Built by Dockerfile
```

---

## 🎯 Final Checklist

- [ ] Git repository created and code pushed
- [ ] MongoDB Atlas cluster running with user created
- [ ] Gmail app password generated
- [ ] Coolify application created
- [ ] Environment variables set in Coolify dashboard
- [ ] Domain configured with SSL
- [ ] Application deployed successfully
- [ ] Health check endpoint responding
- [ ] Frontend loads in browser
- [ ] Login works with test credentials
- [ ] API health check: `curl https://your-domain.com/api/health`
- [ ] Logs checked for errors

---

## 🚀 You're Ready!

Your Intellica Project is now live on Coolify. Monitor the logs, test all functionality, and enjoy your deployed Faculty Research Management System!

**For support, check:**
- Coolify Logs
- Docker HEALTH CHECK status
- MongoDB Atlas connection string
- Environment variables in Coolify dashboard
