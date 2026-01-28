const AIReport = require('../models/AIReport');
const HealthData = require('../models/HealthData');
const User = require('../models/User');
const { getHealthAnalysis } = require('../utils/aiService');

/**
 * @route   POST /api/ai/analyze
 * @desc    Generate AI-powered health analysis and recommendations
 * @access  Private
 */
const generateAnalysis = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.body;

    // Get user profile
    const user = await User.findById(userId);

    // Get recent health data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const healthData = await HealthData.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    if (healthData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Not enough health data to generate analysis. Please log at least one day of data.',
      });
    }

    // Prepare user profile for AI service
    const userProfile = {
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
    };

    // Call AI service
    const aiResponse = await getHealthAnalysis(
      healthData.map(d => d.toObject()),
      userProfile
    );

    // Save AI report
    const report = await AIReport.create({
      userId,
      healthScore: aiResponse.healthScore,
      recommendations: aiResponse.recommendations,
      insights: aiResponse.insights,
      dataRange: {
        startDate,
        endDate: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Health analysis generated successfully',
      data: {
        report,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ai/reports
 * @desc    Get all AI reports for the user
 * @access  Private
 */
const getReports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const reports = await AIReport.find({ userId })
      .sort({ generatedAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: reports.length,
      data: { reports },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ai/reports/:id
 * @desc    Get a specific AI report
 * @access  Private
 */
const getReportById = async (req, res, next) => {
  try {
    const report = await AIReport.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ai/latest
 * @desc    Get latest AI report for the user
 * @access  Private
 */
const getLatestReport = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const report = await AIReport.findOne({ userId })
      .sort({ generatedAt: -1 });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'No reports found. Generate your first analysis!',
      });
    }

    res.status(200).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateAnalysis,
  getReports,
  getReportById,
  getLatestReport,
};
