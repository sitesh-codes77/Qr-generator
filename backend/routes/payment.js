const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/auth');
const { validateAmount, handleValidationErrors } = require('../middleware/validation');

// POST /api/payment/generate-link
router.post('/generate-link', authenticate, validateAmount(), handleValidationErrors, paymentController.generatePaymentLink);

// POST /api/payment/parse-qr
router.post('/parse-qr', authenticate, paymentController.parseQRCode);

// POST /api/payment/initiate
router.post('/initiate', authenticate, validateAmount(), handleValidationErrors, paymentController.initiatePayment);

module.exports = router;
