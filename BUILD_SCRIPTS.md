# Build Scripts Documentation

## Overview
This document outlines all build and deployment scripts for the QR Code Payment Generator application.

---

## **Frontend Build Scripts**

Located in: `frontend/package.json`

### Available Commands:

```bash
# Development mode - starts dev server with hot reload
npm start
npm run dev

# Production build - creates optimized production bundle
npm run build

# Run tests
npm test

# Eject (⚠️ irreversible - exposes webpack config)
npm run eject
```

### Build Configuration:
- **Build Tool**: react-scripts
- **Output Directory**: `build/`
- **Target Browser Support**:
  - Production: >0.2%, not dead, not op_mini all
  - Development: Latest versions of Chrome, Firefox, Safari

---

## **Backend Build Scripts**

Located in: `backend/package.json`

### Available Commands:

```bash
# Production mode - runs server directly
npm start

# Development mode - runs with nodemon (auto-reload on changes)
npm run dev
```

### Configuration:
- **Runtime**: Node.js
- **Main Entry**: `server.js`
- **Port**: 5000 (configurable via `PORT` env variable)

---

## **Deployment Instructions**

### Local Testing:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
# Server runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### Vercel Deployment:

#### Frontend:
1. Root Directory: `./frontend`
2. Build Command: `npm run build`
3. Output Directory: `build`
4. Environment Variables: `REACT_APP_API_URL`

#### Backend:
1. Root Directory: `./backend`
2. Build Command: Leave empty
3. Start Command: `npm start`
4. Environment Variables: `FRONTEND_URL`, `CORS_ORIGIN`, `NODE_ENV`, `PORT`

---

## **Environment Variables**

### Frontend (.env):
```
REACT_APP_API_URL=https://qr-generator-2uttfpc3f-sitesh-prusty-projects.vercel.app
REACT_APP_FRONTEND_URL=https://qr-generator-iota-one.vercel.app
```

### Backend (.env):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://qr-generator-iota-one.vercel.app
CORS_ORIGIN=https://qr-generator-iota-one.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## **Troubleshooting**

### ERR_CONNECTION_REFUSED
- **Cause**: Backend server not running or wrong API URL
- **Solution**: 
  - Ensure backend is running: `npm start` in backend folder
  - Verify `REACT_APP_API_URL` points to correct backend address

### Build Failures
- **Solution**: 
  - Delete `node_modules` and `package-lock.json`
  - Run `npm install` again
  - Clear build cache: `rm -rf build` (frontend)

### Port Already in Use
- **Solution**: 
  - Kill process: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)
  - Or change PORT in `.env`: `PORT=5001`

---

## **Production Build Size**

After running `npm run build`, the optimized bundle is ready for deployment to Vercel.

**Typical sizes**:
- Frontend bundle: 200-400KB (gzipped)
- Backend: Node modules ~150-200MB (not deployed, only runtime)

---

**Last Updated**: December 2, 2025
