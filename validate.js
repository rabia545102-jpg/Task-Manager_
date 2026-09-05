const { body, validationResult } = require('express-validator');

// Runs after the validation chains below; collects and formats errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 120 }).withMessage('Title cannot exceed 120 characters'),
  body('description').optional({ checkFalsy: true }).isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional({ checkFalsy: true }).isISO8601()
    .withMessage('Due date must be a valid date'),
  body('completed').optional().isBoolean().withMessage('Completed must be true or false'),
  handleValidationErrors,
];

module.exports = { registerValidation, loginValidation, taskValidation, handleValidationErrors };
