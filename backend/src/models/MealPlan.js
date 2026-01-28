const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Meal plan name is required'],
      trim: true,
    },
    description: String,
    dietType: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'high-protein'],
      required: true,
      index: true,
    },
    durationDays: {
      type: Number,
      enum: [7, 14, 30],
      default: 7,
    },
    calorieTarget: {
      type: Number,
      required: true,
      min: 1000,
      max: 5000,
    },
    macroNutrients: {
      protein: Number, // percentage
      carbs: Number,
      fats: Number,
    },
    meals: [
      {
        day: Number,
        mealType: {
          type: String,
          enum: ['breakfast', 'lunch', 'snack', 'dinner'],
        },
        mealName: String,
        description: String,
        calories: Number,
        ingredients: [
          {
            name: String,
            quantity: String,
            unit: String,
          },
        ],
        macros: {
          protein: Number,
          carbs: Number,
          fats: Number,
        },
        preparationTime: Number, // in minutes
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
        },
      },
    ],
    totalCaloriesPerDay: Number,
    restrictions: [String], // e.g., ['gluten-free', 'dairy-free']
    cuisinePreferences: [String],
    isTemplate: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MealPlan', mealPlanSchema);
