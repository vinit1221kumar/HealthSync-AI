import axios from 'axios';

// Use Vite environment variables for Vite projects
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AI_SERVICE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Health APIs
export const healthAPI = {
  createData: (data) => api.post('/health', data),
  getData: (params) => api.get('/health', { params }),
  getStats: (params) => api.get('/health/stats/summary', { params }),
  deleteData: (id) => api.delete(`/health/${id}`),
};

// Workout APIs
export const workoutAPI = {
  getPlans: (params) => api.get('/workouts/plans', { params }),
  getPlanById: (id) => api.get(`/workouts/plans/${id}`),
  startWorkout: (data) => api.post('/workouts/start', data),
  logWorkout: (data) => api.post('/workouts/log', data),
  getHistory: (params) => api.get('/workouts/history', { params }),
  getRecommendations: (data) => api.post('/workouts/recommendations', data),
  createCustom: (data) => api.post('/workouts/create', data),
};

// Meal APIs
export const mealAPI = {
  getPlans: (params) => api.get('/meals/plans', { params }),
  getPlanById: (id) => api.get(`/meals/plans/${id}`),
  suggestMeals: (data) => api.post('/meals/suggest', data),
  logMeal: (data) => api.post('/meals/log', data),
  getHistory: (params) => api.get('/meals/history', { params }),
  getNutrition: (params) => api.get('/meals/nutrition', { params }),
  createCustom: (data) => api.post('/meals/create', data),
};

// Pose APIs
export const poseAPI = {
  startSession: (data) => api.post('/pose/start-session', data),
  analyzePose: (data) => api.post('/pose/analyze', data),
  endSession: (data) => api.post('/pose/end-session', data),
  getSession: (id) => api.get(`/pose/session/${id}`),
  getExerciseFeedback: (params) => api.get('/pose/exercise-feedback', { params }),
};

// AI APIs
export const aiAPI = {
  analyze: (data) => api.post('/ai/analyze', data),
  getLatest: () => api.get('/ai/latest'),
  getReports: (params) => api.get('/ai/reports', { params }),
};

export default api;
