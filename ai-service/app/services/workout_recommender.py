"""
Workout Recommendation Engine
Generates personalized workout plans based on user profile and goals
"""

from typing import List, Dict, Any
import random


class WorkoutRecommender:
    """ML-based workout recommendation system"""
    
    WORKOUTS = {
        'weight_loss': [
            {
                'id': 'hiit_30',
                'name': 'HIIT 30 min',
                'duration': 30,
                'intensity': 'high',
                'calories': 350,
                'exercises': ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees']
            },
            {
                'id': 'running_45',
                'name': 'Steady Running',
                'duration': 45,
                'intensity': 'moderate',
                'calories': 400,
                'exercises': ['Running']
            },
            {
                'id': 'cardio_circuit_30',
                'name': 'Cardio Circuit',
                'duration': 30,
                'intensity': 'high',
                'calories': 320,
                'exercises': ['Jumping Jacks', 'Skipping Rope', 'Cycling']
            }
        ],
        'muscle_gain': [
            {
                'id': 'upper_body_60',
                'name': 'Upper Body Strength',
                'duration': 60,
                'intensity': 'high',
                'calories': 280,
                'exercises': ['Bench Press', 'Pull-ups', 'Dips', 'Rows']
            },
            {
                'id': 'lower_body_60',
                'name': 'Lower Body Power',
                'duration': 60,
                'intensity': 'high',
                'calories': 290,
                'exercises': ['Squats', 'Deadlifts', 'Leg Press', 'Lunges']
            },
            {
                'id': 'full_body_50',
                'name': 'Full Body Strength',
                'duration': 50,
                'intensity': 'high',
                'calories': 260,
                'exercises': ['Compound Lifts', 'Free Weights', 'Resistance Bands']
            }
        ],
        'endurance': [
            {
                'id': 'long_run_60',
                'name': 'Long Distance Run',
                'duration': 60,
                'intensity': 'moderate',
                'calories': 450,
                'exercises': ['Distance Running']
            },
            {
                'id': 'cycling_90',
                'name': 'Cycling Endurance',
                'duration': 90,
                'intensity': 'moderate',
                'calories': 480,
                'exercises': ['Steady Cycling']
            },
            {
                'id': 'swimming_45',
                'name': 'Swimming Laps',
                'duration': 45,
                'intensity': 'moderate',
                'calories': 420,
                'exercises': ['Swimming']
            }
        ],
        'flexibility': [
            {
                'id': 'yoga_60',
                'name': 'Power Yoga',
                'duration': 60,
                'intensity': 'low',
                'calories': 180,
                'exercises': ['Yoga Poses', 'Stretching']
            },
            {
                'id': 'pilates_45',
                'name': 'Pilates Core',
                'duration': 45,
                'intensity': 'moderate',
                'calories': 200,
                'exercises': ['Core Strengthening', 'Flexibility']
            },
            {
                'id': 'stretching_30',
                'name': 'Full Body Stretch',
                'duration': 30,
                'intensity': 'low',
                'calories': 100,
                'exercises': ['Dynamic Stretching']
            }
        ]
    }
    
    def __init__(self):
        pass
    
    def get_recommendations(self, user_profile: Dict[str, Any], goal: str = 'weight_loss', 
                          count: int = 3) -> List[Dict[str, Any]]:
        """
        Get personalized workout recommendations
        
        Args:
            user_profile: User demographic data
            goal: Fitness goal (weight_loss, muscle_gain, endurance, flexibility)
            count: Number of recommendations to return
        
        Returns:
            List of recommended workouts
        """
        if goal not in self.WORKOUTS:
            goal = 'weight_loss'
        
        available_workouts = self.WORKOUTS[goal]
        
        # Adjust recommendations based on user profile
        recommendations = self._adjust_by_profile(available_workouts, user_profile)
        
        # Return top recommendations
        return recommendations[:count]
    
    def _adjust_by_profile(self, workouts: List[Dict], profile: Dict[str, Any]) -> List[Dict]:
        """Adjust workout recommendations based on user profile"""
        age = profile.get('age', 30)
        
        adjusted = []
        for workout in workouts:
            adjusted_workout = workout.copy()
            
            # Reduce intensity for older users
            if age > 50 and workout['intensity'] == 'high':
                adjusted_workout['intensity'] = 'moderate'
                adjusted_workout['calories'] = int(adjusted_workout['calories'] * 0.8)
            
            # Increase challenge for younger users
            if age < 25 and workout['intensity'] in ['low', 'moderate']:
                adjusted_workout['intensity'] = 'high'
                adjusted_workout['calories'] = int(adjusted_workout['calories'] * 1.2)
            
            adjusted.append(adjusted_workout)
        
        return adjusted
    
    def estimate_calories(self, workout_duration: int, intensity: str) -> int:
        """Estimate calories burned during workout"""
        base_rate = {
            'low': 3,
            'moderate': 6,
            'high': 10
        }
        return workout_duration * base_rate.get(intensity, 6)
