import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { paymentAPI } from '../services/api';

const QRScannerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const amount = location.state?.amount;
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const [scannedUPI, setScannedUPI] = useState('');
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  useEffect(() => {
    if (!amount) {
      navigate('/amount');
      return;
    }

    if (!scannerRef.current) return;

    const initScanner = async () => {
      try {
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          false
        );

        scannerInstanceRef.current = scanner;

        scanner.render(
          (decodedText) => {
            handleScan(decodedText);
          },
          (error) => {
            console.log('QR scan error (non-critical):', error);
          }
        );
      } catch (err) {
        console.error('Scanner initialization error:', err);
        setError('Failed to initialize camera. Please check permissions.');
      }
    };

    initScanner();

    return () => {
      if (scannerInstanceRef.current) {
        try {
          scannerInstanceRef.current.clear();
        } catch (err) {
          console.log('Scanner cleanup error:', err);
        }
      }
    };
  }, [amount, navigate]);

  const handleScan = async (decodedText) => {
    setScanning(false);
    setScannedUPI(decodedText);
    setError('');

    try {
      // Stop the scanner
      if (scannerInstanceRef.current) {
        await scannerInstanceRef.current.pause();
      }

      // Parse QR code
      const parseResponse = await paymentAPI.parseQRCode(decodedText);
      
      if (!parseResponse.success) {
        setError(parseResponse.message || 'Invalid QR code');
        setScanning(true);
        if (scannerInstanceRef.current) {
          await scannerInstanceRef.current.resume();
        }
        return;
      }

      // Initiate payment
      const paymentResponse = await paymentAPI.initiatePayment(decodedText, amount);

      if (paymentResponse.success) {
        // Redirect to UPI app with deep link
        window.location.href = paymentResponse.paymentLink;

        // Fallback - show redirect page
        setTimeout(() => {
          navigate('/payment-redirect', {
            state: {
              paymentLink: paymentResponse.paymentLink,
              upiId: paymentResponse.upiId,
              amount: paymentResponse.amount,
              transactionRef: paymentResponse.transactionRef,
            },
          });
        }, 1000);
      } else {
        setError(paymentResponse.message || 'Failed to initiate payment');
        setScanning(true);
        if (scannerInstanceRef.current) {
          await scannerInstanceRef.current.resume();
        }
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'An error occurred');
      setScanning(true);
      if (scannerInstanceRef.current) {
        try {
          await scannerInstanceRef.current.resume();
        } catch (resumeErr) {
          console.log('Resume error:', resumeErr);
        }
      }
    }
  };

  const handleRetry = async () => {
    setScanning(true);
    setError('');
    setScannedUPI('');
    if (scannerInstanceRef.current) {
      try {
        await scannerInstanceRef.current.resume();
      } catch (err) {
        console.log('Resume error:', err);
      }
    }
  };

  const handleManualEntry = () => {
    if (scannedUPI) {
      navigate('/payment-redirect', {
        state: {
          upiId: scannedUPI,
          amount: amount,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Scan QR Code
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Amount: <span className="text-2xl font-bold text-blue-600">₹{amount}</span>
        </p>

        {/* QR Reader */}
        <div
          ref={scannerRef}
          id="qr-reader"
          className="w-full mb-6 rounded-lg overflow-hidden border-2 border-gray-300"
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Scanned Result */}
        {scannedUPI && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">QR Scanned Successfully!</p>
            <p className="text-sm mt-1">UPI: {scannedUPI}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          {!scanning && (
            <>
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Scan Again
              </button>
              <button
                onClick={() => navigate('/amount')}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Change Amount
              </button>
            </>
          )}
          {scanning && (
            <button
              onClick={() => navigate('/amount')}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700 mt-6">
          <p>📱 Point your camera at any UPI QR code to scan.</p>
          <p className="mt-2 text-xs">Make sure lighting is good for faster scanning.</p>
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;
