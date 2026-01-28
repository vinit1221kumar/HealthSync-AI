const express = require('express');
const { body } = require('express-validator');
const {
  startPoseSession,
  analyzePose,
  endPoseSession,
  getPoseSessionDetails,
  getExerciseFeedback,
} = require('../controllers/poseController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation rules
const startSessionValidation = [
  body('exerciseName')
    .notEmpty()
    .withMessage('Exercise name is required'),
];

const analyzePoseValidation = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required'),
  body('keypoints')
    .notEmpty()
    .withMessage('Keypoints are required'),
  body('repNumber')
    .isInt({ min: 1 })
    .withMessage('Rep number must be at least 1'),
];

// Routes
router.post('/start-session', startSessionValidation, validate, startPoseSession);
router.post('/analyze', analyzePoseValidation, validate, analyzePose);
router.post('/end-session', endPoseSession);
router.get('/session/:id', getPoseSessionDetails);
router.get('/exercise-feedback', getExerciseFeedback);

module.exports = router;
