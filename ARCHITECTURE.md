# 🏛️ Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Port 3000)                 │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐│ │
│  │  │  Login   │  │ Dashboard│  │  QR Scanner &        ││ │
│  │  │  Page    │→ │          │→ │  Payment Features    ││ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘│ │
│  │                      ↓                                   │ │
│  │          (JWT Token in localStorage)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                    │
│                   HTTP/REST API                              │
│                   (Axios calls)                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
          ┌───────────────────────────────────┐
          │   Express Backend (Port 5000)      │
          │                                     │
          │  ┌────────────────────────────┐   │
          │  │  Auth Routes               │   │
          │  │  - Register/Login          │   │
          │  │  - Verify Token            │   │
          │  │  - Get UPI                 │   │
          │  └────────────────────────────┘   │
          │           ↓                        │
          │  ┌────────────────────────────┐   │
          │  │  Payment Routes            │   │
          │  │  - Generate Deep Link      │   │
          │  │  - Parse QR Code           │   │
          │  │  - Initiate Payment        │   │
          │  └────────────────────────────┘   │
          │           ↓                        │
          │  ┌────────────────────────────┐   │
          │  │  Middleware & Utils        │   │
          │  │  - JWT Authentication      │   │
          │  │  - Input Validation        │   │
          │  │  - UPI Deep Link Gen       │   │
          │  │  - Rate Limiting           │   │
          │  │  - Security Headers        │   │
          │  └────────────────────────────┘   │
          └───────────────────────────────────┘
                       ↓
          ┌────────────────────────────┐
          │  MongoDB Database          │
          │  ┌──────────────────────┐  │
          │  │ User Collection      │  │
          │  │ - upiId (unique)     │  │
          │  │ - passwordHash       │  │
          │  │ - createdAt          │  │
          │  │ - lastLogin          │  │
          │  └──────────────────────┘  │
          └────────────────────────────┘
```

## Data Flow Diagram

### Registration/Login Flow
```
1. User enters UPI ID + Password
   ↓
2. POST /api/auth/register-or-login
   ↓
3. Backend:
   - Sanitizes input
   - Checks if user exists
   - If not: Hash password + Create user
   - If yes: Verify password
   ↓
4. Generate JWT token
   ↓
5. Send token + user data to frontend
   ↓
6. Frontend stores token in localStorage
   ↓
7. Redirect to dashboard
```

### Payment Flow
```
1. User enters amount
   ↓
2. Frontend validates: ₹1 to ₹100,000
   ↓
3. Navigate to QR scanner
   ↓
4. User scans UPI QR code
   ↓
5. Frontend sends to backend:
   POST /api/payment/parse-qr
   ↓
6. Backend:
   - Validates QR format
   - Extracts UPI ID
   ↓
7. Generates UPI deep link:
   upi://pay?pa=payee@bank&amount=500&...
   ↓
8. Redirects browser to UPI app
   ↓
9. UPI app opens with amount pre-filled
   ↓
10. User completes payment in UPI app
```

### Auto-Login Flow
```
1. User visits app for 2nd time
   ↓
2. Frontend checks localStorage for token
   ↓
3. Token exists:
   - Send GET /api/auth/verify with token
   ↓
4. Backend verifies JWT signature
   ↓
5. Token valid:
   - Return user data
   - Frontend auto-logs in
   - Redirect to dashboard
   ↓
6. Token invalid/expired:
   - Clear localStorage
   - Redirect to login
```

## Authentication Architecture

### JWT Token Structure
```
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI2M2YzYTBhNDAxMjM0NTZkN2I4OWFiYzEiLCJ1cGlJZCI6InVzZXJAYmFuayIsImlhdCI6MTY3NzY1NDMyMCwiZXhwIjoxNjc4MjU5MTIwfQ.
dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFvJxg0

