const { body, validationResult } = require('express-validator');

// Validation rules
const validateUPIId = () => [
  body('upiId')
    .trim()
    .toLowerCase()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/)
    .withMessage('Invalid UPI ID format'),
];

const validateAmount = () => [
  body('amount')
    .isFloat({ min: 1, max: 100000 })
    .withMessage('Amount must be between 1 and 100000'),
];

const validateUPIUrl = () => [
  body('upiId')
    .trim()
    .toLowerCase()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/)
    .withMessage('Invalid UPI ID format'),
  body('amount')
    .isFloat({ min: 1, max: 100000 })
    .withMessage('Amount must be between 1 and 100000'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateUPIId,
  validateAmount,
  validateUPIUrl,
  handleValidationErrors,
};
