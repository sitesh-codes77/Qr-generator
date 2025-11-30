# UPI Payment Application - Frontend

## Overview
This is a React-based frontend for a secure MERN-stack UPI payment application. It provides a mobile-first interface for users to authenticate, input payment amounts, scan UPI QR codes, and initiate payments.

## Features
- **Secure Authentication**: JWT-based login with automatic persistence
- **Mobile-First Design**: Responsive and optimized for mobile devices
- **QR Code Scanner**: Real-time QR code detection using camera
- **Amount Input**: Quick amount selection and custom input
- **Auto-Redirect**: Automatic UPI app redirection with pre-filled amounts
- **Protected Routes**: Authentication guards for secure pages
- **Tailwind CSS**: Modern, utility-first styling

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## Installation

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already present):
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## Running the Application

Development mode:
```bash
npm start
```

Build for production:
```bash
npm build
```

The app will start on `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html           # HTML entry point
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js        # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.js           # Global auth state
│   ├── pages/
│   │   ├── LoginPage.js             # Login/Register page
│   │   ├── DashboardPage.js         # Home page after login
│   │   ├── AmountInputPage.js       # Amount selection page
│   │   ├── QRScannerPage.js         # QR code scanner page
│   │   └── PaymentRedirectPage.js   # Payment confirmation page
│   ├── services/
│   │   └── api.js                   # API service and auth helpers
│   ├── utils/
│   │   └── useAuth.js               # Auth context hook
│   ├── App.js                       # Main app component with routing
│   ├── index.js                     # React entry point
│   ├── index.css                    # Global styles
│   ├── .env                         # Environment variables
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## User Flow

1. **Login Page** (`/login`)
   - Enter UPI ID and password
   - First-time users: Account created and stored
   - Returning users: Authenticated with stored credentials
   - Token stored in localStorage

2. **Dashboard** (`/`)
   - Welcome message with user's UPI ID
   - Quick access to payment features
   - Logout button

3. **Amount Input** (`/amount`)
   - Enter custom amount or use quick buttons
   - Validation: ₹1 - ₹100,000
   - Proceed to QR scanner

4. **QR Scanner** (`/scanner`)
   - Real-time camera access for QR scanning
   - Parse UPI QR code
   - Auto-detect and validate UPI format
   - Retry or go back options

5. **Payment Redirect** (`/payment-redirect`)
   - Display payment details
   - Auto-redirect to UPI app (or manual button)
   - Pre-filled amount in UPI app

## Key Components

### AuthContext
Manages global authentication state:
- User information
- Authentication status
- Login/logout functions
- Automatic token persistence

### ProtectedRoute
Wraps routes that require authentication:
- Redirects unauthenticated users to login
- Shows loading state while checking auth
- Prevents unauthorized access

### QR Scanner
Uses `html5-qrcode` library:
- Real-time video stream
- Automatic QR detection
- Error handling for invalid QR codes
- Pause/resume functionality

## API Integration

All API calls go through `src/services/api.js`:

```javascript
// Authentication
authAPI.registerOrLogin(upiId, password)
authAPI.verify()
authAPI.getUPI()
authAPI.logout()

// Payments
paymentAPI.generatePaymentLink(upiId, amount)
paymentAPI.parseQRCode(qrData)
paymentAPI.initiatePayment(scannedUPI, amount)
```

## Security Features

1. **JWT Token Storage**: Stored in localStorage
2. **Token Auto-Cleanup**: Removed on logout
3. **Protected Routes**: Auth verification before access
4. **Input Validation**: Client-side validation of all inputs
5. **Secure API Communication**: Authorization headers on all requests
6. **XSS Protection**: React escapes user data by default

## Styling

Tailwind CSS for:
- Mobile-first responsive design
- Utility-based styling
- Dark mode support ready
- Consistent color scheme (Blue theme)

Color scheme:
- Primary: Blue (600-800)
- Success: Green (600-800)
- Error: Red (600-800)
- Neutral: Gray (100-900)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Mobile Considerations

1. **Camera Permission**: Required for QR scanning
   - iOS: Asks on first scan
   - Android: Handled by `html5-qrcode`

2. **Touch Optimization**: All buttons sized for touch (min 44px)

3. **Responsive Design**: Adapts from mobile to tablet/desktop

4. **Viewport Meta**: Set for mobile scaling

## Troubleshooting

1. **Camera Not Working**
   - Check browser permissions
   - HTTPS required (or localhost)
   - Ensure `html5-qrcode` is properly installed

2. **API Connection Error**
   - Verify backend is running on port 5000
   - Check `REACT_APP_API_BASE_URL` in `.env`
   - Check browser console for CORS errors

3. **Login Token Not Persisting**
   - Verify localStorage is not disabled
   - Check if incognito/private mode is enabled

4. **QR Code Not Scanning**
   - Ensure good lighting
   - QR code must be UPI format (`upi://...`)
   - Try different QR codes for testing

5. **Build Errors**
   - Delete `node_modules` and run `npm install` again
   - Clear npm cache: `npm cache clean --force`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |

## Testing

For manual testing:

1. **Test UPI QR Code**: Use merchant/vendor QR codes
2. **Test Amounts**: Try ₹1, ₹100, ₹10000, ₹100001 (invalid)
3. **Test Auth**: Create new account, logout, log back in
4. **Test Persistence**: Reload page while logged in (should stay logged in)

### Sample Test Credentials
```
UPI ID: testuser@paytm
Password: Test@123456
```

## Performance Optimization

1. **Code Splitting**: Routes loaded on demand
2. **Lazy Loading**: Components loaded as needed
3. **Memoization**: Prevents unnecessary re-renders
4. **Image Optimization**: Use next-gen formats when possible

## PWA (Progressive Web App)

Current setup supports PWA features:
- Add to homescreen capability
- Offline support (with service workers)
- Install prompt on compatible browsers

To enable service workers:
```javascript
// In index.js
serviceWorkerRegistration.register();
```

## Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Drag and drop 'build' folder to Netlify
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Future Enhancements

1. Biometric authentication (fingerprint/face)
2. Payment history
3. Favorites/saved recipients
4. Theme customization
5. Multi-language support
6. Offline QR scanner
7. Receipt generation
8. Dark mode

## Support & Documentation

- Backend Documentation: See `backend/README.md`
- API Documentation: See `backend/README.md` API section
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- html5-qrcode: https://github.com/mebjas/html5-qrcode
