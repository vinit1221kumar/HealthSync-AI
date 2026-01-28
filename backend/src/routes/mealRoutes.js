const express = require('express');
const { body } = require('express-validator');
const {
  getMealPlans,
  getMealPlanById,
  suggestMeals,
  logMeal,
  getMealHistory,
  getNutritionBreakdown,
  createCustomMealPlan,
} = require('../controllers/mealController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation rules
const logMealValidation = [
  body('mealType')
    .isIn(['breakfast', 'lunch', 'snack', 'dinner'])
    .withMessage('Invalid meal type'),
  body('foodItem')
    .notEmpty()
    .withMessage('Food item is required'),
  body('quantity')
    .isFloat({ min: 0.1 })
    .withMessage('Quantity must be greater than 0'),
  body('calories')
    .isInt({ min: 0, max: 5000 })
    .withMessage('Calories must be between 0 and 5000'),
];

// Routes
router.get('/plans', getMealPlans);
router.get('/plans/:id', getMealPlanById);
router.post('/suggest', suggestMeals);
router.post('/log', logMealValidation, validate, logMeal);
router.get('/history', getMealHistory);
router.get('/nutrition', getNutritionBreakdown);
router.post('/create', createCustomMealPlan);

module.exports = router;
