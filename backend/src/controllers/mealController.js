const MealPlan = require('../models/MealPlan');
const CalorieLog = require('../models/CalorieLog');

/**
 * @route   GET /api/meals/plans
 * @desc    Get all meal plans (50+ templates)
 * @access  Private
 */
const getMealPlans = async (req, res, next) => {
  try {
    const { dietType, calorieTarget, durationDays } = req.query;

    const query = { isTemplate: true };

    if (dietType) query.dietType = dietType;
    if (calorieTarget) {
      const target = parseInt(calorieTarget);
      query.calorieTarget = { $gte: target - 100, $lte: target + 100 };
    }
    if (durationDays) query.durationDays = parseInt(durationDays);

    const plans = await MealPlan.find(query)
      .limit(50)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: { plans },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/meals/plans/:id
 * @desc    Get specific meal plan
 * @access  Private
 */
const getMealPlanById = async (req, res, next) => {
  try {
    const plan = await MealPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/meals/suggest
 * @desc    Get meal suggestions based on user preferences
 * @access  Private
 */
const suggestMeals = async (req, res, next) => {
  try {
    const { dietType, calorieTarget, restrictions, cuisinePreferences } = req.body;

    const query = { isTemplate: true };

    if (dietType) query.dietType = dietType;
    if (calorieTarget) {
      query.calorieTarget = { $gte: calorieTarget - 200, $lte: calorieTarget + 200 };
    }

    const suggestions = await MealPlan.find(query)
      .limit(10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { suggestions },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/meals/log
 * @desc    Log consumed meal
 * @access  Private
 */
const logMeal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date, mealType, foodItem, quantity, unit, calories, macros, source, confidence } =
      req.body;

    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    const log = await CalorieLog.create({
      userId,
      date: mealDate,
      mealType,
      foodItem,
      quantity,
      unit,
      calories,
      macros,
      source,
      confidence,
    });

    res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      data: { log },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/meals/history
 * @desc    Get user's meal history
 * @access  Private
 */
const getMealHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 50 } = req.query;

    const query = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const meals = await CalorieLog.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: { meals },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/meals/nutrition
 * @desc    Get nutritional breakdown
 * @access  Private
 */
const getNutritionBreakdown = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const queryDate = new Date(date || Date.now());
    queryDate.setHours(0, 0, 0, 0);

    const meals = await CalorieLog.find({
      userId,
      date: queryDate,
    });

    const breakdown = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalFiber: 0,
      mealsByType: {},
    };

    meals.forEach((meal) => {
      breakdown.totalCalories += meal.calories || 0;
      if (meal.macros) {
        breakdown.totalProtein += meal.macros.protein || 0;
        breakdown.totalCarbs += meal.macros.carbs || 0;
        breakdown.totalFats += meal.macros.fats || 0;
        breakdown.totalFiber += meal.macros.fiber || 0;
      }

      if (!breakdown.mealsByType[meal.mealType]) {
        breakdown.mealsByType[meal.mealType] = [];
      }
      breakdown.mealsByType[meal.mealType].push(meal);
    });

    res.status(200).json({
      success: true,
      data: { breakdown },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/meals/create
 * @desc    Create custom meal plan
 * @access  Private
 */
const createCustomMealPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      dietType,
      durationDays,
      calorieTarget,
      macroNutrients,
      meals,
      restrictions,
      cuisinePreferences,
    } = req.body;

    const plan = await MealPlan.create({
      name,
      description,
      dietType,
      durationDays,
      calorieTarget,
      macroNutrients,
      meals,
      restrictions,
      cuisinePreferences,
      createdBy: userId,
      isTemplate: false,
    });

    res.status(201).json({
      success: true,
      message: 'Custom meal plan created successfully',
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMealPlans,
  getMealPlanById,
  suggestMeals,
  logMeal,
  getMealHistory,
  getNutritionBreakdown,
  createCustomMealPlan,
};
