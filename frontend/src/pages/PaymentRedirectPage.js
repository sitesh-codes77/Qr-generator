import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentRedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentLink, upiId, amount, transactionRef } = location.state || {};

  useEffect(() => {
    if (paymentLink) {
      // Automatically redirect after 2 seconds
      const timer = setTimeout(() => {
        window.location.href = paymentLink;
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [paymentLink]);

  const handleManualRedirect = () => {
    if (paymentLink) {
      window.location.href = paymentLink;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Ready
        </h1>
        <p className="text-gray-600 mb-6">
          Redirecting to your UPI app...
        </p>

        {/* Payment Details */}
        {(upiId || amount) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            {upiId && (
              <div className="mb-3">
                <p className="text-gray-600 text-sm">Payee UPI ID</p>
                <p className="text-lg font-semibold text-gray-800">{upiId}</p>
              </div>
            )}
            {amount && (
              <div>
                <p className="text-gray-600 text-sm">Amount</p>
                <p className="text-2xl font-bold text-blue-600">₹{amount}</p>
              </div>
            )}
          </div>
        )}

        {/* Manual Redirect Button */}
        <button
          onClick={handleManualRedirect}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mb-4"
        >
          Open UPI App Now
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate('/amount')}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Back to Amount
        </button>

        {/* Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-700 mt-6">
          <p>💡 Your UPI app will open with the amount pre-filled. Complete the payment there.</p>
          {transactionRef && (
            <p className="mt-2 text-xs">Reference: {transactionRef}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentRedirectPage;
