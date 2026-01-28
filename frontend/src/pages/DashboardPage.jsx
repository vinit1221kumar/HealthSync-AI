import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { healthAPI, workoutAPI, mealAPI } from '../../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    workoutsCompleted: 0,
    caloriesBurned: 0,
    mealsLogged: 0,
    streakDays: 0,
  });

  const { data: healthData, loading: healthLoading } = useFetch(
    () => healthAPI.getStats(),
    []
  );

  const { data: recentWorkouts, loading: workoutsLoading } = useFetch(
    () => workoutAPI.getHistory({ limit: 5 }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sidebar-main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="p-4">
            <h2 className="font-bold text-xl mb-6">Menu</h2>
            <nav className="space-y-2">
              <a href="/dashboard" className="block px-4 py-2 rounded bg-primary text-white">
                Dashboard
              </a>
              <a href="/workouts" className="block px-4 py-2 rounded hover:bg-gray-200">
                Workouts
              </a>
              <a href="/meals" className="block px-4 py-2 rounded hover:bg-gray-200">
                Meals
              </a>
              <a href="/pose-detection" className="block px-4 py-2 rounded hover:bg-gray-200">
                Pose Detection
              </a>
              <a href="/analytics" className="block px-4 py-2 rounded hover:bg-gray-200">
                Analytics
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="max-w-6xl mx-auto p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold">Welcome back, {user?.name}! 👋</h1>
              <p className="text-gray-600 mt-2">Here's your health overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid-responsive gap-6 mb-8">
              <div className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600">Workouts Completed</p>
                    <h3 className="text-3xl font-bold mt-2">12</h3>
                  </div>
                  <span className="text-3xl">💪</span>
                </div>
              </div>

              <div className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600">Calories Burned</p>
                    <h3 className="text-3xl font-bold mt-2">2,450</h3>
                  </div>
                  <span className="text-3xl">🔥</span>
                </div>
              </div>

              <div className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600">Meals Logged</p>
                    <h3 className="text-3xl font-bold mt-2">34</h3>
                  </div>
                  <span className="text-3xl">🍎</span>
                </div>
              </div>

              <div className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600">Current Streak</p>
                    <h3 className="text-3xl font-bold mt-2">7 days</h3>
                  </div>
                  <span className="text-3xl">🔥</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Workouts */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Recent Workouts</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Upper Body', duration: 45, cal: 320 },
                    { name: 'Running', duration: 30, cal: 450 },
                    { name: 'Yoga', duration: 60, cal: 180 },
                  ].map((workout, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-semibold">{workout.name}</p>
                        <p className="text-sm text-gray-600">{workout.duration} min</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{workout.cal} cal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition Summary */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Today's Nutrition</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Protein</span>
                      <span className="font-semibold">65g / 120g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '54%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Carbs</span>
                      <span className="font-semibold">180g / 250g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Fats</span>
                      <span className="font-semibold">45g / 80g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '56%' }}></div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm font-semibold text-blue-900">
                      Daily Target: 2,100 / 2,500 calories
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
