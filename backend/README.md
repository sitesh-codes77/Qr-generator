# UPI Payment Application - Backend

## Overview
This is the backend server for a secure MERN-stack UPI payment application. It handles user authentication, UPI ID management, QR code parsing, and payment link generation.

## Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Using bcryptjs for secure password storage
- **MongoDB Integration**: Persistent data storage
- **UPI Deep Linking**: Generate payment URLs with pre-filled amounts
- **Rate Limiting**: Protect against abuse
- **CORS Support**: Secure cross-origin requests
- **Input Validation**: Comprehensive validation of all inputs

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/upi-payment-app
JWT_SECRET=your-secure-secret-key-change-this
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

**POST /api/auth/register-or-login**
- Register new user or login existing user
- Body: `{ "upiId": "user@bank", "password": "secure-password" }`
- Response: `{ "token": "jwt-token", "user": {...}, "message": "..." }`

**GET /api/auth/verify**
- Verify JWT token and get user info
- Headers: `Authorization: Bearer <token>`
- Response: `{ "user": {...}, "message": "User verified" }`

**GET /api/auth/upi**
- Get authenticated user's UPI ID
- Headers: `Authorization: Bearer <token>`
- Response: `{ "upiId": "user@bank" }`

**POST /api/auth/logout**
- Logout user (client removes token)
- Headers: `Authorization: Bearer <token>`

### Payment

**POST /api/payment/generate-link**
- Generate UPI payment deep link
- Headers: `Authorization: Bearer <token>`
- Body: `{ "upiId": "payee@bank", "amount": 500 }`
- Response: `{ "success": true, "data": { "deepLink": "upi://...", "amount": "500.00", ... } }`

**POST /api/payment/parse-qr**
- Parse QR code and extract UPI details
- Headers: `Authorization: Bearer <token>`
- Body: `{ "qrData": "upi://pay?pa=..." }`
- Response: `{ "success": true, "data": { "upiId": "...", "payeeName": "...", ... } }`

**POST /api/payment/initiate**
- Parse QR and generate payment link with amount
- Headers: `Authorization: Bearer <token>`
- Body: `{ "scannedUPI": "upi://pay?pa=...", "amount": 500 }`
- Response: `{ "success": true, "paymentLink": "upi://...", "amount": "500.00", ... }`

**GET /api/health**
- Health check endpoint
- Response: `{ "message": "Server is running" }`

## Security Features

1. **Password Hashing**: Bcryptjs with salt rounds = 10
2. **JWT Tokens**: 7-day expiration by default
3. **Rate Limiting**: 100 requests per 15 minutes
4. **Input Validation**: Using express-validator
5. **Helmet.js**: Security headers
6. **CORS**: Restricted to specified origin
7. **Data Sanitization**: All inputs are sanitized and validated
8. **Error Handling**: Generic error messages to prevent information leakage

## Database Schema

### User Model
```javascript
{
  upiId: String (unique, lowercase),
  passwordHash: String,
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean,
  updatedAt: Date,
  timestamps: true
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/upi-payment-app` |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests in window | `100` |

## File Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   └── User.js              # User schema and model
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── paymentController.js # Payment logic
├── routes/
│   ├── auth.js              # Auth endpoints
│   └── payment.js           # Payment endpoints
├── middleware/
│   ├── auth.js              # JWT verification
│   └── validation.js        # Input validation
├── utils/
│   ├── tokenUtils.js        # JWT utilities
│   └── upiDeepLink.js       # UPI URL generation and parsing
├── .env.example             # Environment template
├── package.json
└── server.js                # Main server file
```

## Troubleshooting

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access if using MongoDB Atlas

2. **Port Already in Use**
   - Change `PORT` in `.env`
   - Or kill process: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)

3. **JWT Verification Failed**
   - Check `JWT_SECRET` matches on client
   - Verify token is not expired
   - Ensure token is being sent in Authorization header

4. **CORS Errors**
   - Update `CORS_ORIGIN` in `.env` to match frontend URL
   - Make sure credentials header is set

## Security Recommendations

1. Change `JWT_SECRET` in production to a complex random string
2. Use environment variables for all sensitive data
3. Set `NODE_ENV=production` in production
4. Use HTTPS in production
5. Implement additional logging and monitoring
6. Regularly update dependencies
7. Implement rate limiting per IP for production
8. Add request logging for audit trail

## Performance Optimization

1. Use MongoDB indexing on frequently queried fields
2. Implement caching for UPI validation
3. Use connection pooling
4. Add request compression

## Future Enhancements

1. Email verification
2. Payment history logging
3. Transaction analytics
4. Multi-user support with permissions
5. API key management
6. Webhook support for payment notifications
7. Database encryption
8. Audit logging