Payload decoded:
{
  "userId": "63f3a0a40123456d7b89abc1",
  "upiId": "user@bank",
  "iat": 1677654320,    (issued at)
  "exp": 1678259120     (expiration)
}
```

### Security Flow
```
Client Request:
GET /api/auth/verify
Authorization: Bearer <token>
↓
Backend Middleware (auth.js):
1. Extract token from header
2. Verify JWT signature with JWT_SECRET
3. Check expiration
4. Extract user ID from payload
5. Attach to req.user
6. Allow request to continue
↓
If valid: Request processed
If invalid: Return 401 Unauthorized
```

## Password Security

### Hashing Flow
```
User enters password: "MyPassword123"
                      ↓
         bcryptjs.hash(password, 10)
         (10 = salt rounds)
                      ↓
         Generate 16-byte random salt
                      ↓
         Hash password 10 times
                      ↓
         Stored in DB:
         $2b$10$abcdefghijklmnopqrstuvwxyz...
                      ↓
         Next login:
         bcryptjs.compare(entered, hashed)
                      ↓
         Returns: true/false
```

## UPI Deep Link Generation

### QR Code Parsing
```
Scanned QR:
upi://pay?pa=merchant@bank&pn=Store&tn=Purchase

Parsed into:
{
  upiId: "merchant@bank",
  payeeName: "Store",
  description: "Purchase"
}
```

### Deep Link Creation
```
Input:
- upiId: "payee@bank"
- amount: 500

Generated:
upi://pay?pa=payee%40bank&pn=User&tn=Payment&tr=TXN1677654320&am=500.00

When opened:
→ UPI app detects scheme (upi://)
→ Extracts parameters
→ Pre-fills payment form
→ User confirms and pays
```

## Security Layers

### Layer 1: Input Validation
```javascript
// Frontend
- UPI format: regex match
- Amount: min/max checks
- Type validation

// Backend
- Double validation (don't trust frontend)
- Sanitization
- Express-validator rules
```

### Layer 2: Authentication
```javascript
// Registration
- Hash password with bcryptjs
- Store hashed version only

// Login
- Compare entered password with hash
- Generate JWT if match
- Token valid for 7 days

// Protected Routes
- Check Authorization header
- Verify JWT signature
- Validate expiration
```

### Layer 3: Rate Limiting
```javascript
// Per IP:
- Max 100 requests per 15 minutes
- Blocks excessive requests
- Prevents brute force
```

### Layer 4: Headers & CORS
```javascript
// Security Headers (Helmet)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Content-Security-Policy
- HSTS

// CORS
- Only allow specified origin
- Credentials allowed
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "deepLink": "upi://pay?...",
    "amount": "500.00",
    "transactionRef": "TXN1677654320"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Generic error message",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be between 1 and 100000"
    }
  ]
}
```

## Database Indexes

For optimal performance:

```javascript
// In User model (create these manually if needed):
db.users.createIndex({ "upiId": 1 }, { unique: true })
db.users.createIndex({ "createdAt": 1 })
db.users.createIndex({ "lastLogin": 1 })
```

## Performance Considerations

1. **Database**
   - Use MongoDB indexing
   - Avoid N+1 queries
   - Connection pooling (default in Mongoose)

2. **API**
   - Limit request size to 10KB
   - Rate limiting enabled
   - Error responses optimized

3. **Frontend**
   - JWT stored locally (no server session)
   - Routes lazy-loaded
   - Components memoized

4. **Caching**
   - JWT tokens valid for 7 days
   - No server-side session storage needed
   - Browser cache for static assets

## Scalability Path

### Phase 1 (Current)
- Single user per browser
- Local authentication
- Direct QR scanning

### Phase 2
- Multi-user support
- Payment history
- User profiles

### Phase 3
- Admin dashboard
- Analytics
- Payment webhooks

### Phase 4
- Distributed system
- Database replication
- Load balancing
- Microservices

## Error Handling Strategy

```javascript
// Validation errors
400 Bad Request: Invalid input

// Authentication errors
401 Unauthorized: Invalid/expired token
403 Forbidden: Not allowed

// Not found
404 Not Found: Resource doesn't exist

// Server errors
500 Internal Server Error: Server issue

// Rate limiting
429 Too Many Requests: Exceeded rate limit
```

## Monitoring Points

1. **Backend Logs**
   - Authentication attempts
   - API errors
   - Rate limit hits

2. **Frontend Monitoring**
   - Console errors
   - Network failures
   - User actions

3. **Database Metrics**
   - Connection count
   - Query performance
   - Storage usage

---

This architecture provides a secure, scalable foundation for the UPI payment application.
