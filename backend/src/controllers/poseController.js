const PoseSession = require('../models/PoseSession');

/**
 * @route   POST /api/pose/start-session
 * @desc    Start a pose detection session
 * @access  Private
 */
const startPoseSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { exerciseName, workoutSessionId } = req.body;

    const session = await PoseSession.create({
      userId,
      workoutSessionId,
      exerciseName,
      startTime: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Pose detection session started',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/pose/analyze
 * @desc    Analyze pose data from camera feed
 * @access  Private
 */
const analyzePose = async (req, res, next) => {
  try {
    const { sessionId, keypoints, repNumber } = req.body;
    const userId = req.user.id;

    const session = await PoseSession.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Pose session not found',
      });
    }

    // Basic form validation (would be enhanced with ML)
    const formFeedback = [];
    let accuracy = 80; // Base score

    // Example: Check if keypoints are within acceptable ranges
    if (keypoints.leftShoulder && keypoints.rightShoulder) {
      const shoulderAlignment = Math.abs(
        keypoints.leftShoulder.y - keypoints.rightShoulder.y
      );
      if (shoulderAlignment > 30) {
        formFeedback.push('Keep shoulders level and aligned');
        accuracy -= 10;
      }
    }

    if (keypoints.leftElbow && keypoints.rightElbow) {
      const elbowBend = Math.abs(keypoints.leftElbow.y - keypoints.leftShoulder?.y || 0);
      if (elbowBend < 30) {
        formFeedback.push('Increase elbow bend for better form');
        accuracy -= 5;
      }
    }

    // Add rep analysis
    session.repAnalysis.push({
      repNumber,
      accuracy,
      feedback: formFeedback,
      keypoints,
      timestamp: new Date(),
    });

    // Update overall accuracy
    const avgAccuracy =
      session.repAnalysis.reduce((sum, rep) => sum + rep.accuracy, 0) /
      session.repAnalysis.length;
    session.overallAccuracy = Math.round(avgAccuracy);

    await session.save();

    res.status(200).json({
      success: true,
      data: {
        accuracy,
        feedback: formFeedback,
        overallAccuracy: session.overallAccuracy,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/pose/end-session
 * @desc    End pose detection session
 * @access  Private
 */
const endPoseSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    const session = await PoseSession.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Pose session not found',
      });
    }

    // Calculate session metrics
    const repsCount = session.repAnalysis.length;
    const durationSeconds = Math.round(
      (new Date() - session.startTime) / 1000
    );

    session.endTime = new Date();
    session.durationSeconds = durationSeconds;
    session.repsCompleted = repsCount;
    session.completed = true;

    // Identify common issues
    const issueFrequency = {};
    session.repAnalysis.forEach((rep) => {
      rep.feedback.forEach((feedback) => {
        issueFrequency[feedback] = (issueFrequency[feedback] || 0) + 1;
      });
    });

    session.commonIssues = Object.entries(issueFrequency)
      .filter(([_, count]) => count > repsCount * 0.3) // Issues in >30% of reps
      .map(([issue]) => issue);

    // Generate improvements
    const improvements = [];
    if (session.overallAccuracy < 70) {
      improvements.push('Focus on maintaining proper form throughout the exercise');
    }
    if (session.commonIssues.length > 0) {
      improvements.push(`Work on: ${session.commonIssues.join(', ')}`);
    }
    if (repsCount < 10) {
      improvements.push('Try to complete more reps for better results');
    }

    session.improvements = improvements;

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Pose session ended successfully',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/pose/session/:id
 * @desc    Get pose session details
 * @access  Private
 */
const getPoseSessionDetails = async (req, res, next) => {
  try {
    const session = await PoseSession.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Pose session not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/pose/exercise-feedback
 * @desc    Get form feedback for specific exercise
 * @access  Private
 */
const getExerciseFeedback = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { exerciseName, limit = 10 } = req.query;

    const sessions = await PoseSession.find({
      userId,
      exerciseName,
      completed: true,
    })
      .sort({ endTime: -1 })
      .limit(parseInt(limit));

    // Aggregate feedback
    const feedback = {
      exerciseName,
      sessionsAnalyzed: sessions.length,
      averageAccuracy:
        sessions.length > 0
          ? Math.round(
              sessions.reduce((sum, s) => sum + (s.overallAccuracy || 0), 0) /
                sessions.length
            )
          : 0,
      commonIssues: [],
      improvements: [],
      trend: 'stable',
    };

    // Aggregate common issues
    const issueFrequency = {};
    sessions.forEach((session) => {
      session.commonIssues?.forEach((issue) => {
        issueFrequency[issue] = (issueFrequency[issue] || 0) + 1;
      });
    });

    feedback.commonIssues = Object.entries(issueFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);

    res.status(200).json({
      success: true,
      data: { feedback },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startPoseSession,
  analyzePose,
  endPoseSession,
  getPoseSessionDetails,
  getExerciseFeedback,
};
