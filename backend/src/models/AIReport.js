const mongoose = require('mongoose');

const aiReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    healthScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    recommendations: [
      {
        category: {
          type: String,
          enum: ['exercise', 'sleep', 'nutrition', 'hydration', 'mental_health'],
          required: true,
        },
        priority: {
          type: String,
          enum: ['high', 'medium', 'low'],
          default: 'medium',
        },
        suggestion: {
          type: String,
          required: true,
        },
      },
    ],
    insights: {
      type: String,
      maxlength: 1000,
    },
    dataRange: {
      startDate: Date,
      endDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AIReport', aiReportSchema);
