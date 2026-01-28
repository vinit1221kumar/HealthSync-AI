const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workout name is required'],
      trim: true,
      maxlength: [100, 'Workout name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    duration: {
      type: Number, // in minutes
      required: true,
      min: [5, 'Duration must be at least 5 minutes'],
      max: [300, 'Duration cannot exceed 300 minutes'],
    },
    exercises: [
      {
        name: {
          type: String,
          required: true,
        },
        reps: Number,
        sets: Number,
        duration: Number, // in seconds for timed exercises
        caloriesBurned: Number,
        description: String,
        formTips: [String], // Tips for correct form
        videoUrl: String, // URL to form guide
      },
    ],
    caloriesBurned: {
      type: Number,
      min: 0,
    },
    targetMuscles: [
      {
        type: String,
        enum: [
          'chest',
          'back',
          'arms',
          'shoulders',
          'legs',
          'core',
          'cardio',
          'flexibility',
        ],
      },
    ],
    equipment: [String], // e.g., ['dumbbells', 'treadmill']
    goal: {
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'endurance', 'flexibility', 'general-fitness'],
      required: true,
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    isTemplate: {
      type: Boolean,
      default: false, // True for pre-made plans, false for user created
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
