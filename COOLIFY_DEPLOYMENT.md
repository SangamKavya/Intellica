# Coolify Deployment Guide

## Prerequisites
- ✅ Git repository (GitHub, GitLab, Gitea, etc.)
- ✅ Coolify instance running
- ✅ Docker installed on Coolify server

## Docker Setup Overview

### What's Included
- **Multi-stage build** - Optimized image size
- **Frontend + Backend** - Single container deployment
- **Health checks** - Automatic monitoring
- **Signal handling** - Graceful shutdowns with tini
- **Curl included** - For diagnostics

### Build Process
1. **Stage 1**: Build React/Vite frontend to `/dist`
2. **Stage 2**: Install backend dependencies and serve frontend through backend

## Step-by-Step Coolify Setup

### 1. Push Code to Git Repository
```bash
git add .
git commit -m "add: Dockerfile and docker-compose for Coolify deployment"
git push
```

### 2. In Coolify Dashboard

**Create New Application:**
1. Go to **Applications** → **New**
2. Select **Docker Compose** (or **Docker** if you prefer)
3. Choose your git repository
4. Set the base directory to `/` (root)

### 3. Configure Environment Variables

In Coolify's **Settings** → **Build Variables** or **Runtime Environment**, add:

```
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/your_database?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

### 4. Port Mapping

- Expose port **5000** in Coolify
- Frontend accessible at: `http://your-domain/`
- API accessible at: `http://your-domain/api/*`
- Health check: `http://your-domain/api/health`

### 5. Deploy

Click **Deploy** and Coolify will:
- ✅ Pull code from Git
- ✅ Build the Docker image
- ✅ Start the container
- ✅ Monitor health checks
- ✅ Restart on failure

## Docker Compose Method (Alternative)

If using `docker-compose.yml`:

**File: `docker-compose.yml`**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=${MONGO_URI}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Coolify will automatically use this if present.

## Direct Docker Commands (For Testing)

### Build Image
```bash
docker build -t intellica-app:latest .
```

### Run Container
```bash
docker run -d \
  --name intellica-app \
  -p 5000:5000 \
  -e MONGO_URI="your_connection_string" \
  -e NODE_ENV=production \
  intellica-app:latest
```

### View Logs
```bash
docker logs -f intellica-app
```

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Stop Container
```bash
docker stop intellica-app
docker rm intellica-app
```

## Troubleshooting

### Container won't start
```bash
docker logs intellica-app
```
Check for MongoDB connection issues

### Port already in use
```bash
docker run -p 8080:5000 ...  # Map to different port
```

### Frontend not loading
- Ensure `frontend/dist/index.html` exists
- Check backend is serving static files: `/app/backend/dist`

### Health check failing
```bash
curl -v http://localhost:5000/api/health
```

Monitor logs for database connection errors

## Directory Structure

```
Intellica_Project_M/
├── Dockerfile              # Multi-stage build
├── docker-compose.yml      # Docker Compose config
├── .dockerignore          # Ignore unnecessary files
├── .env.example           # Environment template
├── package.json           # Root config
├── backend/
│   ├── server.js          # Serves frontend dist
│   ├── package.json
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── uploads/           # User files
│   └── ...
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── src/
    ├── public/
    └── ...
```

## Production Tips

1. **Enable HTTPS** in Coolify domain settings
2. **Auto-redeploy** on git push via webhooks
3. **Scale horizontally** if needed (Coolify Pro)
4. **Monitor logs** - Coolify provides log streaming
5. **Backup MongoDB** - Set up automated backups
6. **Environment secrets** - Use Coolify's secret management

## What Gets Deployed

✅ Frontend (React/Vite) - served as static files
✅ Backend (Node.js/Express) - API server
✅ MongoDB connection - via MONGO_URI
✅ Uploads folder - for file storage
✅ Health checks - automatic monitoring

All in a **single container** listening on **port 5000**

## URLs After Deployment

- **Website**: `https://your-domain.com/`
- **API**: `https://your-domain.com/api/*`
- **Health**: `https://your-domain.com/api/health`
