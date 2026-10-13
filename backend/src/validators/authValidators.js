const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('email').isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('mobile_number').notEmpty().withMessage('Mobile number is required'),
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('gender').isIn(['MALE', 'FEMALE']).withMessage('Gender must be MALE or FEMALE'),
  body('dob').isDate().withMessage('Valid Date of Birth (YYYY-MM-DD) is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRegister,
  validateLogin
};
