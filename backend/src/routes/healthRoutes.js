const express = require('express');
const { body } = require('express-validator');
const {
  createHealthData,
  getHealthData,
  getHealthDataByDate,
  deleteHealthData,
  getHealthStats,
} = require('../controllers/healthController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

const router = express.Router();

// Validation rules
const healthDataValidation = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('steps')
    .optional()
    .isInt({ min: 0, max: 100000 })
    .withMessage('Steps must be between 0 and 100,000'),
  body('sleepHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),
  body('waterIntake')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Water intake must be between 0 and 20 liters'),
  body('calories')
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage('Calories must be between 0 and 10,000'),
  body('mood')
    .optional()
    .isIn(['excellent', 'good', 'okay', 'bad', 'terrible'])
    .withMessage('Mood must be one of: excellent, good, okay, bad, terrible'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

// All routes require authentication
router.use(protect);

// Routes
router.post('/', healthDataValidation, validate, createHealthData);
router.get('/', getHealthData);
router.get('/stats/summary', getHealthStats);
router.get('/:date', getHealthDataByDate);
router.delete('/:id', deleteHealthData);

module.exports = router;
