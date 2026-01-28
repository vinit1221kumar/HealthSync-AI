"""
Health Analyzer Service
Calculates health scores and generates personalized recommendations
based on user's health data and profile.
"""

from typing import List, Dict, Any
import numpy as np
from datetime import datetime


class HealthAnalyzer:
    """
    AI-powered health analysis engine.
    Uses rule-based logic with weighted scoring system.
    Can be extended with ML models in the future.
    """
    
    # Scoring weights for different metrics
    WEIGHTS = {
        'steps': 0.25,
        'sleep': 0.30,
        'water': 0.20,
        'calories': 0.15,
        'mood': 0.10
    }
    
    # Optimal ranges for health metrics
    OPTIMAL_RANGES = {
        'steps': {'min': 8000, 'target': 10000, 'max': 15000},
        'sleep': {'min': 7, 'target': 8, 'max': 9},
        'water': {'min': 2, 'target': 3, 'max': 4},
        'calories': {'min': 1500, 'target': 2000, 'max': 2500},
    }
    
    MOOD_SCORES = {
        'excellent': 100,
        'good': 80,
        'okay': 60,
        'bad': 40,
        'terrible': 20
    }
    
    def __init__(self):
        """Initialize the health analyzer"""
        pass
    
    def analyze(self, health_data: List[Dict[str, Any]], user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main analysis method
        
        Args:
            health_data: List of daily health data entries
            user_profile: User's demographic information
        
        Returns:
            Dictionary containing health score, recommendations, and insights
        """
        if not health_data:
            raise ValueError("No health data provided")
        
        # Get latest data point for current analysis
        latest = health_data[-1]
        
        # Calculate individual component scores
        scores = self._calculate_component_scores(latest)
        
        # Calculate overall health score
        health_score = self._calculate_health_score(scores)
        
        # Analyze trends if multiple days of data
        trends = self._analyze_trends(health_data) if len(health_data) > 1 else {}
        
        # Generate personalized recommendations
        recommendations = self._generate_recommendations(
            scores, trends, latest, user_profile
        )
        
        # Generate insights
        insights = self._generate_insights(
            health_score, scores, trends, len(health_data)
        )
        
        return {
            'healthScore': int(health_score),
            'recommendations': recommendations,
            'insights': insights
        }
    
    def _calculate_component_scores(self, data: Dict[str, Any]) -> Dict[str, float]:
        """Calculate individual scores for each health metric"""
        scores = {}
        
        # Steps score
        steps = data.get('steps', 0)
        scores['steps'] = self._score_metric(
            steps,
            self.OPTIMAL_RANGES['steps']['min'],
            self.OPTIMAL_RANGES['steps']['target'],
            self.OPTIMAL_RANGES['steps']['max']
        )
        
        # Sleep score
        sleep = data.get('sleepHours', 0)
        scores['sleep'] = self._score_metric(
            sleep,
            self.OPTIMAL_RANGES['sleep']['min'],
            self.OPTIMAL_RANGES['sleep']['target'],
            self.OPTIMAL_RANGES['sleep']['max']
        )
        
        # Water score
        water = data.get('waterIntake', 0)
        scores['water'] = self._score_metric(
            water,
            self.OPTIMAL_RANGES['water']['min'],
            self.OPTIMAL_RANGES['water']['target'],
            self.OPTIMAL_RANGES['water']['max']
        )
        
        # Calories score (if provided)
        calories = data.get('calories', 0)
        if calories > 0:
            scores['calories'] = self._score_metric(
                calories,
                self.OPTIMAL_RANGES['calories']['min'],
                self.OPTIMAL_RANGES['calories']['target'],
                self.OPTIMAL_RANGES['calories']['max']
            )
        else:
            scores['calories'] = 50  # Neutral score if not provided
        
        # Mood score
        mood = data.get('mood', 'okay')
        scores['mood'] = self.MOOD_SCORES.get(mood, 60)
        
        return scores
    
    def _score_metric(self, value: float, min_val: float, target: float, max_val: float) -> float:
        """
        Score a metric based on optimal range
        Returns score 0-100
        """
        if value <= 0:
            return 0
        
        if value >= min_val and value <= max_val:
            # Within optimal range
            if value <= target:
                # Below or at target - linear scale from min to target
                return 70 + (30 * (value - min_val) / (target - min_val))
            else:
                # Above target - slight penalty
                return 100 - (20 * (value - target) / (max_val - target))
        elif value < min_val:
            # Below minimum - linear scale from 0 to 70
            return 70 * (value / min_val)
        else:
            # Above maximum - penalty
            excess_ratio = (value - max_val) / max_val
            return max(0, 80 - (50 * excess_ratio))
    
    def _calculate_health_score(self, scores: Dict[str, float]) -> float:
        """Calculate weighted overall health score"""
        total_score = 0
        for metric, score in scores.items():
            weight = self.WEIGHTS.get(metric, 0)
            total_score += score * weight
        
        return round(total_score, 1)
    
    def _analyze_trends(self, health_data: List[Dict[str, Any]]) -> Dict[str, str]:
        """Analyze trends over time"""
        trends = {}
        
        if len(health_data) < 2:
            return trends
        
        # Calculate trends for each metric
        metrics = ['steps', 'sleepHours', 'waterIntake', 'calories']
        
        for metric in metrics:
            values = [entry.get(metric, 0) for entry in health_data]
            
            # Simple trend: compare average of first half vs second half
            mid = len(values) // 2
            first_half_avg = np.mean(values[:mid]) if mid > 0 else 0
            second_half_avg = np.mean(values[mid:])
            
            if second_half_avg > first_half_avg * 1.1:
                trends[metric] = 'improving'
            elif second_half_avg < first_half_avg * 0.9:
                trends[metric] = 'declining'
            else:
                trends[metric] = 'stable'
        
        return trends
    
    def _generate_recommendations(
        self,
        scores: Dict[str, float],
        trends: Dict[str, str],
        latest_data: Dict[str, Any],
        user_profile: Dict[str, Any]
    ) -> List[Dict[str, str]]:
        """Generate personalized recommendations based on analysis"""
        recommendations = []
        
        # Steps recommendation
        if scores['steps'] < 70:
            priority = 'high' if scores['steps'] < 50 else 'medium'
            current_steps = latest_data.get('steps', 0)
            target_steps = self.OPTIMAL_RANGES['steps']['target']
            recommendations.append({
                'category': 'exercise',
                'priority': priority,
                'suggestion': f"Increase daily steps to {target_steps}. Currently at {current_steps} steps. Try a 30-minute walk."
            })
        elif trends.get('steps') == 'improving':
            recommendations.append({
                'category': 'exercise',
                'priority': 'low',
                'suggestion': "Great job! Your step count is improving. Keep up the momentum!"
            })
        
        # Sleep recommendation
        if scores['sleep'] < 70:
            priority = 'high' if scores['sleep'] < 50 else 'medium'
            current_sleep = latest_data.get('sleepHours', 0)
            target_sleep = self.OPTIMAL_RANGES['sleep']['target']
            recommendations.append({
                'category': 'sleep',
                'priority': priority,
                'suggestion': f"Aim for {target_sleep} hours of sleep. Currently at {current_sleep} hours. Maintain a consistent bedtime."
            })
        
        # Water recommendation
        if scores['water'] < 70:
            priority = 'high' if scores['water'] < 50 else 'medium'
            current_water = latest_data.get('waterIntake', 0)
            target_water = self.OPTIMAL_RANGES['water']['target']
            recommendations.append({
                'category': 'hydration',
                'priority': priority,
                'suggestion': f"Increase water intake to {target_water}L daily. Currently at {current_water}L. Carry a water bottle."
            })
        
        # Mood recommendation
        if scores['mood'] < 60:
            recommendations.append({
                'category': 'mental_health',
                'priority': 'high',
                'suggestion': "Consider stress-reduction activities like meditation, yoga, or talking to someone you trust."
            })
        
        # Calories recommendation (if tracking)
        calories = latest_data.get('calories', 0)
        if calories > 0 and scores['calories'] < 70:
            recommendations.append({
                'category': 'nutrition',
                'priority': 'medium',
                'suggestion': "Focus on balanced nutrition with whole foods, lean proteins, and vegetables."
            })
        
        # Sort by priority and limit to top 5
        priority_order = {'high': 0, 'medium': 1, 'low': 2}
        recommendations.sort(key=lambda x: priority_order[x['priority']])
        
        return recommendations[:5]
    
    def _generate_insights(
        self,
        health_score: float,
        scores: Dict[str, float],
        trends: Dict[str, str],
        data_points: int
    ) -> str:
        """Generate human-readable insights"""
        
        # Overall assessment
        if health_score >= 85:
            assessment = "Excellent! You're maintaining outstanding health habits."
        elif health_score >= 70:
            assessment = "Good work! You're on the right track with healthy lifestyle choices."
        elif health_score >= 55:
            assessment = "There's room for improvement. Focus on the recommendations below."
        else:
            assessment = "Your health metrics need attention. Small changes can make a big difference."
        
        # Identify strengths and weaknesses
        strengths = [k for k, v in scores.items() if v >= 80]
        weaknesses = [k for k, v in scores.items() if v < 60]
        
        strength_text = ""
        if strengths:
            strength_names = [s.replace('Hours', '').title() for s in strengths]
            strength_text = f" Your strengths: {', '.join(strength_names)}."
        
        weakness_text = ""
        if weaknesses:
            weakness_names = [w.replace('Hours', '').title() for w in weaknesses]
            weakness_text = f" Areas to improve: {', '.join(weakness_names)}."
        
        # Trend insights
        trend_text = ""
        improving = [k for k, v in trends.items() if v == 'improving']
        if improving:
            trend_text = f" Positive trends in {', '.join(improving)}!"
        
        return f"{assessment}{strength_text}{weakness_text}{trend_text}"

