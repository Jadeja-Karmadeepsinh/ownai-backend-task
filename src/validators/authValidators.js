const { body } = require('express-validator');

const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['admin', 'staff'])
    .withMessage('Role must be either admin or staff'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone is too long'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City is too long'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country is too long')
];

const loginValidationRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  registerValidationRules,
  loginValidationRules
};

