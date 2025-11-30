const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { validateUPIId, handleValidationErrors } = require('../middleware/validation');

// POST /api/auth/register-or-login
router.post('/register-or-login', validateUPIId(), handleValidationErrors, authController.registerOrLogin);

// GET /api/auth/verify
router.get('/verify', authenticate, authController.verifyAuth);

// GET /api/auth/upi
router.get('/upi', authenticate, authController.getUPI);

// POST /api/auth/logout
router.post('/logout', authenticate, authController.logout);

module.exports = router;
