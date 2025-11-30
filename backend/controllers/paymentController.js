const { generateUPIDeepLink, parseUPIQRCode } = require('../utils/upiDeepLink');

/**
 * Generate UPI payment deep link
 */
exports.generatePaymentLink = async (req, res) => {
  try {
    const { upiId, amount } = req.body;

    if (!upiId || !amount) {
      return res.status(400).json({ message: 'UPI ID and amount are required' });
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 100000) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Generate deep link
    const result = generateUPIDeepLink(upiId, parsedAmount, 'Payment from UPI App');

    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Payment link generation error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Parse QR code and extract UPI details
 */
exports.parseQRCode = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ message: 'QR data is required' });
    }

    // Parse QR code
    const result = parseUPIQRCode(qrData);

    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('QR parsing error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Validate UPI and generate complete payment link with amount
 */
exports.initiatePayment = async (req, res) => {
  try {
    const { scannedUPI, amount } = req.body;

    if (!scannedUPI || !amount) {
      return res.status(400).json({ message: 'Scanned UPI and amount are required' });
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 100000) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Parse UPI from QR
    const upiResult = parseUPIQRCode(scannedUPI);
    if (!upiResult.success) {
      return res.status(400).json({ message: 'Invalid QR code format' });
    }

    // Generate payment link
    const linkResult = generateUPIDeepLink(upiResult.upiId, parsedAmount, 'Payment');

    if (!linkResult.success) {
      return res.status(400).json({ message: linkResult.error });
    }

    return res.status(200).json({
      success: true,
      paymentLink: linkResult.deepLink,
      amount: linkResult.amount,
      upiId: linkResult.upiId,
      transactionRef: linkResult.transactionRef,
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
