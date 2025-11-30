import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AmountInputPage from './pages/AmountInputPage';
import QRScannerPage from './pages/QRScannerPage';
import PaymentRedirectPage from './pages/PaymentRedirectPage';
import './index.css';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/amount"
            element={
              <ProtectedRoute>
                <AmountInputPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/scanner"
            element={
              <ProtectedRoute>
                <QRScannerPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/payment-redirect"
            element={
              <ProtectedRoute>
                <PaymentRedirectPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
