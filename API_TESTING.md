# 📋 API Testing Guide

Complete examples for testing all API endpoints using curl or Postman.

## Setup Before Testing

1. **Start Backend**:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

2. **Start MongoDB**:
```bash
mongod
# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

## Auth API

### 1. Register/Login (Get Token)

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register-or-login \
  -H "Content-Type: application/json" \
  -d '{
    "upiId": "testuser@paytm",
    "password": "Test@123456"
  }'
```

**First time:** Account created
**Second time (same UPI):** Logged in

**Response:**
```json
{
  "message": "Account created and logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "63f3a0a40123456d7b89abc1",
    "upiId": "testuser@paytm",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "lastLogin": "2024-01-15T10:00:00.000Z",
    "isActive": true
  }
}
```

**Save this token** for other requests. Replace `<TOKEN>` in examples below.

---

### 2. Verify Authentication Token

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer <TOKEN>"
```

**Response:**
```json
{
  "message": "User verified",
  "user": {
    "_id": "63f3a0a40123456d7b89abc1",
    "upiId": "testuser@paytm",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "lastLogin": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 3. Get User's UPI ID

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/upi \
  -H "Authorization: Bearer <TOKEN>"
```

**Response:**
```json
{
  "upiId": "testuser@paytm"
}
```

---

### 4. Logout

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <TOKEN>"
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Payment API

### 1. Generate Payment Link

**Request:**
```bash
curl -X POST http://localhost:5000/api/payment/generate-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "upiId": "payee@paytm",
    "amount": 500
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "deepLink": "upi://pay?pa=payee%40paytm&pn=User&tn=Payment+from+UPI+App&tr=TXN1705313200000&am=500.00",
    "transactionRef": "TXN1705313200000",
    "amount": "500.00",
    "upiId": "payee@paytm"
  }
}
```

**Test Various Amounts:**
```bash
# ₹100
curl -X POST http://localhost:5000/api/payment/generate-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"upiId":"payee@bank","amount":100}'

# ₹10000
curl -X POST http://localhost:5000/api/payment/generate-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"upiId":"payee@bank","amount":10000}'

# ₹50000 (Large amount)
curl -X POST http://localhost:5000/api/payment/generate-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"upiId":"payee@bank","amount":50000}'
```

---

### 2. Parse QR Code

**Request (with sample QR data):**
```bash
curl -X POST http://localhost:5000/api/payment/parse-qr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "qrData": "upi://pay?pa=merchant@okhdfcbank&pn=MerchantName&tn=Payment&tr=TXN123&am=100"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "upiId": "merchant@okhdfcbank",
    "payeeName": "MerchantName",
    "description": "Payment",
    "transactionRef": "TXN123"
  }
}
```

**Test Invalid QR:**
```bash
# Non-UPI QR code
curl -X POST http://localhost:5000/api/payment/parse-qr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"qrData":"https://example.com"}'

# Response: error message
{
  "success": false,
  "message": "Not a valid UPI QR code"
}
```

---

### 3. Initiate Full Payment (Parse QR + Generate Link)

**Request:**
```bash
curl -X POST http://localhost:5000/api/payment/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "scannedUPI": "upi://pay?pa=payee@bank&pn=Payee&tn=Payment",
    "amount": 500
  }'
```

**Response:**
```json
{
  "success": true,
  "paymentLink": "upi://pay?pa=payee%40bank&pn=User&tn=Payment&tr=TXN1705313200000&am=500.00",
  "amount": "500.00",
  "upiId": "payee@bank",
  "transactionRef": "TXN1705313200000"
}
```

---

### 4. Health Check

**Request:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Response:**
```json
{
  "message": "Server is running"
}
```

---

## Error Testing

### Invalid UPI ID

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register-or-login \
  -H "Content-Type: application/json" \
  -d '{
    "upiId": "invalid-upi",
    "password": "Test@123"
  }'
```

**Response (400 Bad Request):**
```json
{
  "errors": [
    {
      "location": "body",
      "msg": "Invalid UPI ID format",
      "param": "upiId"
    }
  ]
}
```

---

### Invalid Amount

**Request (amount too high):**
```bash
curl -X POST http://localhost:5000/api/payment/generate-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "upiId": "payee@bank",
    "amount": 500000
  }'
```

**Response (400 Bad Request):**
```json
{
  "errors": [
    {
      "location": "body",
      "msg": "Amount must be between 1 and 100000",
      "param": "amount"
    }
  ]
}
```

---

