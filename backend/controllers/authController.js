const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

/**
 * Register or Login user with UPI ID
 * If user exists, return token. Otherwise, create new user.
 */
exports.registerOrLogin = async (req, res) => {
  try {
    const { upiId, password } = req.body;

    if (!upiId || !password) {
      return res.status(400).json({ message: 'UPI ID and password are required' });
    }

    // Sanitize UPI ID
    const sanitizedUPI = String(upiId).trim().toLowerCase();

    // Check if user exists
    let user = await User.findOne({ upiId: sanitizedUPI });

    if (user) {
      // User exists - verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id, user.upiId);

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: user.toJSON(),
      });
    }

    // Create new user
    user = new User({
      upiId: sanitizedUPI,
      passwordHash: password,
      lastLogin: new Date(),
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.upiId);

    return res.status(201).json({
      message: 'Account created and logged in successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Verify token and return user info
 */
exports.verifyAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User verified',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Verify auth error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user's UPI ID
 */
exports.getUPI = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      upiId: user.upiId,
    });
  } catch (error) {
    console.error('Get UPI error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Logout user (client-side token deletion)
 */
exports.logout = async (req, res) => {
  try {
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
