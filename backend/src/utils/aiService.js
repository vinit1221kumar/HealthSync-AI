const axios = require('axios');
const config = require('../config/config');

/**
 * Call AI service to calculate health score and get recommendations
 * @param {Array} healthDataArray - Array of health data entries
 * @param {Object} userProfile - User profile data (age, gender, etc.)
 * @returns {Promise<Object>} AI response with score and recommendations
 */
const getHealthAnalysis = async (healthDataArray, userProfile) => {
  try {
    const response = await axios.post(
      `${config.aiServiceUrl}/api/analyze`,
      {
        healthData: healthDataArray,
        userProfile: userProfile,
      },
      {
        timeout: 10000, // 10 second timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error('AI Service Error:', error.message);
    
    // Fallback to basic calculation if AI service is unavailable
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn('⚠️  AI Service unavailable, using fallback calculation');
      return calculateFallbackScore(healthDataArray);
    }
    
    throw error;
  }
};

/**
 * Fallback health score calculation (basic rule-based)
 * @param {Array} healthDataArray - Array of health data entries
 * @returns {Object} Basic score and recommendations
 */
const calculateFallbackScore = (healthDataArray) => {
  if (!healthDataArray || healthDataArray.length === 0) {
    return {
      healthScore: 50,
      recommendations: [
        {
          category: 'general',
          priority: 'high',
          suggestion: 'Start logging your daily health data to get personalized insights',
        },
      ],
      insights: 'Not enough data to provide detailed analysis',
    };
  }

  // Get latest entry
  const latest = healthDataArray[healthDataArray.length - 1];
  
  let score = 0;
  const recommendations = [];

  // Steps (max 25 points)
  if (latest.steps >= 10000) score += 25;
  else if (latest.steps >= 7000) score += 20;
  else if (latest.steps >= 5000) score += 15;
  else {
    score += Math.floor((latest.steps / 10000) * 25);
    recommendations.push({
      category: 'exercise',
      priority: 'high',
      suggestion: `Aim for at least 10,000 steps daily. You're at ${latest.steps} steps.`,
    });
  }

  // Sleep (max 25 points)
  if (latest.sleepHours >= 7 && latest.sleepHours <= 9) score += 25;
  else if (latest.sleepHours >= 6 && latest.sleepHours <= 10) score += 20;
  else {
    score += 10;
    recommendations.push({
      category: 'sleep',
      priority: 'high',
      suggestion: 'Aim for 7-9 hours of quality sleep each night.',
    });
  }

  // Water (max 25 points)
  if (latest.waterIntake >= 2.5) score += 25;
  else if (latest.waterIntake >= 2) score += 20;
  else {
    score += Math.floor((latest.waterIntake / 2.5) * 25);
    recommendations.push({
      category: 'hydration',
      priority: 'medium',
      suggestion: 'Drink at least 2-3 liters of water daily.',
    });
  }

  // Mood (max 25 points)
  const moodScores = {
    excellent: 25,
    good: 20,
    okay: 15,
    bad: 10,
    terrible: 5,
  };
  score += moodScores[latest.mood] || 15;

  if (['bad', 'terrible'].includes(latest.mood)) {
    recommendations.push({
      category: 'mental_health',
      priority: 'high',
      suggestion: 'Consider mindfulness practices, exercise, or talking to someone.',
    });
  }

  return {
    healthScore: Math.round(score),
    recommendations: recommendations.slice(0, 3), // Top 3 recommendations
    insights: `Based on your recent data: ${score >= 80 ? 'Great job maintaining healthy habits!' : score >= 60 ? 'Good progress, but there\'s room for improvement.' : 'Focus on the recommendations to improve your health score.'}`,
  };
};

module.exports = {
  getHealthAnalysis,
  calculateFallbackScore,
};
