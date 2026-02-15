# ECHO - Production Deployment Guide

## Architecture Overview

- **Frontend**: React + Vite → Deploy to **Vercel**
- **Backend**: Node.js + Socket.IO → Deploy to **Railway** (WebSocket support required)

---

## Frontend Deployment (Vercel)

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project" → Import your GitHub repository
3. Select the `frontend` folder as the **Root Directory**

### 2. Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables
Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_SOCKET_URL` | `https://your-backend.railway.app` |
| `VITE_GEMINI_API_KEY` | Your Gemini API key (if used) |

### 4. Deploy
Click "Deploy" - Vercel will automatically build and deploy.

---

## Backend Deployment (Railway)

> ⚠️ **Note**: Vercel serverless functions don't support WebSockets. Use Railway, Render, or Fly.io for the backend.

### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set **Root Directory** to `backend`

#### Environment Variables (Railway Dashboard):
```
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
REDIS_HOST=redis-13922.crce179.ap-south-1-1.ec2.cloud.redislabs.com
REDIS_PORT=13922
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
AI_SERVICE_URL=https://imagine-08-echo.hf.space
```

### Option B: Render

1. Go to [render.com](https://render.com)
2. Create a "Web Service"
3. Connect GitHub repo, set root to `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add environment variables same as Railway

---

## Post-Deployment Checklist

### 1. Update Frontend Environment
After deploying backend, update `VITE_SOCKET_URL` in Vercel:
```
VITE_SOCKET_URL=https://echo-backend.railway.app
```

### 2. Update Backend CORS
Update `CORS_ORIGIN` in Railway/Render with your Vercel URL:
```
CORS_ORIGIN=https://echo.vercel.app
```

### 3. Verify Deployment
- Frontend: Visit your Vercel URL
- Backend Health: `https://your-backend.railway.app/health`

---

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Edit with your values
npm run dev
```

---

## Environment Variables Summary

### Frontend (.env.local)
```env
VITE_SOCKET_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_key_here
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
REDIS_HOST=your_redis_host
REDIS_PORT=13922
REDIS_PASSWORD=your_password
REDIS_DB=0
AI_SERVICE_URL=https://imagine-08-echo.hf.space
```

---

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` includes your frontend URL exactly (with https://)
- Multiple origins: `CORS_ORIGIN=https://domain1.com,https://domain2.com`

### WebSocket Connection Failed
- Verify backend is running and accessible
- Check `VITE_SOCKET_URL` matches your backend URL exactly
- Ensure hosting platform supports WebSocket (Railway, Render do; Vercel serverless doesn't)

### Redis Connection Issues
- Verify Redis credentials are correct
- Check Redis Cloud allowlist includes your server IP
- App falls back to in-memory storage if Redis unavailable
