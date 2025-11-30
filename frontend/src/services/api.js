const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const removeToken = () => localStorage.removeItem('authToken');

export const authAPI = {
  registerOrLogin: async (upiId, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register-or-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ upiId, password }),
    });
    return response.json();
  },

  verify: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getUPI: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/auth/upi`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  logout: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    removeToken();
    return response.json();
  },
};

export const paymentAPI = {
  generatePaymentLink: async (upiId, amount) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/payment/generate-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ upiId, amount }),
    });
    return response.json();
  },

  parseQRCode: async (qrData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/payment/parse-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ qrData }),
    });
    return response.json();
  },

  initiatePayment: async (scannedUPI, amount) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ scannedUPI, amount }),
    });
    return response.json();
  },
};
