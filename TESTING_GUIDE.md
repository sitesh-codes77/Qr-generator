# QR Scanner Inline Feature - Testing Guide

## Current Status
✅ **Backend**: Running on `http://localhost:5000`
✅ **Frontend**: Running on alternative port (check terminal output, likely 3001+)
✅ **MongoDB**: Connected to `localhost:27017`

## How to Find Your Frontend Port
1. Check the frontend terminal output
2. Look for: "Compiled successfully" or "webpack compiled"
3. It will show the URL: `http://localhost:PORT`

## Step-by-Step Testing

### 1. Access the Application
```
http://localhost:PORT/
```
(Replace PORT with actual port from terminal)

### 2. Authentication
- The app has a login/signup system
- Create an account or login with test credentials
- You'll be redirected to the Amount Input Page

### 3. Test the Inline QR Scanner

#### **Test Case 1: Valid Amount Entry**
1. Enter amount: **₹500**
2. Click "Scan QR Code" button
3. **Expected Result**: QR scanner appears on the same page below the input
4. Scanner shows: "Position QR code within the frame to scan"

#### **Test Case 2: Quick Amount Selection**
1. Click any quick amount button (₹100, ₹500, ₹1000)
2. Amount auto-fills in the input field
3. Click "Scan QR Code" button
4. **Expected Result**: Scanner appears inline

#### **Test Case 3: Validation - No Amount**
1. Leave amount empty
2. Click "Scan QR Code" button
3. **Expected Result**: Error: "Please enter a valid amount"
4. Scanner should NOT appear

#### **Test Case 4: Validation - Invalid Amount**
1. Enter amount: **₹150,000** (exceeds limit)
2. Click "Scan QR Code" button
3. **Expected Result**: Error: "Amount cannot exceed ₹100,000"
4. Try again with **₹50,000**
5. Scanner should appear successfully

### 4. Test QR Code Scanning

#### **To Test Scanner (requires UPI QR code)**
1. Have a UPI QR code ready (from any UPI app or device)
2. Position it in front of the camera
3. Move it within the 250x250 scanner frame
4. **Expected Result**: Scanner detects QR code
5. Payment process initiates
6. You're redirected to payment confirmation page

#### **If Scanner Doesn't Activate**
1. Check browser console for errors (F12 → Console tab)
2. Verify camera permissions are granted
3. Try "Try Again" button to reset scanner
4. Check lighting conditions

### 5. Error Recovery

#### **Test Case: Invalid QR Code**
1. Show a non-UPI QR code to scanner
2. **Expected Result**: Error message appears
3. "Try Again" button visible
4. Click "Try Again" to reset scanner
5. Scanner resumes operation

#### **Test Case: No Camera Permission**
1. If browser asks for camera access, **Deny**
2. **Expected Result**: Error: "Failed to initialize camera. Please check permissions"
3. Grant camera permission in browser settings
4. Refresh page and try again

### 6. Cancel Scanner

#### **Test Case: Cancel Scanning**
1. After scanner appears, click "Cancel Scanner" button
2. **Expected Result**: Scanner disappears
3. You're back to the amount input form
4. Can enter a new amount or click "Scan QR Code" again

## Performance Expectations

| Action | Expected Time |
|--------|---|
| Page Load | < 2 seconds |
| Scanner Initialize | 1-2 seconds |
| QR Detection | Real-time (usually < 1 second) |
| Payment API Call | 1-3 seconds |
| Redirect to Payment Page | < 1 second |

## Debugging Tips

### Browser Console Errors
Press `F12` → Go to **Console** tab to check for errors

### Common Issues
| Issue | Solution |
|-------|----------|
| Scanner not showing | Check if amount is valid (₹1-₹100,000) |
| QR code not detected | Ensure good lighting, position QR in center |
| "Failed to initialize camera" | Check camera permissions in browser |
| No response after scan | Verify backend is running on port 5000 |
| Stuck on loading | Check network tab for failed API calls |

### Check Backend Connection
Open browser DevTools (F12) → Network tab
When you scan a QR code:
- You should see API call to: `/api/parse-qr` or `/api/initiate-payment`
- Response should be: `200 OK` or `201 Created`

## Success Indicators

✅ All tests pass successfully when:
- Inline scanner appears without page navigation
- QR code detection works with actual UPI codes
- Payment flow completes successfully
- Error messages display correctly
- Camera permissions work properly
- Retry functionality works after errors

## Next Steps

If all tests pass:
1. Test with actual UPI payments (if integrated)
2. Test on different devices/cameras
3. Test in different lighting conditions
4. Performance optimization if needed

---

**Last Updated**: After QR Scanner Inline Implementation
**Feature Status**: ✅ Ready for Testing
