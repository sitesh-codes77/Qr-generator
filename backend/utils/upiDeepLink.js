/**
 * Generate UPI Deep Link URL
 * Format: upi://pay?pa=UPI_ID&pn=Payer_Name&tn=Description&tr=TransactionRef&am=Amount
 */
const generateUPIDeepLink = (upiId, amount, description = 'Payment') => {
  try {
    // Validate inputs
    if (!upiId || typeof upiId !== 'string') {
      throw new Error('Invalid UPI ID');
    }

    if (!amount || amount <= 0 || amount > 100000) {
      throw new Error('Invalid amount');
    }

    // Sanitize and format UPI ID
    const sanitizedUPI = String(upiId).trim().toLowerCase();

    // Validate UPI format
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(sanitizedUPI)) {
      throw new Error('Invalid UPI format');
    }

    // Format amount to 2 decimal places
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Generate unique transaction reference
    const transactionRef = `TXN${Date.now()}`;

    // Create deep link
    const deepLink = `upi://pay?pa=${encodeURIComponent(sanitizedUPI)}&pn=${encodeURIComponent('User')}&tn=${encodeURIComponent(description)}&tr=${transactionRef}&am=${formattedAmount}`;

    return {
      success: true,
      deepLink,
      transactionRef,
      amount: formattedAmount,
      upiId: sanitizedUPI,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Parse UPI QR Code Data
 * Common formats:
 * - upi://pay?pa=UPI_ID&pn=Name&tn=Description
 * - Dynamic QR codes may contain additional fields
 */
const parseUPIQRCode = (qrData) => {
  try {
    if (!qrData || typeof qrData !== 'string') {
      throw new Error('Invalid QR data');
    }

    // Check if it's a UPI URL
    if (!qrData.startsWith('upi://')) {
      throw new Error('Not a valid UPI QR code');
    }

    // Parse URL parameters
    const url = new URL(qrData);
    const params = url.searchParams;

    const upiId = params.get('pa');
    const payeeName = params.get('pn') || 'Unknown';
    const description = params.get('tn') || '';
    const transactionRef = params.get('tr') || null;

    if (!upiId) {
      throw new Error('UPI ID not found in QR code');
    }

    // Validate UPI format
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
      throw new Error('Invalid UPI format in QR code');
    }

    return {
      success: true,
      upiId: upiId.toLowerCase(),
      payeeName,
      description,
      transactionRef,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  generateUPIDeepLink,
  parseUPIQRCode,
};
