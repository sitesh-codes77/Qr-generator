# Local Setup & Testing Guide

## Prerequisites
- Node.js (v14+) installed
- MongoDB running locally on `mongodb://localhost:27017`
- Git installed

---

## **Step 1: Install Dependencies**

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

---

## **Step 2: Configure Environment Variables**

### Backend `.env` (already configured)
```bash
MONGODB_URI=mongodb://localhost:27017/upi-payment-app
JWT_SECRET=qr-generator-super-secret-jwt-key-2024-production
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### Frontend `.env` (already configured)
```bash
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_FRONTEND_URL=http://localhost:3000
```

---

## **Step 3: Start MongoDB**

### Windows (if using MongoDB locally):
```bash
mongod
```

Or use MongoDB Atlas (cloud):
- Update `MONGODB_URI` in backend `.env` with your Atlas connection string

---

## **Step 4: Run Backend**

**Terminal 1:**
```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

---

## **Step 5: Run Frontend**

**Terminal 2:**
```bash
cd frontend
npm start
```

Browser will open at: `http://localhost:3000`

---

## **Step 6: Testing the App**

### Login/Register:
1. Enter UPI ID (e.g., `user@paytm`)
2. Enter password (any value)
3. Click "Continue"

### Expected Flow:
- ✅ Register/Login successful
- ✅ Redirected to Dashboard
- ✅ Can generate QR codes
- ✅ Can scan QR codes (if camera available)

---

## **Troubleshooting**

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Ensure MongoDB is running (`mongod`)
- Or update `MONGODB_URI` to use MongoDB Atlas

### 500 Error on Register
```
Server error, error: "Cannot read property 'upiId' of null"
```
**Solution**: 
- Check MongoDB is connected
- Check `MONGODB_URI` is correct
- Restart backend: `npm start`

### 401 Unauthorized Error
```
401 Unauthorized - Invalid or expired token
```
**Solution**:
- Clear browser localStorage: `localStorage.clear()`
- Ensure `JWT_SECRET` matches in both files
- Re-login with correct credentials

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**:
- Verify `CORS_ORIGIN` in backend `.env` = `http://localhost:3000`
- Verify `REACT_APP_API_BASE_URL` in frontend `.env` = `http://localhost:5000/api`
- Restart both servers

---

## **Production Deployment**

### Update for Production:

**Backend `.env` for Render:**
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Frontend `.env` for Vercel:**
```
REACT_APP_API_BASE_URL=https://your-backend.onrender.com/api
REACT_APP_FRONTEND_URL=https://your-frontend.vercel.app
```

Then push to GitHub and redeploy on Vercel/Render.

---

**Last Updated**: December 2, 2025
