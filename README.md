# UPI Payment Application - Complete MERN Stack

A secure, mobile-first MERN-stack web application for one-user UPI payments. Users authenticate with UPI ID once, then can scan QR codes and send payments with auto-filled amounts.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### User Flow
1. **First Visit**: User enters UPI ID and creates password
2. **Account Creation**: Securely stored in MongoDB with hashed password
3. **Auto Login**: Subsequent visits automatically log in (until localStorage cleared)
4. **Amount Input**: User enters payment amount with validation
5. **QR Scanner**: Real-time camera-based UPI QR code scanning
6. **Auto Redirect**: Deep-link to UPI app with pre-filled amount
7. **Payment Confirmation**: Shows transaction details and payment link

### Core Features
- ✅ Secure JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ MongoDB persistent storage
- ✅ QR code scanning (html5-qrcode)
- ✅ UPI deep-link generation
- ✅ Rate limiting and input validation
- ✅ CORS and security headers (Helmet)
- ✅ Mobile-first responsive design
- ✅ Automatic session persistence
- ✅ Protected routes

## 🛠 Tech Stack

### Frontend
- **React 18**: UI framework
- **React Router 6**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **html5-qrcode**: QR code scanner
- **Axios**: HTTP client

### Backend
- **Node.js & Express.js**: Server and API
- **MongoDB**: NoSQL database
- **JWT**: Session management
- **bcryptjs**: Password hashing
- **Helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **express-validator**: Input validation

## 📁 Project Structure

```
Qr generator/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React Context (Auth)
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service
│   │   ├── utils/              # Utility hooks
│   │   ├── App.js              # Main app
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Static files
│   ├── package.json
│   ├── .env                    # Frontend config
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── README.md               # Frontend docs
│
├── backend/                    # Express backend
│   ├── config/                 # Configuration
│   ├── models/                 # MongoDB schemas
│   ├── controllers/            # Business logic
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth, validation
│   ├── utils/                  # Helper functions
│   ├── server.js               # Entry point
│   ├── package.json
│   ├── .env.example            # Config template
│   └── README.md               # Backend docs
│
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14+
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone or Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your MongoDB URI and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/upi-payment-app
JWT_SECRET=your-super-secret-key-change-this
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

Start backend:
```bash
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Setup Frontend

```bash
cd frontend
npm install
```

The `.env` file is already configured for local development:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```
Frontend runs on: `http://localhost:3000`

### 3. Access the App
- Open `http://localhost:3000` in your browser
- Enter any UPI ID (e.g., `testuser@paytm`)
- Create a password
- You're logged in! (Token saved locally)

## 📖 Setup Instructions

### Detailed Backend Setup

1. **Install MongoDB** (if local):
   - Windows: Download from mongodb.com
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB**:
   ```bash
   # If installed locally
   mongod
   
   # Or use MongoDB Atlas cloud (update MONGODB_URI in .env)
   ```

3. **Environment Configuration**:
   ```bash
   cd backend
   cp .env.example .env
   ```

4. **Required Environment Variables**:
   ```
   MONGODB_URI=mongodb://localhost:27017/upi-payment-app
   JWT_SECRET=change-this-to-a-random-string-min-32-chars
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Install and Run**:
   ```bash
   npm install
   npm run dev
   ```

### Detailed Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Already Configured**:
   - `.env` is ready for local development
   - Points to `http://localhost:5000/api`

3. **Start Development Server**:
   ```bash
   npm start
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 💻 Usage Guide

### User Authentication

**First-time user:**
1. Navigate to app
2. Enter UPI ID (e.g., `yourname@bank`)
3. Create secure password
4. Account created automatically
5. Logged in and redirected to dashboard

**Returning user:**
1. Navigate to app
2. Automatically logged in (if token in localStorage)
3. Redirected to dashboard

**Manual login:**
1. Enter same UPI ID and password
2. Authenticated and logged in

### Making a Payment

1. **Click "Make Payment"** on dashboard
2. **Enter Amount**:
   - Manual: Type any amount (₹1 - ₹100,000)
   - Quick buttons: ₹100, ₹500, ₹1000, ₹2000, ₹5000, ₹10000
3. **Scan QR Code**:
   - Camera access requested (allow)
   - Point at UPI QR code (merchant/vendor)
   - Auto-scan when detected
4. **Payment Confirmation**:
   - Shows payee UPI and amount
   - Auto-redirects to UPI app
   - Amount pre-filled in payment app
   - Complete payment in UPI app

### UPI App Support
Works with:
- Google Pay
- Paytm
- PhonePe
- BHIM
- WhatsApp Pay
- Any UPI-enabled payment app

## 🔌 API Documentation

### Authentication Endpoints

**POST /api/auth/register-or-login**
```bash
curl -X POST http://localhost:5000/api/auth/register-or-login \
  -H "Content-Type: application/json" \
  -d '{"upiId":"user@bank","password":"secure123"}'
```
Response: `{ "token": "...", "user": {...}, "message": "..." }`

**GET /api/auth/verify**
```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer <token>"
```
Response: `{ "user": {...}, "message": "User verified" }`

**GET /api/auth/upi**
```bash
curl -X GET http://localhost:5000/api/auth/upi \
  -H "Authorization: Bearer <token>"
