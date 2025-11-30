import React from 'react';
import { useAuth } from '../utils/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const handleStartPayment = () => {
    navigate('/amount');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">UPI Payment</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8 min-h-screen">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back!
            </h2>
            <p className="text-gray-600 mt-2">
              {user?.upiId || 'User'}
            </p>
          </div>

          {/* Quick Actions */}
          <button
            onClick={handleStartPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg transition duration-200 mb-4 text-lg"
          >
            💳 Make Payment
          </button>

          {/* User Info Card */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Account Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">UPI ID</p>
                <p className="text-gray-800 font-semibold">{user?.upiId}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Member Since</p>
                <p className="text-gray-800 font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700 mt-6">
            <p>🔒 Your account is secure. You'll be automatically logged in on future visits.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
