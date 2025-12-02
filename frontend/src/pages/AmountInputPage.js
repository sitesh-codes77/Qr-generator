import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { authAPI } from '../services/api';

const AmountInputPage = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [userUPI, setUserUPI] = useState('');

  // Get user's UPI ID on mount
  useEffect(() => {
    const fetchUPI = async () => {
      try {
        const response = await authAPI.getUPI();
        if (response.upiId) {
          setUserUPI(response.upiId);
        }
      } catch (err) {
        console.error('Failed to fetch UPI:', err);
      }
    };

    fetchUPI();
  }, []);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setError('');
  };

  const generateQRCode = async () => {
    const parsedAmount = parseFloat(amount);

    // Validation
    if (!amount || isNaN(parsedAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (parsedAmount > 100000) {
      setError('Amount cannot exceed ₹100,000');
      return;
    }

    if (!userUPI) {
      setError('Unable to fetch your UPI ID');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Generate proper UPI deep link
      // Format: upi://pay?pa=RECEIVER_UPI&pn=RECEIVER_NAME&am=AMOUNT&tn=TRANSACTION_NOTE&tr=TRANSACTION_REF
      const merchantName = userUPI.split('@')[0].toUpperCase() || 'Merchant';
      const transactionNote = `Payment`;
      
      // Standard UPI format that mobile apps recognize
      const upiString = `upi://pay?pa=${userUPI}&pn=${encodeURIComponent(merchantName)}&am=${parsedAmount}&tn=${encodeURIComponent(transactionNote)}&tr=${Date.now()}`;
      
      setQrValue(upiString);
      setShowQR(true);
    } catch (err) {
      console.error('QR generation error:', err);
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const toggleQR = () => {
    if (!showQR) {
      generateQRCode();
    } else {
      setShowQR(false);
      setQrValue('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Amount Input Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Enter Amount</h1>
          <p className="text-gray-600 text-center mb-6">₹1 - ₹100,000</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Amount Input */}
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg mb-6"
          />

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[100, 500, 1000].map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className="px-3 py-2 bg-gray-100 hover:bg-blue-100 text-gray-800 rounded-lg font-semibold transition"
              >
                ₹{value}
              </button>
            ))}
          </div>

          {/* Generate QR Button */}
          <button
            onClick={toggleQR}
            disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || loading}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : showQR ? (
              'Hide QR Code'
            ) : (
              'Generate QR Code'
            )}
          </button>
        </div>

        {/* QR Code Display Card */}
        {showQR && qrValue && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment QR Code</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Amount: <span className="text-xl font-bold text-blue-600">₹{amount}</span>
            </p>

            {/* QR Code */}
            <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg">
              <QRCodeCanvas
                value={qrValue}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-gray-600 text-sm mb-4">
              💡 Scan to pay
            </p>

            {/* Download Button */}
            <button
              onClick={() => {
                const canvas = document.querySelector('canvas');
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `payment-qr-${amount}.png`;
                link.click();
              }}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmountInputPage;
