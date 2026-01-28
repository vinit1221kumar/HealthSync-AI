const express = require('express');
const { body } = require('express-validator');
const {
  getWorkoutPlans,
  getWorkoutPlanById,
  startWorkout,
  logWorkout,
  getWorkoutHistory,
  getWorkoutRecommendations,
  createCustomWorkout,
} = require('../controllers/workoutController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation rules
const startWorkoutValidation = [
  body('workoutId')
    .notEmpty()
    .withMessage('Workout ID is required')
    .isMongoId()
    .withMessage('Invalid workout ID'),
];

const logWorkoutValidation = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required'),
  body('totalDuration')
    .isInt({ min: 1, max: 600 })
    .withMessage('Duration must be between 1 and 600 minutes'),
  body('caloriesBurned')
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage('Invalid calories'),
];

// Routes
router.get('/plans', getWorkoutPlans);
router.get('/plans/:id', getWorkoutPlanById);
router.post('/start', startWorkoutValidation, validate, startWorkout);
router.post('/log', logWorkoutValidation, validate, logWorkout);
router.get('/history', getWorkoutHistory);
router.post('/recommendations', getWorkoutRecommendations);
router.post('/create', createCustomWorkout);

module.exports = router;
