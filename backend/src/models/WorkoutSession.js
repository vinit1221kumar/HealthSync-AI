const mongoose = require('mongoose');

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: Date,
    completedExercises: [
      {
        exerciseIndex: Number,
        repsCompleted: Number,
        setsCompleted: Number,
        durationCompleted: Number,
        notes: String,
      },
    ],
    totalDuration: Number, // in minutes
    caloriesBurned: Number,
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate',
    },
    notes: String,
    completed: {
      type: Boolean,
      default: false,
    },
    poseAccuracy: {
      type: Number, // 0-100
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);
