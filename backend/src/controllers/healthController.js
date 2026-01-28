const HealthData = require('../models/HealthData');
const { getHealthAnalysis } = require('../utils/aiService');
const User = require('../models/User');

/**
 * @route   POST /api/health
 * @desc    Create or update health data for a specific date
 * @access  Private
 */
const createHealthData = async (req, res, next) => {
  try {
    const { date, steps, sleepHours, waterIntake, calories, mood, notes } = req.body;
    const userId = req.user.id;

    // Parse and normalize date
    const dataDate = new Date(date || Date.now());
    dataDate.setHours(0, 0, 0, 0);

    // Check if data already exists for this date
    let healthData = await HealthData.findOne({
      userId,
      date: dataDate,
    });

    if (healthData) {
      // Update existing record
      healthData.steps = steps !== undefined ? steps : healthData.steps;
      healthData.sleepHours = sleepHours !== undefined ? sleepHours : healthData.sleepHours;
      healthData.waterIntake = waterIntake !== undefined ? waterIntake : healthData.waterIntake;
      healthData.calories = calories !== undefined ? calories : healthData.calories;
      healthData.mood = mood || healthData.mood;
      healthData.notes = notes || healthData.notes;

      await healthData.save();

      return res.status(200).json({
        success: true,
        message: 'Health data updated successfully',
        data: { healthData },
      });
    }

    // Create new record
    healthData = await HealthData.create({
      userId,
      date: dataDate,
      steps,
      sleepHours,
      waterIntake,
      calories,
      mood,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Health data created successfully',
      data: { healthData },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/health
 * @desc    Get health data for the logged-in user (with optional date range)
 * @access  Private
 */
const getHealthData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 30 } = req.query;

    const query = { userId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const healthData = await HealthData.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: healthData.length,
      data: { healthData },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/health/:date
 * @desc    Get health data for a specific date
 * @access  Private
 */
const getHealthDataByDate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const targetDate = new Date(req.params.date);
    targetDate.setHours(0, 0, 0, 0);

    const healthData = await HealthData.findOne({
      userId,
      date: targetDate,
    });

    if (!healthData) {
      return res.status(404).json({
        success: false,
        message: 'No health data found for this date',
      });
    }

    res.status(200).json({
      success: true,
      data: { healthData },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/health/:id
 * @desc    Delete health data entry
 * @access  Private
 */
const deleteHealthData = async (req, res, next) => {
  try {
    const healthData = await HealthData.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!healthData) {
      return res.status(404).json({
        success: false,
        message: 'Health data not found',
      });
    }

    await healthData.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Health data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/health/stats/summary
 * @desc    Get health statistics summary (last 7 days)
 * @access  Private
 */
const getHealthStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const healthData = await HealthData.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    if (healthData.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No data available for the specified period',
        data: {
          stats: null,
          healthData: [],
        },
      });
    }

    // Calculate averages
    const stats = {
      avgSteps: Math.round(
        healthData.reduce((sum, d) => sum + d.steps, 0) / healthData.length
      ),
      avgSleep: (
        healthData.reduce((sum, d) => sum + d.sleepHours, 0) / healthData.length
      ).toFixed(1),
      avgWater: (
        healthData.reduce((sum, d) => sum + d.waterIntake, 0) / healthData.length
      ).toFixed(1),
      avgCalories: Math.round(
        healthData.reduce((sum, d) => sum + d.calories, 0) / healthData.length
      ),
      totalDays: healthData.length,
      dateRange: {
        start: healthData[0].date,
        end: healthData[healthData.length - 1].date,
      },
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        healthData,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHealthData,
  getHealthData,
  getHealthDataByDate,
  deleteHealthData,
  getHealthStats,
};
