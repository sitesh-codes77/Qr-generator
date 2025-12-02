# Production Deployment Checklist

## ✅ Configuration Updates Done

### Backend (Render)
- **URL**: `https://qr-generator-x8rs.onrender.com`
- **Updated `.env`**:
  - `NODE_ENV=production`
  - `FRONTEND_URL=https://qr-generator-iota-one.vercel.app`
  - `CORS_ORIGIN=https://qr-generator-iota-one.vercel.app`
- **Updated `server.js`**:
  - CORS whitelist includes Vercel frontend URL
- **Updated `render.json`**:
  - Build & start commands configured

### Frontend (Vercel)
- **URL**: `https://qr-generator-iota-one.vercel.app`
- **Updated `.env`**:
  - `REACT_APP_API_BASE_URL=https://qr-generator-x8rs.onrender.com/api`
  - `REACT_APP_FRONTEND_URL=https://qr-generator-iota-one.vercel.app`

---

## ⚠️ Important: Set Render Environment Variables

You need to add these environment variables in **Render Dashboard**:

1. Go to your Render project: `https://qr-generator-x8rs.onrender.com`
2. Click **Settings** → **Environment**
3. Add these variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=qr-generator-super-secret-jwt-key-2024-production
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://qr-generator-iota-one.vercel.app
CORS_ORIGIN=https://qr-generator-iota-one.vercel.app
PORT=5000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string!

---

## 🔧 Vercel Environment Variables

Frontend environment variables in Vercel are set via `.env` file and automatically deployed.

Alternatively, you can set in Vercel Dashboard:
1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add: `REACT_APP_API_BASE_URL=https://qr-generator-x8rs.onrender.com/api`

---

## ✅ Deployment Steps

### Step 1: Configure Render Environment
- Add all required environment variables to Render dashboard
- Ensure `MONGODB_URI` is set to MongoDB Atlas (not localhost!)

### Step 2: Trigger Redeploy
- In Render dashboard, click **Manual Deploy** or push to GitHub
- Wait for deployment to complete (check build logs)

### Step 3: Verify Frontend
- Vercel automatically redeployed after your git push
- Check `https://qr-generator-iota-one.vercel.app`

### Step 4: Test Connection
- Open frontend URL
- Try to login/register
- Monitor browser console for errors
- Check Render logs for backend errors

---

## 🐛 Troubleshooting

### CORS Error in Frontend
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**:
- Verify `FRONTEND_URL` and `CORS_ORIGIN` in Render environment variables match Vercel URL exactly
- Restart Render deployment

### 500 Error on Login
```
Internal Server Error
```
**Check**:
1. MongoDB is connected: Is `MONGODB_URI` correct?
2. JWT_SECRET is set in Render
3. Check Render logs for specific error

### 401 Unauthorized
```
Invalid or expired token
```
**Check**:
1. `JWT_SECRET` matches between frontend/backend
2. Token is being sent in Authorization header
3. Token has not expired

### Render Cold Start
- First request after inactivity may take 10-30 seconds
- This is normal for Render's free tier
- Upgrade to paid plan for guaranteed uptime

---

## 📋 Quick Checklist

- [ ] MongoDB Atlas connection string added to Render
- [ ] All environment variables set in Render dashboard
- [ ] Git changes pushed to GitHub
- [ ] Render deployment completed successfully
- [ ] Vercel deployment completed successfully
- [ ] Frontend loads at `https://qr-generator-iota-one.vercel.app`
- [ ] Can access backend at `https://qr-generator-x8rs.onrender.com/api/health`
- [ ] Login/Register works
- [ ] QR functionality works

---

**Last Updated**: December 2, 2025
