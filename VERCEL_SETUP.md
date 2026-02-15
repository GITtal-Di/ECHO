# Vercel Deployment Setup Guide

## Overview
This guide explains how to properly deploy both the backend and frontend on Vercel.

## Backend Deployment

### Step 1: Create Backend Project on Vercel
1. Go to https://vercel.com
2. Import the GitHub repo
3. Select the root directory as `./backend`
4. Set up environment variables (see below)

### Step 2: Set Environment Variables for Backend
In your Vercel Dashboard, go to Settings > Environment Variables and add:

```
NODE_ENV = production
PORT = 3000
CORS_ORIGIN = https://your-frontend.vercel.app
REDIS_ENABLED = false
```

**Important**: Replace `https://your-frontend.vercel.app` with your actual frontend domain.

### Step 3: Deploy Backend
- Push to GitHub and Vercel will auto-deploy
- Or click "Deploy" in Vercel dashboard
- Copy your backend URL (e.g., https://echo-backend.vercel.app)

## Frontend Deployment

### Step 1: Create Frontend Project on Vercel
1. Go to https://vercel.com
2. Import the GitHub repo
3. Select the root directory as `./frontend`
4. Set up environment variables (see below)

### Step 2: Set Environment Variables for Frontend
In your Vercel Dashboard for frontend, go to Settings > Environment Variables:

```
VITE_BACKEND_URL = https://your-backend.vercel.app
```

**Important**: Use the backend URL you copied from Step 3 above.

### Step 3: Build Settings
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 4: Deploy Frontend
- Push to GitHub and Vercel will auto-deploy
- Or click "Deploy" in Vercel dashboard

## Local Development

### Backend
```bash
cd backend
npm install
node app.js
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
# Automatically connects to http://localhost:5000
```

## Troubleshooting

### WebSocket Connection Errors
- ✅ Make sure both CORS_ORIGIN (backend) and VITE_BACKEND_URL (frontend) match
- ✅ Backend URL must be the deployed Vercel URL
- ✅ Use HTTPS in production

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Build Errors
- Clear node_modules and reinstall:
```bash
rm -r node_modules package-lock.json
npm install
npm run build
```

## Important Notes

1. **Separate Projects**: Backend and Frontend must be deployed as separate Vercel projects
2. **Environment Variables**: Set these in Vercel Dashboard, not in `.env` files
3. **CORS**: The backend CORS_ORIGIN must match your frontend domain
4. **WebSocket**: Both projects must use HTTPS in production
5. **Redis**: Currently disabled - configure Redis Cloud if needed

## Monitoring Deployments

### Backend
- Production: https://your-backend.vercel.app
- Health Check: https://your-backend.vercel.app/health
- Root: https://your-backend.vercel.app/

### Frontend
- Production: https://your-frontend.vercel.app