```
Response: `{ "upiId": "user@bank" }`

### Payment Endpoints

**POST /api/payment/generate-link**
```bash
curl -X POST http://localhost:5000/api/payment/generate-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"upiId":"payee@bank","amount":500}'
```
Response: `{ "success": true, "data": { "deepLink": "upi://...", ... } }`

**POST /api/payment/parse-qr**
```bash
curl -X POST http://localhost:5000/api/payment/parse-qr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"qrData":"upi://pay?pa=..."}'
```

**POST /api/payment/initiate**
```bash
curl -X POST http://localhost:5000/api/payment/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"scannedUPI":"upi://pay?pa=...","amount":500}'
```

### Health Check

**GET /api/health**
```bash
curl http://localhost:5000/api/health
```
Response: `{ "message": "Server is running" }`

## 🔒 Security

### Implemented Security Features

1. **Password Security**
   - Hashed with bcryptjs (10 salt rounds)
   - Never stored in plain text
   - Validated on every login

2. **JWT Authentication**
   - 7-day expiration by default
   - Secure token signing
   - Validated on protected routes

3. **Input Validation**
   - UPI ID format validation
   - Amount range validation (₹1-₹100,000)
   - SQL injection prevention
   - XSS protection (React escaping)

4. **Rate Limiting**
   - 100 requests per 15 minutes
   - Prevents brute force attacks
   - Protects against DDoS

5. **CORS & Security Headers**
   - Restricted to specified origin
   - Security headers (Helmet.js)
   - XSS protection headers
   - Content-type enforcement

6. **Data Protection**
   - No sensitive data in logs
   - Generic error messages
   - Secure headers
   - HTTPS ready

### Recommendations for Production

1. **Change JWT_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Enable HTTPS**:
   - Use SSL certificates
   - Redirect HTTP to HTTPS

3. **Additional Measures**:
   - Implement request logging
   - Add monitoring and alerts
   - Use environment-specific configs
   - Regular dependency updates
   - Database backups
   - API key rotation

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```
Error: Cannot connect to MongoDB
Solution:
- Ensure MongoDB is running (mongod)
- Check MONGODB_URI in .env
- Verify network access if using Atlas
```

**Port 5000 Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
Solution:
- Change PORT in .env
- Kill process: lsof -i :5000 (Mac/Linux)
- Or: netstat -ano | findstr :5000 (Windows)
```

**JWT Token Invalid**
```
Error: Invalid or expired token
Solution:
- Refresh page to get new token
- Check JWT_SECRET matches
- Clear localStorage and re-login
```

### Frontend Issues

**Camera Permission Denied**
```
QR Scanner not working
Solution:
- Check browser camera permissions
- HTTPS required (or localhost)
- Some browsers need HTTPS
```

**API Connection Failed**
```
Error: Failed to fetch
Solution:
- Ensure backend running on port 5000
- Check REACT_APP_API_BASE_URL in .env
- Check CORS_ORIGIN in backend .env
- Open browser console for details
```

**QR Code Not Scanning**
```
QR code not detected
Solution:
- Ensure good lighting
- QR must be UPI format (upi://...)
- Steady camera position
- Clear lens
- Try different QR codes
```

**Login Token Not Persisting**
```
Not staying logged in
Solution:
- Clear browser cookies
- Check localStorage is enabled
- Not in incognito/private mode
- Check browser privacy settings
```

## 📝 Testing the Application

### Manual Testing Steps

1. **Test Registration**:
   - Enter new UPI ID: `testuser@paytm`
   - Enter password: `Test@123`
   - Should see success message

2. **Test Auto-Login**:
   - Reload page
   - Should automatically log in
   - No need to enter credentials

3. **Test Logout**:
   - Click Logout button
   - Should redirect to login page
   - Clearing localStorage

4. **Test Amount Validation**:
   - Try amount: `0` (should fail)
   - Try amount: `100001` (should fail)
   - Try amount: `500` (should succeed)

5. **Test QR Scanner**:
   - On QR scanner page
   - Point at UPI QR code
   - Should detect and parse

6. **Test Payment Link**:
   - Scan valid UPI QR
   - Should show payment details
   - Manual redirect button available

## 📱 Mobile Testing

### iOS
- Use Safari browser
- Camera access required
- Test with actual UPI QR codes

### Android
- Chrome recommended
- Camera permission required
- Test with multiple UPI apps

## 🚀 Deployment

### Deploy Backend (Heroku)

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)

**Vercel:**
```bash
npm run build
vercel --prod
```

**Netlify:**
```bash
npm run build
# Upload 'build' folder to Netlify
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [JWT Introduction](https://jwt.io)
- [Tailwind CSS](https://tailwindcss.com)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode)

## 📄 License

This project is provided as-is for educational and personal use.

## 🤝 Support

For issues or questions:
1. Check troubleshooting section
2. Review backend/README.md
3. Review frontend/README.md
4. Check browser console for errors
5. Check server logs for backend errors

---

**Happy Coding! 🎉**

Remember to change sensitive credentials before deploying to production.
