"""
Database Seeding Script
Populates MongoDB with sample workout plans, meal plans, and test data
Run: node seed.js
"""

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import models
const Workout = require('./src/models/Workout');
const MealPlan = require('./src/models/MealPlan');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthsync';

const workoutTemplates = [
  // Weight Loss Workouts
  {
    name: 'HIIT Fat Burner',
    description: 'High intensity interval training for maximum calorie burn',
    goal: 'weight_loss',
    difficulty: 'intermediate',
    duration: 30,
    equipment: ['Dumbbells'],
    exercises: [
      { name: 'Burpees', reps: 15, sets: 3, duration: 30, caloriesBurned: 50, formTips: 'Keep chest low' },
      { name: 'Mountain Climbers', reps: 30, sets: 3, duration: 30, caloriesBurned: 45, formTips: 'Stay fast' },
      { name: 'Jump Squats', reps: 20, sets: 3, duration: 20, caloriesBurned: 40, formTips: 'Full depth' },
      { name: 'High Knees', reps: 40, sets: 3, duration: 30, caloriesBurned: 35, formTips: 'Drive knees up' }
    ],
    isTemplate: true
  },
  {
    name: 'Cardio Blast',
    description: 'Running and cardio focused workout',
    goal: 'weight_loss',
    difficulty: 'beginner',
    duration: 45,
    equipment: [],
    exercises: [
      { name: 'Running', reps: 1, sets: 1, duration: 2700, caloriesBurned: 450, formTips: 'Steady pace' }
    ],
    isTemplate: true
  },
  
  // Muscle Gain Workouts
  {
    name: 'Upper Body Strength',
    description: 'Chest, back, and arms focused strength training',
    goal: 'muscle_gain',
    difficulty: 'advanced',
    duration: 60,
    equipment: ['Dumbbells', 'Barbell', 'Pull-up Bar'],
    exercises: [
      { name: 'Bench Press', reps: 8, sets: 4, duration: 240, caloriesBurned: 80, formTips: 'Control descent' },
      { name: 'Pull-ups', reps: 10, sets: 4, duration: 240, caloriesBurned: 75, formTips: 'Full range of motion' },
      { name: 'Barbell Rows', reps: 8, sets: 4, duration: 240, caloriesBurned: 85, formTips: 'Squeeze shoulder blades' },
      { name: 'Dumbbell Curls', reps: 12, sets: 3, duration: 180, caloriesBurned: 40, formTips: 'No swinging' }
    ],
    isTemplate: true
  },
  {
    name: 'Lower Body Power',
    description: 'Legs and glutes focused strength training',
    goal: 'muscle_gain',
    difficulty: 'advanced',
    duration: 60,
    equipment: ['Barbell', 'Dumbbells'],
    exercises: [
      { name: 'Squats', reps: 8, sets: 4, duration: 240, caloriesBurned: 90, formTips: 'Keep chest up' },
      { name: 'Deadlifts', reps: 6, sets: 4, duration: 240, caloriesBurned: 95, formTips: 'Neutral spine' },
      { name: 'Leg Press', reps: 10, sets: 3, duration: 180, caloriesBurned: 70, formTips: 'Full ROM' }
    ],
    isTemplate: true
  },
  
  // Endurance Workouts
  {
    name: 'Long Distance Run',
    description: 'Build cardiovascular endurance',
    goal: 'endurance',
    difficulty: 'intermediate',
    duration: 60,
    equipment: [],
    exercises: [
      { name: 'Running', reps: 1, sets: 1, duration: 3600, caloriesBurned: 600, formTips: 'Comfortable pace' }
    ],
    isTemplate: true
  },
  
  // Flexibility Workouts
  {
    name: 'Yoga Flow',
    description: 'Improve flexibility and reduce stress',
    goal: 'flexibility',
    difficulty: 'beginner',
    duration: 60,
    equipment: ['Yoga Mat'],
    exercises: [
      { name: 'Sun Salutation', reps: 10, sets: 1, duration: 600, caloriesBurned: 80, formTips: 'Breathe deeply' },
      { name: 'Downward Dog', reps: 10, sets: 1, duration: 300, caloriesBurned: 30, formTips: 'Hands shoulder width' },
      { name: 'Warrior Poses', reps: 5, sets: 2, duration: 600, caloriesBurned: 60, formTips: 'Stay grounded' }
    ],
    isTemplate: true
  }
];

const mealPlanTemplates = [
  {
    name: 'Veggie Power 7-Day',
    description: 'Plant-based nutrition plan',
    dietType: 'vegetarian',
    durationDays: 7,
    calorieTarget: 2000,
    meals: [
      {
        day: 1,
        breakfast: {
          items: ['Oatmeal', 'Banana', 'Almonds'],
          macros: { protein: 12, carbs: 65, fats: 8 }
        },
        lunch: {
          items: ['Quinoa Salad', 'Chickpeas', 'Vegetables'],
          macros: { protein: 18, carbs: 58, fats: 12 }
        },
        dinner: {
          items: ['Lentil Curry', 'Brown Rice', 'Spinach'],
          macros: { protein: 16, carbs: 62, fats: 10 }
        }
      }
    ],
    isTemplate: true
  },
  {
    name: 'High Protein Builder',
    description: 'Muscle building meal plan',
    dietType: 'high_protein',
    durationDays: 7,
    calorieTarget: 2500,
    meals: [
      {
        day: 1,
        breakfast: {
          items: ['Eggs', 'Greek Yogurt', 'Berries', 'Granola'],
          macros: { protein: 45, carbs: 48, fats: 14 }
        },
        lunch: {
          items: ['Grilled Chicken', 'Sweet Potato', 'Broccoli'],
          macros: { protein: 50, carbs: 52, fats: 12 }
        },
        dinner: {
          items: ['Salmon', 'Quinoa', 'Green Beans'],
          macros: { protein: 48, carbs: 50, fats: 16 }
        }
      }
    ],
    isTemplate: true
  },
  {
    name: 'Balanced Nutrition',
    description: 'Well-rounded meal plan for general health',
    dietType: 'non_vegetarian',
    durationDays: 7,
    calorieTarget: 2000,
    meals: [
      {
        day: 1,
        breakfast: {
          items: ['Whole Wheat Toast', 'Peanut Butter', 'Orange Juice'],
          macros: { protein: 15, carbs: 55, fats: 12 }
        },
        lunch: {
          items: ['Lean Turkey Sandwich', 'Apple'],
          macros: { protein: 28, carbs: 45, fats: 8 }
        },
        dinner: {
          items: ['Grilled Fish', 'Brown Rice', 'Mixed Vegetables'],
          macros: { protein: 35, carbs: 50, fats: 10 }
        }
      }
    ],
    isTemplate: true
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log(`📍 Connecting to: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing templates
    await Workout.deleteMany({ isTemplate: true });
    await MealPlan.deleteMany({ isTemplate: true });
    console.log('🗑️  Cleared existing templates');
    
    // Seed workouts
    const createdWorkouts = await Workout.insertMany(workoutTemplates);
    console.log(`✅ Created ${createdWorkouts.length} workout templates`);
    
    // Seed meal plans
    const createdMeals = await MealPlan.insertMany(mealPlanTemplates);
    console.log(`✅ Created ${createdMeals.length} meal plan templates`);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   Workouts: ${createdWorkouts.length}`);
    console.log(`   Meal Plans: ${createdMeals.length}`);
    console.log('\n✨ Database seeding complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
