import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [upiId, setUpiId] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!upiId || !password) {
      setLocalError('Please enter both UPI ID and password');
      return;
    }

    const result = await login(upiId, password);
    if (result.success) {
      // Redirect to dashboard after successful login
      navigate('/');
    } else {
      setLocalError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          UPI Payment
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in with your UPI ID
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error || localError}
            </div>
          )}

          {/* UPI ID Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@bank"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: yourupi@paytm or yourphone@upi
            </p>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a secure password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              This password secures your account. Use a strong password.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        </form>

        {/* Info Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            🔒 Your UPI ID is stored securely. This app uses encryption and JWT tokens for authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
