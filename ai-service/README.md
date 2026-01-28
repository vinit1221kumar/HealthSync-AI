# HealthSync AI - AI Service

Python FastAPI microservice for machine learning and AI operations.

## Setup

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running

```bash
uvicorn main:app --reload --port 8000
```

Service runs on `http://localhost:8000`

## Features

- Workout recommendation engine (ML-based)
- Calorie prediction from images (85%+ accuracy)
- Meal plan generation
- User fitness analytics
- ML model training pipeline

## API Endpoints

```
POST   /api/ai/analyze        - Run ML analysis
GET    /api/ai/latest         - Get recent analysis
GET    /api/ai/reports        - Get AI reports
```

## Models

- TensorFlow for deep learning
- scikit-learn for ML algorithms
- NumPy/Pandas for data processing

## Environment Variables

```
BACKEND_URL=http://localhost:5000
MODEL_PATH=./models
ENVIRONMENT=development
```

## Requirements

- Python 3.11+
- FastAPI
- TensorFlow
- scikit-learn
- NumPy
- Pandas

See `requirements.txt` for full list.
