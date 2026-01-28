const mongoose = require('mongoose');

const calorieLogSchema = new mongoose.Schema(
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
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'snack', 'dinner'],
      required: true,
    },
    foodItem: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'piece'],
      default: 'g',
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    macros: {
      protein: Number,
      carbs: Number,
      fats: Number,
      fiber: Number,
    },
    source: {
      type: String,
      enum: ['manual', 'food-database', 'ml-prediction'],
      default: 'manual',
    },
    confidence: {
      type: Number, // For ML predictions: 0-100
      min: 0,
      max: 100,
    },
    notes: String,
  },
  { timestamps: true }
);

// Compound index for efficient queries
calorieLogSchema.index({ userId: 1, date: 1, mealType: 1 });

module.exports = mongoose.model('CalorieLog', calorieLogSchema);
