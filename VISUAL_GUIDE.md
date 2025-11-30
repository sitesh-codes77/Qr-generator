# 🎨 Visual Guide - UPI Payment App

## User Interface Overview

### 1. Login Page
```
┌─────────────────────────────────┐
│     UPI Payment                 │
│  Sign in with your UPI ID       │
│                                 │
│  ┌──────────────────────────┐  │
│  │ UPI ID: yourname@bank    │  │
│  │ 🔤 Example: user@paytm   │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Password: ••••••••••••  │  │
│  │ 🔒 Secure password       │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │     [CONTINUE]           │  │
│  └──────────────────────────┘  │
│                                 │
│  🔐 Stored securely encrypted  │
└─────────────────────────────────┘
```

### 2. Dashboard
```
┌─────────────────────────────────┐
│  [MENU]  UPI Payment    [•••]   │
├─────────────────────────────────┤
│                                 │
│          👤                     │
│  Welcome back!                 │
│  testuser@paytm                │
│                                 │
│  ┌──────────────────────────┐  │
│  │   💳 MAKE PAYMENT        │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │   Account Info           │  │
│  │   UPI: testuser@paytm    │  │
│  │   Since: Jan 15, 2024    │  │
│  └──────────────────────────┘  │
│                                 │
│  🔒 Auto-logged in             │
│     You'll stay logged in next  │
│     time you visit              │
└─────────────────────────────────┘
```

### 3. Amount Input Page
```
┌─────────────────────────────────┐
│  Enter Amount                   │
│  How much do you want to pay?   │
│                                 │
│  ┌──────────────────────────┐  │
│  │ ₹│500.00                  │  │
│  └──────────────────────────┘  │
│                                 │
│  Quick amounts:                 │
│  ┌─┐┌─┐┌──┐┌──┐┌──┐┌─────┐   │
│  │₹││₹││₹ ││₹ ││₹ ││₹    │   │
│  │10││50││100││500││5K││10K  │   │
│  └─┘└─┘└──┘└──┘└──┘└─────┘   │
│                                 │
│  ┌──────────────────────────┐  │
│  │ [CONTINUE TO SCAN QR]    │  │
│  └──────────────────────────┘  │
│                                 │
│  ✓ Validated: ₹1 - ₹100,000   │
└─────────────────────────────────┘
```

### 4. QR Scanner Page
```
┌─────────────────────────────────┐
│  Scan QR Code                   │
│  Amount: ₹500                   │
│  ┌──────────────────────────┐  │
│  │┌────────────────────────┐│  │
│  ││                        ││  │
│  ││ 📷 CAMERA FEED        ││  │
│  ││                        ││  │
│  ││ ┌──────────┐          ││  │
│  ││ │ QR CODE  │          ││  │
│  ││ │ HERE     │          ││  │
│  ││ └──────────┘          ││  │
│  ││                        ││  │
│  │└────────────────────────┘│  │
│  └──────────────────────────┘  │
│                                 │
│  📱 Point at UPI QR code       │
│  Auto-detected when found      │
│                                 │
│  ┌──────────────────────────┐  │
│  │ [CANCEL]                 │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘

                  ↓ (Scans)

┌─────────────────────────────────┐
│  Scan QR Code                   │
│  Amount: ₹500                   │
│  ┌──────────────────────────┐  │
│  │ ✅ QR SCANNED!          │  │
│  │ UPI: merchant@bank      │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ [SCAN AGAIN] [CHANGE]    │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

### 5. Payment Redirect Page
```
┌─────────────────────────────────┐
│                                 │
│          ✅                     │
│  Payment Ready                 │
│  Redirecting to UPI app...     │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Payee UPI ID:            │  │
│  │ merchant@bank            │  │
│  │                          │  │
│  │ Amount:                  │  │
│  │ ₹500                     │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ [OPEN UPI APP NOW]       │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ [BACK TO AMOUNT]         │  │
│  └──────────────────────────┘  │
│                                 │
│  💡 Your UPI app will open     │
│     Amount pre-filled. Complete │
│     payment there.             │
└─────────────────────────────────┘

                  ↓ (Redirect)

    ┌────────────────────────┐
    │   Google Pay / Paytm   │
    │   PhonePe / BHIM etc   │
    │                        │
    │   Amount: ₹500         │
    │   Payee: merchant@bank │
    │                        │
    │   [CONFIRM PAYMENT]    │
    └────────────────────────┘
```

---

## Data Flow Diagram

### Authentication Flow
```
User enters UPI & Password
         ↓
   Frontend validates
         ↓
API request to backend
         ↓
Backend checks if UPI exists
         ├─ YES: Verify password
         │        ↓
         │    Match? → Generate JWT → Send token
         │
         └─ NO: Create user
              Hash password
              Store in DB
              Generate JWT
              Send token
         ↓
Frontend stores token
         ↓
Auto-login on next visit
```

### Payment Flow
```
User enters amount
         ↓
Frontend validates
         ↓
Navigate to QR scanner
         ↓
User scans QR code
         ↓
Extract UPI from QR
         ↓
Generate UPI deep link
  upi://pay?pa=...&am=500
         ↓
Browser receives link
         ↓
Redirect to UPI app
         ↓
UPI app opens
   Amount pre-filled
   Payee pre-filled
         ↓
