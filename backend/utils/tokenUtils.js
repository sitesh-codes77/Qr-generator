const jwt = require('jsonwebtoken');

const generateToken = (userId, upiId) => {
  return jwt.sign(
    { userId, upiId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
