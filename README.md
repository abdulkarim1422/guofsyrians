# Training Employment Platform 🚀

A full-stack web application for managing training programs, job listings, and resume building.

## Quick Start ⚡

### Prerequisites
- Node.js (≥18.0.0)
- Python (≥3.11.0)
- Docker Desktop

### One-Command Development

```bash
# Start everything with a single command
npm run dev
```

That's it! 🎉 This command automatically starts:

- 🗄️ **MongoDB** container (Docker)
- 🌐 **FastAPI Backend** (port 8222)  
- 🎨 **React Frontend** (port 5173/5174)

## Development URLs

- **Frontend**: http://localhost:5173 (or 5174 if busy)
- **Backend API**: http://localhost:8222
- **API Docs**: http://localhost:8222/docs (Swagger UI)
- **MongoDB**: mongodb://localhost:27017

## Available Commands

```bash
npm run dev          # 🚀 Start full development environment
npm run install:all  # 📦 Install all dependencies
npm run build        # 🏗️ Build frontend for production
npm run test         # 🧪 Run backend unit tests
npm run clean        # 🧹 Clean containers and dependencies
```

## First Time Setup

**Windows**: Double-click `setup-dev.bat`
**Mac/Linux**: Run `./setup-dev.sh`

Or install manually:
```bash
npm run install:all
```

## Docker Deployment (Alternative)

### Production
```bash
docker compose up -d
```
Then visit: http://localhost:4173

### Development (Docker)
```bash
docker compose -f docker-compose.dev.yml up
```
Then visit: http://localhost:5173

## Default Login
- **Username**: `admin@guofsyrians.com`
- **Password**: `admin123`

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI + Python + Beanie ODM
- **Database**: MongoDB
- **Auth**: JWT tokens
- **Dev Tools**: Concurrently, Hot reload

## API Features

- ✅ **V2 API** with normalized data structures
- ✅ **Authentication** with JWT tokens
- ✅ **Jobs Management** (CRUD operations)
- ✅ **Resume Builder** with file uploads
- ✅ **Auto-reload** for development
- ✅ **CORS** configured for local dev

## Troubleshooting

**Port conflicts**: Frontend auto-finds available ports
**Docker issues**: Ensure Docker Desktop is running  
**Dependencies**: Run `npm run clean` then `npm run install:all`
**API errors**: Check backend logs in unified terminal

---

Built with ❤️ for training and employment management