User completes payment
```

---

## Technology Stack Visualization

```
┌──────────────────────────────────────────────────────────┐
│                 USER'S BROWSER                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │            React 18 Frontend                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │ │
│  │  │ Auth     │→ │ Dashboard│→ │ QR Scanner       │ │ │
│  │  │ Context  │  │ Pages    │  │ Components       │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │ │
│  │                                                    │ │
│  │  Styling:       State:           Libraries:       │ │
│  │  • Tailwind     • Context API    • html5-qrcode  │ │
│  │  • CSS          • React Hooks    • Axios         │ │
│  │  • Responsive   • localStorage   • React Router  │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
              HTTP/REST (JSON)
                    ↓
┌──────────────────────────────────────────────────────────┐
│              BACKEND SERVER (PORT 5000)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │           Express.js + Node.js                     │ │
│  │  ┌──────────┐  ┌─────────┐  ┌──────────────────┐ │ │
│  │  │ Routes   │→ │ Control │→ │ Utils & Logic    │ │ │
│  │  │ & APIs   │  │ lers    │  │ - JWT generation │ │ │
│  │  └──────────┘  └─────────┘  │ - UPI deep link  │ │ │
│  │                             │ - QR parsing     │ │ │
│  │  Middleware:                └──────────────────┘ │ │
│  │  • JWT auth   • Validation   • Rate limit       │ │
│  │  • CORS       • Security     • Error handling   │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
              MongoDB Protocol
                    ↓
        ┌────────────────────────┐
        │   MongoDB Database     │
        │                        │
        │  Users Collection      │
        │  - UPI ID (unique)     │
        │  - Password (hashed)   │
        │  - Timestamps          │
        │  - Login history       │
        │                        │
        └────────────────────────┘
```

---

## Security Layers

```
    User Input
        ↓
    [LAYER 1] Input Validation
        - Format check
        - Type check
        - Range check
        ↓
    [LAYER 2] Authentication
        - Check token
        - Verify JWT
        - Check expiration
        ↓
    [LAYER 3] Rate Limiting
        - Track requests
        - Block if > 100/15min
        ↓
    [LAYER 4] Sanitization
        - Clean input
        - Escape special chars
        - Remove threats
        ↓
    [LAYER 5] Processing
        - Business logic
        - Database ops
        ↓
    [LAYER 6] Response
        - Generic errors
        - Secure headers
        - CORS check
        ↓
    Safe Response to Client
```

---

## File Dependencies

```
Frontend:
  index.js → App.js → AuthProvider
         ├→ LoginPage
         ├→ DashboardPage
         ├→ AmountInputPage → QRScannerPage
         ├→ PaymentRedirectPage
         └→ api.js → API calls → Backend

Backend:
  server.js → Express app
         ├→ config/database.js → MongoDB
         ├→ routes/auth.js → authController.js
         │                ├→ models/User.js
         │                ├→ utils/tokenUtils.js
         │                └→ middleware/auth.js
         ├→ routes/payment.js → paymentController.js
         │                   ├→ utils/upiDeepLink.js
         │                   └→ middleware/validation.js
         └→ middleware → Helmet, CORS, rate-limit
```

---

## Deployment Architecture

```
Development:
┌─────────────┐         ┌─────────────┐
│ Frontend    │         │ Backend     │
│ localhost   │ ←→ REST │ localhost   │
│ :3000       │         │ :5000       │
└─────────────┘         └─────────────┘
                              ↓
                        ┌─────────────┐
                        │ MongoDB     │
                        │ localhost   │
                        └─────────────┘

Production:
┌─────────────────┐
│ Vercel/Netlify  │ (Frontend)
│ React App       │ https://app.example.com
└─────────────────┘
           ↓ HTTPS
┌─────────────────┐
│ Heroku/AWS      │ (Backend)
│ Express API     │ https://api.example.com
└─────────────────┘
           ↓
┌─────────────────┐
│ MongoDB Atlas   │ (Database)
│ Cloud Database  │ mongodb+srv://...
└─────────────────┘
```

---

## Response Examples

### Login Success
```json
{
  "message": "Account created and logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "63f3a0a40123456d7b89abc1",
    "upiId": "testuser@paytm",
    "createdAt": "2024-01-15T10:00:00Z",
    "lastLogin": "2024-01-15T10:00:00Z"
  }
}
```

### Payment Link Generated
```json
{
  "success": true,
  "data": {
    "deepLink": "upi://pay?pa=merchant%40bank&am=500.00",
    "transactionRef": "TXN1705313200000",
    "amount": "500.00"
  }
}
```

---

## Process Flow Chart

```
                    START
                      ↓
              [Is User Logged In?]
              /                    \
            NO                      YES
            ↓                        ↓
        LOGIN PAGE ← DASHBOARD
        Enter UPI      Make Payment
        + Password     ↓
            ↓      AMOUNT PAGE
        [Create/Check] Enter Amount
        Account        ↓
            ↓      QR SCANNER
        DASHBOARD     Scan Code
                      ↓
                  PAYMENT REDIRECT
                      ↓
                  UPI APP OPENS
                  (External)
                      ↓
                  USER PAYS
                      ↓
                    DONE ✓
```

---

**This visual guide helps understand the user interface, data flow, and architecture at a glance!**
