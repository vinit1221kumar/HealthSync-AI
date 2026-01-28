"""
Meal Plan Recommendation Engine
Generates personalized meal plans based on user profile and dietary preferences
"""

from typing import List, Dict, Any
from enum import Enum


class DietType(str, Enum):
    VEGETARIAN = "vegetarian"
    NON_VEGETARIAN = "non_vegetarian"
    HIGH_PROTEIN = "high_protein"


class MealRecommender:
    """ML-based meal plan recommendation system"""
    
    MEAL_PLANS = {
        'vegetarian': {
            'name': 'Vegetarian Wellness',
            'meals': [
                {
                    'name': 'Quinoa Buddha Bowl',
                    'calories': 450,
                    'protein': 18,
                    'carbs': 65,
                    'fats': 12,
                    'ingredients': ['Quinoa', 'Chickpeas', 'Sweet Potato', 'Kale', 'Tahini']
                },
                {
                    'name': 'Lentil Soup',
                    'calories': 320,
                    'protein': 15,
                    'carbs': 48,
                    'fats': 5,
                    'ingredients': ['Lentils', 'Onion', 'Garlic', 'Carrots', 'Tomatoes']
                },
                {
                    'name': 'Tofu Stir Fry',
                    'calories': 380,
                    'protein': 22,
                    'carbs': 42,
                    'fats': 14,
                    'ingredients': ['Tofu', 'Broccoli', 'Bell Pepper', 'Ginger', 'Soy Sauce']
                }
            ]
        },
        'non_vegetarian': {
            'name': 'Balanced Protein',
            'meals': [
                {
                    'name': 'Grilled Chicken Breast',
                    'calories': 420,
                    'protein': 45,
                    'carbs': 35,
                    'fats': 8,
                    'ingredients': ['Chicken Breast', 'Rice', 'Broccoli', 'Lemon']
                },
                {
                    'name': 'Salmon Fillet',
                    'calories': 480,
                    'protein': 42,
                    'carbs': 30,
                    'fats': 18,
                    'ingredients': ['Salmon', 'Sweet Potato', 'Green Beans', 'Olive Oil']
                },
                {
                    'name': 'Lean Beef Taco',
                    'calories': 400,
                    'protein': 38,
                    'carbs': 38,
                    'fats': 12,
                    'ingredients': ['Lean Beef', 'Taco Shell', 'Lettuce', 'Tomato', 'Greek Yogurt']
                }
            ]
        },
        'high_protein': {
            'name': 'Muscle Building Elite',
            'meals': [
                {
                    'name': 'Protein Power Oats',
                    'calories': 520,
                    'protein': 50,
                    'carbs': 52,
                    'fats': 14,
                    'ingredients': ['Oats', 'Protein Powder', 'Banana', 'Almonds', 'Greek Yogurt']
                },
                {
                    'name': 'Egg White Omelet',
                    'calories': 380,
                    'protein': 48,
                    'carbs': 28,
                    'fats': 8,
                    'ingredients': ['Egg Whites', 'Whole Wheat Bread', 'Spinach', 'Mushrooms']
                },
                {
                    'name': 'Tuna Protein Bowl',
                    'calories': 450,
                    'protein': 55,
                    'carbs': 35,
                    'fats': 10,
                    'ingredients': ['Canned Tuna', 'Brown Rice', 'Edamame', 'Cucumber']
                }
            ]
        }
    }
    
    def __init__(self):
        pass
    
    def get_meal_plan(self, user_profile: Dict[str, Any], diet_type: str = 'non_vegetarian',
                      days: int = 7) -> Dict[str, Any]:
        """
        Get personalized meal plan
        
        Args:
            user_profile: User demographic data
            diet_type: Type of diet (vegetarian, non_vegetarian, high_protein)
            days: Number of days for meal plan
        
        Returns:
            Complete meal plan with daily breakdown
        """
        if diet_type not in self.MEAL_PLANS:
            diet_type = 'non_vegetarian'
        
        base_plan = self.MEAL_PLANS[diet_type]
        
        # Calculate daily calorie target
        daily_calories = self._calculate_daily_calories(user_profile)
        
        # Build meal plan
        meal_plan = {
            'name': base_plan['name'],
            'diet_type': diet_type,
            'daily_calories': daily_calories,
            'duration_days': days,
            'daily_meals': self._distribute_meals(base_plan['meals'], daily_calories)
        }
        
        return meal_plan
    
    def _calculate_daily_calories(self, profile: Dict[str, Any]) -> int:
        """Calculate daily calorie requirement using Mifflin-St Jeor equation"""
        age = profile.get('age', 30)
        gender = profile.get('gender', 'male')
        height = profile.get('height', 175)  # cm
        weight = profile.get('weight', 70)   # kg
        activity_level = profile.get('activity_level', 1.5)  # Default: moderate
        
        # Mifflin-St Jeor calculation
        if gender.lower() == 'male':
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
        else:
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
        
        tdee = int(bmr * activity_level)
        
        # Clamp to reasonable range
        return max(1500, min(4000, tdee))
    
    def _distribute_meals(self, meals: List[Dict], daily_calories: int) -> List[Dict]:
        """Distribute meals throughout the day"""
        # Standard distribution: Breakfast 25%, Lunch 35%, Dinner 30%, Snack 10%
        breakfast_cal = int(daily_calories * 0.25)
        lunch_cal = int(daily_calories * 0.35)
        dinner_cal = int(daily_calories * 0.30)
        snack_cal = daily_calories - breakfast_cal - lunch_cal - dinner_cal
        
        return [
            {
                'type': 'breakfast',
                'target_calories': breakfast_cal,
                'meals': meals[:1]
            },
            {
                'type': 'lunch',
                'target_calories': lunch_cal,
                'meals': meals[1:2]
            },
            {
                'type': 'dinner',
                'target_calories': dinner_cal,
                'meals': meals[1:] if len(meals) > 2 else meals[1:2]
            }
        ]
    
    def analyze_macros(self, meals: List[Dict]) -> Dict[str, float]:
        """Analyze macronutrient breakdown"""
        total_protein = sum(m.get('protein', 0) for m in meals)
        total_carbs = sum(m.get('carbs', 0) for m in meals)
        total_fats = sum(m.get('fats', 0) for m in meals)
        total_calories = sum(m.get('calories', 0) for m in meals)
        
        return {
            'protein': total_protein,
            'carbs': total_carbs,
            'fats': total_fats,
            'calories': total_calories,
            'protein_percentage': (total_protein * 4 / total_calories * 100) if total_calories else 0,
            'carbs_percentage': (total_carbs * 4 / total_calories * 100) if total_calories else 0,
            'fats_percentage': (total_fats * 9 / total_calories * 100) if total_calories else 0
        }
