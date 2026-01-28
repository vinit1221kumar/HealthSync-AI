from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

from services.health_analyzer import HealthAnalyzer
from services.workout_recommender import WorkoutRecommender
from services.meal_recommender import MealRecommender

# Load environment variables
load_dotenv()

# Get configuration from environment
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS]
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Initialize FastAPI app
app = FastAPI(
    title="HealthSync AI Service",
    description="AI-powered health analysis and recommendation engine",
    version="1.0.0"
)

# CORS configuration - use environment-based origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ENVIRONMENT == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize health analyzer
analyzer = HealthAnalyzer()

# Initialize recommender engines
workout_recommender = WorkoutRecommender()
meal_recommender = MealRecommender()

# Request/Response models
class HealthDataEntry(BaseModel):
    date: str
    steps: int = Field(ge=0, le=100000)
    sleepHours: float = Field(ge=0, le=24)
    waterIntake: float = Field(ge=0, le=20)
    calories: int = Field(ge=0, le=10000)
    mood: str = Field(pattern="^(excellent|good|okay|bad|terrible)$")

class UserProfile(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None

class AnalysisRequest(BaseModel):
    healthData: List[HealthDataEntry]
    userProfile: UserProfile

class Recommendation(BaseModel):
    category: str
    priority: str
    suggestion: str

class AnalysisResponse(BaseModel):
    healthScore: int
    recommendations: List[Recommendation]
    insights: str

class WorkoutRecommendationRequest(BaseModel):
    userProfile: UserProfile
    goal: str = Field(default="weight_loss", pattern="^(weight_loss|muscle_gain|endurance|flexibility)$")
    count: int = Field(default=3, ge=1, le=10)

class WorkoutRecommendationResponse(BaseModel):
    goal: str
    recommendations: List[Dict]
    generated_at: str

class MealPlanRequest(BaseModel):
    userProfile: UserProfile
    diet_type: str = Field(default="non_vegetarian", pattern="^(vegetarian|non_vegetarian|high_protein)$")
    days: int = Field(default=7, ge=1, le=30)

class MealPlanResponse(BaseModel):
    meal_plan: Dict
    macros_breakdown: Dict
    generated_at: str

# Routes
@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "HealthSync AI Service",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "analyze": "/api/analyze",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_health(request: AnalysisRequest):
    """
    Analyze health data and generate personalized recommendations
    
    Args:
        request: Contains health data entries and user profile
    
    Returns:
        Health score (0-100) and personalized recommendations
    """
    try:
        if not request.healthData or len(request.healthData) == 0:
            raise HTTPException(
                status_code=400,
                detail="No health data provided for analysis"
            )
        
        # Convert Pydantic models to dictionaries
        health_data_list = [entry.model_dump() for entry in request.healthData]
        user_profile_dict = request.userProfile.model_dump()
        
        # Perform analysis
        result = analyzer.analyze(health_data_list, user_profile_dict)
        
        return AnalysisResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/workouts/recommend", response_model=WorkoutRecommendationResponse)
async def recommend_workouts(request: WorkoutRecommendationRequest):
    """
    Get personalized workout recommendations
    
    Args:
        request: User profile and fitness goal
    
    Returns:
        List of recommended workouts tailored to user
    """
    try:
        user_profile_dict = request.userProfile.model_dump()
        recommendations = workout_recommender.get_recommendations(
            user_profile_dict,
            request.goal,
            request.count
        )
        
        return WorkoutRecommendationResponse(
            goal=request.goal,
            recommendations=recommendations,
            generated_at=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workout recommendation failed: {str(e)}")

@app.post("/api/meals/plan", response_model=MealPlanResponse)
async def generate_meal_plan(request: MealPlanRequest):
    """
    Generate personalized meal plan
    
    Args:
        request: User profile and dietary preferences
    
    Returns:
        Complete meal plan with macronutrient breakdown
    """
    try:
        user_profile_dict = request.userProfile.model_dump()
        meal_plan = meal_recommender.get_meal_plan(
            user_profile_dict,
            request.diet_type,
            request.days
        )
        
        # Get sample meals for macro analysis
        diet_meals = meal_recommender.MEAL_PLANS[request.diet_type]['meals']
        macros = meal_recommender.analyze_macros(diet_meals)
        
        return MealPlanResponse(
            meal_plan=meal_plan,
            macros_breakdown=macros,
            generated_at=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Meal plan generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
