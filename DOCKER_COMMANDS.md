# Docker Commands for Intellica Project

## Quick Reference

### Build the Docker Image
```bash
docker build -t intellica-app:latest .
```

### Run with Docker Compose (Recommended)
```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Run with Docker (Direct)
```bash
docker run -d \
  --name intellica-app \
  -p 5000:5000 \
  -e MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/db" \
  -e NODE_ENV=production \
  intellica-app:latest
```

### Common Docker Commands
```bash
# View container logs
docker logs -f intellica-app

# View container stats (CPU, memory)
docker stats intellica-app

# Execute command inside container
docker exec intellica-app curl http://localhost:5000/api/health

# Stop container
docker stop intellica-app

# Remove container
docker rm intellica-app

# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Remove image
docker rmi intellica-app:latest
```

## Coolify Execution

Coolify automatically executes:

1. **Build Stage**
   ```
   docker build -t intellica-app:latest .
   ```

2. **Run Stage**
   ```
   docker run -d -p 5000:5000 -e MONGO_URI=... intellica-app:latest
   ```

### What Coolify Needs
- ✅ `Dockerfile` in repository root
- ✅ Environment variables set in Coolify dashboard
- ✅ Git repository connected
- ✅ Port 5000 exposed

## Dockerfile Breakdown

### Execution Flow

```
Dockerfile execution sequence:
│
├─ Stage 1: frontend-builder
│  ├─ FROM node:20-alpine
│  ├─ npm ci (install dependencies)
│  ├─ npm run build (creates /dist folder)
│  └─ Output: /app/frontend/dist
│
└─ Stage 2: Main (app)
   ├─ FROM node:20-alpine
   ├─ Install curl + tini
   ├─ npm ci (backend dependencies)
   ├─ COPY --from=frontend-builder (gets dist)
   ├─ HEALTHCHECK (curl to /api/health)
   ├─ ENTRYPOINT ["/sbin/tini", "--"]
   ├─ CMD ["node", "server.js"]
   └─ Output: Running container on port 5000
```

### Key Commands in Dockerfile

| Command | Purpose |
|---------|---------|
| `FROM` | Base image (Node.js Alpine) |
| `WORKDIR` | Change directory inside container |
| `COPY` | Copy files from host to container |
| `RUN` | Execute commands during build |
| `EXPOSE` | Document port (5000) |
| `HEALTHCHECK` | Automatic health monitoring |
| `ENTRYPOINT` | First command (tini for signals) |
| `CMD` | Default command (node server.js) |

## Health Check

The container has automatic health checks:

```bash
# Manual test
curl http://localhost:5000/api/health

# Response
{"status":"Faculty Research Management API Running"}
```

## Performance Tips

```bash
# Build with BuildKit (faster)
DOCKER_BUILDKIT=1 docker build -t intellica-app:latest .

# Build with progress output
docker build --progress=plain -t intellica-app:latest .

# Check image size
docker images intellica-app

# Clean up unused images/containers
docker system prune
```

## Environment Variables for Coolify

Set these in Coolify dashboard:

```
MONGO_URI=mongodb+srv://user:pass@url/db
PORT=5000
NODE_ENV=production
```

## Troubleshooting

### Container exits immediately
```bash
docker logs intellica-app
```

### Can't connect to MongoDB
- Verify MONGO_URI in environment variables
- Check MongoDB network access whitelist (IP)
- Test connection: `docker exec intellica-app node -e "require('mongoose').connect(process.env.MONGO_URI)"`

### Port 5000 already in use
```bash
# Find what's using port 5000
lsof -i :5000

# Use different port
docker run -p 8080:5000 intellica-app:latest
```

### Frontend not loading
```bash
# Check if dist folder exists in image
docker exec intellica-app ls -la /app/backend/dist/

# Check nginx logs (if using nginx proxy)
docker logs intellica-app
```

## Deployment Checklist

- [ ] Push code to Git repository
- [ ] `.env.example` has all required variables
- [ ] Dockerfile is in root directory
- [ ] `/backend/uploads` directory exists
- [ ] `frontend/package.json` has `build` script
- [ ] `backend/server.js` imports `path` module
- [ ] MongoDB MONGO_URI is correct
- [ ] Coolify has access to Git repository
- [ ] Port 5000 is available/exposed
- [ ] Test health endpoint: `/api/health`
