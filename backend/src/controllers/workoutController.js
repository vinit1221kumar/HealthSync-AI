const Workout = require('../models/Workout');
const WorkoutSession = require('../models/WorkoutSession');

/**
 * @route   GET /api/workouts/plans
 * @desc    Get all workout plans (100+ templates)
 * @access  Private
 */
const getWorkoutPlans = async (req, res, next) => {
  try {
    const { goal, difficulty, duration, equipment } = req.query;

    const query = { isTemplate: true };

    if (goal) query.goal = goal;
    if (difficulty) query.fitnessLevel = difficulty;
    if (duration) query.duration = { $lte: parseInt(duration) };

    const plans = await Workout.find(query)
      .limit(100)
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
 * @route   GET /api/workouts/plans/:id
 * @desc    Get specific workout plan
 * @access  Private
 */
const getWorkoutPlanById = async (req, res, next) => {
  try {
    const plan = await Workout.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found',
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
 * @route   POST /api/workouts/start
 * @desc    Start a workout session
 * @access  Private
 */
const startWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.body;
    const userId = req.user.id;

    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found',
      });
    }

    const session = await WorkoutSession.create({
      userId,
      workoutId,
      startTime: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Workout session started',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/workouts/log
 * @desc    Log completed workout
 * @access  Private
 */
const logWorkout = async (req, res, next) => {
  try {
    const { sessionId, completedExercises, totalDuration, caloriesBurned, intensity, notes } =
      req.body;
    const userId = req.user.id;

    const session = await WorkoutSession.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Workout session not found',
      });
    }

    session.completedExercises = completedExercises;
    session.totalDuration = totalDuration;
    session.caloriesBurned = caloriesBurned;
    session.intensity = intensity;
    session.notes = notes;
    session.endTime = new Date();
    session.completed = true;

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Workout logged successfully',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/workouts/history
 * @desc    Get user's workout history
 * @access  Private
 */
const getWorkoutHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 20, skip = 0 } = req.query;

    const sessions = await WorkoutSession.find({ userId, completed: true })
      .populate('workoutId', 'name difficulty goal')
      .sort({ endTime: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await WorkoutSession.countDocuments({ userId, completed: true });

    res.status(200).json({
      success: true,
      data: {
        sessions,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/workouts/recommendations
 * @desc    Get personalized workout recommendations
 * @access  Private
 */
const getWorkoutRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { goal, fitnessLevel, availableTime } = req.body;

    // Query for matching workouts
    const recommendations = await Workout.find({
      isTemplate: true,
      goal,
      fitnessLevel,
      duration: { $lte: availableTime },
    })
      .limit(5)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/workouts/create
 * @desc    Create custom workout plan
 * @access  Private
 */
const createCustomWorkout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      difficulty,
      duration,
      exercises,
      goal,
      fitnessLevel,
      targetMuscles,
      equipment,
    } = req.body;

    // Calculate total calories burned (estimate: 5 cal/min)
    const caloriesBurned = duration * 5;

    const workout = await Workout.create({
      name,
      description,
      difficulty,
      duration,
      exercises,
      caloriesBurned,
      goal,
      fitnessLevel,
      targetMuscles,
      equipment,
      createdBy: userId,
      isTemplate: false,
    });

    res.status(201).json({
      success: true,
      message: 'Custom workout created successfully',
      data: { workout },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkoutPlans,
  getWorkoutPlanById,
  startWorkout,
  logWorkout,
  getWorkoutHistory,
  getWorkoutRecommendations,
  createCustomWorkout,
};
