const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    steps: {
      type: Number,
      min: [0, 'Steps cannot be negative'],
      max: [100000, 'Steps seems unrealistic'],
      default: 0,
    },
    sleepHours: {
      type: Number,
      min: [0, 'Sleep hours cannot be negative'],
      max: [24, 'Sleep hours cannot exceed 24'],
      default: 0,
    },
    waterIntake: {
      type: Number, // in liters
      min: [0, 'Water intake cannot be negative'],
      max: [20, 'Water intake seems unrealistic'],
      default: 0,
    },
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative'],
      max: [10000, 'Calories seems unrealistic'],
      default: 0,
    },
    mood: {
      type: String,
      enum: ['excellent', 'good', 'okay', 'bad', 'terrible'],
      default: 'okay',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null, // Will be calculated by AI service
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one entry per user per day
healthDataSchema.index({ userId: 1, date: 1 }, { unique: true });

// Method to format date to start of day (ignore time)
healthDataSchema.pre('save', function (next) {
  if (this.date) {
    const date = new Date(this.date);
    date.setHours(0, 0, 0, 0);
    this.date = date;
  }
  next();
});

module.exports = mongoose.model('HealthData', healthDataSchema);