### Missing Token

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/verify
```

**Response (401 Unauthorized):**
```json
{
  "message": "No token provided"
}
```

---

### Expired/Invalid Token

**Request (with invalid token):**
```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer invalid-token-xyz"
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "UPI Payment API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Register/Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/register-or-login",
        "header": [
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "raw": "{\"upiId\":\"testuser@paytm\",\"password\":\"Test@123456\"}"
        }
      }
    },
    {
      "name": "Verify Token",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/auth/verify",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ]
      }
    },
    {
      "name": "Get UPI",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/auth/upi",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ]
      }
    },
    {
      "name": "Generate Payment Link",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/payment/generate-link",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "raw": "{\"upiId\":\"payee@bank\",\"amount\":500}"
        }
      }
    },
    {
      "name": "Parse QR Code",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/payment/parse-qr",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "raw": "{\"qrData\":\"upi://pay?pa=merchant@bank&pn=Merchant&tn=Payment\"}"
        }
      }
    },
    {
      "name": "Initiate Payment",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/payment/initiate",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "raw": "{\"scannedUPI\":\"upi://pay?pa=payee@bank\",\"amount\":500}"
        }
      }
    }
  ]
}
```

**Steps to use:**
1. Open Postman
2. Import → Paste JSON
3. After login request, copy token
4. Create environment variable: `token` = copied token
5. Use `{{token}}` in requests

---

## Test Scenarios

### Scenario 1: New User Registration
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register-or-login \
  -H "Content-Type: application/json" \
  -d '{"upiId":"newuser@bank","password":"SecurePass123"}'

# Save token from response

# 2. Verify Token Works
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer <TOKEN>"

# 3. Get UPI
curl -X GET http://localhost:5000/api/auth/upi \
  -H "Authorization: Bearer <TOKEN>"

# Expected: All succeed with correct user info
```

---

### Scenario 2: Complete Payment Flow
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/register-or-login \
  -H "Content-Type: application/json" \
  -d '{"upiId":"testuser@bank","password":"Test123"}' | jq -r '.token')

# 2. Generate Link
curl -X POST http://localhost:5000/api/payment/generate-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"upiId":"merchant@bank","amount":500}'

# 3. Parse QR
curl -X POST http://localhost:5000/api/payment/parse-qr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"qrData":"upi://pay?pa=merchant@bank&pn=Shop&tn=Payment"}'

# 4. Initiate Payment
curl -X POST http://localhost:5000/api/payment/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"scannedUPI":"upi://pay?pa=merchant@bank&pn=Shop","amount":500}'

# Expected: Get payment link with pre-filled amount
```

---

### Scenario 3: Error Handling
```bash
# Invalid amount (too low)
curl -X POST http://localhost:5000/api/payment/generate-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"upiId":"merchant@bank","amount":0}'
# Expected: 400 error

# Invalid amount (too high)
curl -X POST http://localhost:5000/api/payment/generate-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"upiId":"merchant@bank","amount":150000}'
# Expected: 400 error

# Missing token
curl -X GET http://localhost:5000/api/auth/verify
# Expected: 401 error

# Invalid UPI format
curl -X POST http://localhost:5000/api/auth/register-or-login \
  -H "Content-Type: application/json" \
  -d '{"upiId":"notaupi","password":"Test123"}'
# Expected: 400 error
```

---

## Performance Testing

### Load Test (10 requests)
```bash
for i in {1..10}; do
  curl -s -X GET http://localhost:5000/api/health | jq '.message'
done
```

### Rate Limit Test (exceed 100 requests in 15 min)
```bash
for i in {1..105}; do
  echo "Request $i"
  curl -s http://localhost:5000/api/health
  sleep 0.1
done
# After 100 requests: 429 error
```

---

## Debugging Tips

1. **View Full Response Headers**:
```bash
curl -i http://localhost:5000/api/health
```

2. **View Request/Response Details**:
```bash
curl -v http://localhost:5000/api/health
```

3. **Pretty Print JSON Response**:
```bash
curl -s http://localhost:5000/api/health | jq '.'
```

4. **Save Response to File**:
```bash
curl http://localhost:5000/api/health > response.json
```

5. **Check Server Logs**:
- Look at terminal where `npm run dev` is running
- Check for error messages and request logs

---

## Success Criteria

✅ All Auth endpoints respond
✅ All Payment endpoints respond  
✅ Tokens expire after 7 days
✅ Rate limiting works (429 after 100 req/15min)
✅ Invalid input returns 400
✅ Missing token returns 401
✅ Tokens are stored and retrievable

**Happy Testing!** 🚀
