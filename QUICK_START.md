# 🚀 Quick Start Guide - UPI Payment App

## What You Just Got

A complete, production-ready MERN-stack UPI payment application with:
- ✅ Secure authentication with JWT
- ✅ Real-time QR code scanning
- ✅ UPI deep-linking with pre-filled amounts
- ✅ Mobile-first design
- ✅ Rate limiting & security features
- ✅ Automatic session persistence

## 📦 Project Contents

```
Qr generator/
├── backend/                 # Express.js server
│   ├── models/             # User schema
│   ├── controllers/        # Auth & Payment logic
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & Validation
│   ├── utils/              # UPI deep-link utilities
│   └── server.js           # Start here
│
├── frontend/               # React app
│   ├── src/pages/          # 5 pages included
│   ├── src/components/     # Auth wrapper
│   ├── src/context/        # Global auth state
│   ├── src/services/       # API client
│   └── App.js              # Routing
│
└── README.md               # Full documentation
```

## ⚡ 30-Second Setup

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
```
✅ Server starts on `http://localhost:5000`

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm start
```
✅ App opens on `http://localhost:3000`

## 🎯 First Steps

1. **Setup MongoDB** (if local):
   ```bash
   # Windows/Mac/Linux - Install from mongodb.com
   # Or use MongoDB Atlas (cloud) - update MONGODB_URI in backend/.env
   ```

2. **Update Backend .env**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI
   ```

3. **That's it!** Both servers auto-reload on code changes.

## 📱 Using the App

1. Open `http://localhost:3000`
2. Enter any UPI ID (e.g., `testuser@paytm`)
3. Create password
4. Click "Make Payment"
5. Enter amount (₹1-₹100,000)
6. Scan any UPI QR code
7. Get redirected to your UPI app with amount pre-filled!

## 🏗️ What's Included

### Backend Features
- User registration/login with UPI ID
- Password hashing (bcryptjs)
- JWT-based authentication
- UPI deep-link generation
- QR code parsing
- Input validation
- Rate limiting
- Error handling

### Frontend Features
- Login page with validation
- Dashboard with user info
- Amount input with quick buttons
- Real-time QR scanner (html5-qrcode)
- Payment confirmation page
- Protected routes
- Auto login on return visit

## 🔒 Security Built-In

- ✅ Passwords never stored plain
- ✅ JWT tokens with expiration
- ✅ CORS protection
- ✅ Rate limiting (100 req/15 min)
- ✅ Input validation
- ✅ Security headers (Helmet)
- ✅ XSS protection
- ✅ No sensitive data in logs

## 📚 Documentation

- **Full Guide**: See `README.md` (root)
- **Backend Details**: See `backend/README.md`
- **Frontend Details**: See `frontend/README.md`

## 🐛 Common Issues

**MongoDB won't connect?**
```
Make sure MongoDB is running:
- Windows: Start MongoDB from Services
- Mac: brew services start mongodb-community
- Linux: sudo systemctl start mongod
```

**Port 5000 in use?**
```
Update PORT in backend/.env to 5001 or 5002
```

**Camera not working?**
```
- Allow browser camera permission
- HTTPS required (or localhost)
- Check browser console for errors
```

**API connection failed?**
```
- Check backend is running on 5000
- Check CORS_ORIGIN in backend/.env matches your frontend URL
```

## 🚀 Production Deployment

### Backend (Heroku)
1. Add MongoDB URI to Heroku config vars
2. Add JWT_SECRET (use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
3. Deploy with `git push heroku main`

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Upload `build/` folder to Vercel/Netlify
3. Set `REACT_APP_API_BASE_URL` to your backend URL

## 📋 File Structure Quick Reference

### Backend Routes
```
POST   /api/auth/register-or-login    # Login/register
GET    /api/auth/verify               # Verify token
GET    /api/auth/upi                  # Get user UPI
POST   /api/auth/logout               # Logout
POST   /api/payment/generate-link     # Create UPI link
POST   /api/payment/parse-qr          # Parse QR data
POST   /api/payment/initiate          # Full payment flow
GET    /api/health                    # Health check
```

### Frontend Routes
```
/login                 # Login page
/                      # Dashboard
/amount                # Amount input
/scanner               # QR scanner
/payment-redirect      # Payment confirmation
```

## 💡 Key Concepts

**UPI Deep Link**: 
```
upi://pay?pa=user@bank&amount=500&tn=Payment
```
Opens UPI app with amount pre-filled

**JWT Token**:
Stored in localStorage, sent with each request in Authorization header

**QR Scanning**:
html5-qrcode library converts camera feed → detects QR → extracts UPI

**Rate Limiting**:
Prevents abuse with 100 requests per 15 minutes per IP

## 🎓 Learning Resources

- JWT: https://jwt.io/introduction
- MongoDB: https://www.mongodb.com/docs
- React: https://react.dev/learn
- Express: https://expressjs.com/en/starter/basic-routing.html
- UPI: https://www.npci.org.in/product-category/upi

## ✨ Next Steps

After testing locally:

1. **Read full documentation** in `README.md`
2. **Customize styling** in `frontend/src/index.css` and components
3. **Add more features** (payment history, favorites, etc.)
4. **Deploy to production** (see Deployment section in README.md)
5. **Setup monitoring** and logging
6. **Enable HTTPS** for production

## 🎉 You're All Set!

Your complete UPI payment app is ready to use. Happy coding!

---

**Need Help?**
1. Check the README.md files for detailed docs
2. Look at error messages in browser console (frontend) or terminal (backend)
3. Verify environment variables are set correctly
4. Make sure both servers are running

**Questions about UPI?**
- Visit: https://www.upi.org.in
- Check: https://www.npci.org.in
