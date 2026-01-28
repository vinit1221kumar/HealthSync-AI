import { useState, useMemo } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { healthAPI } from '../../services/api';

export const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const { data: stats } = useFetch(() => healthAPI.getStats(), []);

  const chartData = useMemo(() => {
    if (timeRange === '7days') {
      return [
        { day: 'Mon', calories: 2100, workouts: 1, meals: 3 },
        { day: 'Tue', calories: 2300, workouts: 0, meals: 3 },
        { day: 'Wed', calories: 2050, workouts: 1, meals: 3 },
        { day: 'Thu', calories: 2200, workouts: 1, meals: 3 },
        { day: 'Fri', calories: 2400, workouts: 2, meals: 3 },
        { day: 'Sat', calories: 1950, workouts: 1, meals: 2 },
        { day: 'Sun', calories: 2100, workouts: 0, meals: 3 },
      ];
    } else if (timeRange === '30days') {
      return [
        { day: 'Week 1', calories: 14900, workouts: 5, meals: 20 },
        { day: 'Week 2', calories: 15200, workouts: 6, meals: 21 },
        { day: 'Week 3', calories: 14600, workouts: 5, meals: 20 },
        { day: 'Week 4', calories: 15500, workouts: 7, meals: 22 },
      ];
    } else {
      return [
        { month: 'Jan', calories: 61000, workouts: 22, meals: 85 },
        { month: 'Feb', calories: 59500, workouts: 20, meals: 82 },
        { month: 'Mar', calories: 63200, workouts: 25, meals: 88 },
      ];
    }
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Analytics 📊</h1>

        {/* Time Range Selector */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-4 py-2 rounded font-semibold ${
              timeRange === '7days'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30days')}
            className={`px-4 py-2 rounded font-semibold ${
              timeRange === '30days'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('90days')}
            className={`px-4 py-2 rounded font-semibold ${
              timeRange === '90days'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            90 Days
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-600">Total Calories</p>
            <h3 className="text-3xl font-bold text-primary mt-2">
              {timeRange === '7days' ? '14,900' : timeRange === '30days' ? '60,200' : '183,700'}
            </h3>
            <p className="text-sm text-green-600 mt-2">↑ 5% from last period</p>
          </div>

          <div className="card">
            <p className="text-gray-600">Workouts</p>
            <h3 className="text-3xl font-bold text-primary mt-2">
              {timeRange === '7days' ? '4' : timeRange === '30days' ? '23' : '67'}
            </h3>
            <p className="text-sm text-green-600 mt-2">↑ 12% consistency</p>
          </div>

          <div className="card">
            <p className="text-gray-600">Meals Logged</p>
            <h3 className="text-3xl font-bold text-primary mt-2">
              {timeRange === '7days' ? '20' : timeRange === '30days' ? '85' : '255'}
            </h3>
            <p className="text-sm text-green-600 mt-2">↑ 3% tracking</p>
          </div>

          <div className="card">
            <p className="text-gray-600">Avg Rating</p>
            <h3 className="text-3xl font-bold text-primary mt-2">8.5/10</h3>
            <p className="text-sm text-green-600 mt-2">↑ Excellent</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Calorie Trends */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Calorie Trends</h2>
            <div className="h-64 flex items-end gap-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-primary rounded-t" style={{
                    height: `${(item.calories / 2500) * 100}%`,
                  }}></div>
                  <span className="text-xs mt-2 text-gray-600">
                    {item.day || item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Workout Frequency */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Workout Frequency</h2>
            <div className="h-64 flex items-end gap-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-secondary rounded-t" style={{
                    height: `${(item.workouts / 7) * 100}%`,
                  }}></div>
                  <span className="text-xs mt-2 text-gray-600">
                    {item.day || item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Macronutrients */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Avg Macros</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Protein: 85g</p>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Carbs: 220g</p>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div className="bg-green-500 h-2 rounded" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fats: 60g</p>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div className="bg-yellow-500 h-2 rounded" style={{ width: '55%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Activity Types</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Cardio</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="flex justify-between">
                <span>Strength</span>
                <span className="font-semibold">35%</span>
              </div>
              <div className="flex justify-between">
                <span>Flexibility</span>
                <span className="font-semibold">20%</span>
              </div>
            </div>
          </div>

          {/* Goals Progress */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Goals Progress</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm mb-1">Weight Loss</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded h-2">
                    <div className="bg-primary h-2 rounded" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs font-semibold">75%</span>
                </div>
              </div>
              <div>
                <p className="text-sm mb-1">Fitness</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded h-2">
                    <div className="bg-secondary h-2 rounded" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs font-semibold">60%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
