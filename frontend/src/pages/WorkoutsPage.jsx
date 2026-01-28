import { useState } from 'react';
import { workoutAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';

export const WorkoutsPage = () => {
  const [filters, setFilters] = useState({
    goal: 'all',
    difficulty: 'all',
    duration: 'all',
  });
  const [activeWorkout, setActiveWorkout] = useState(null);

  const { data: workoutPlans, loading } = useFetch(
    () => workoutAPI.getPlans(filters),
    [filters]
  );

  const handleStartWorkout = async (workoutId) => {
    try {
      const response = await workoutAPI.startWorkout(workoutId);
      alert('Workout started! Begin your session.');
      // Navigate to session tracking
    } catch (err) {
      alert('Failed to start workout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Workouts 💪</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="input-label">Goal</label>
              <select
                value={filters.goal}
                onChange={(e) => setFilters({ ...filters, goal: e.target.value })}
                className="input"
              >
                <option value="all">All Goals</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>

            <div>
              <label className="input-label">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="input"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="input-label">Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                className="input"
              >
                <option value="all">All Durations</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
              </select>
            </div>

            <div>
              <label className="input-label">&nbsp;</label>
              <button className="btn btn-primary w-full">Search</button>
            </div>
          </div>
        </div>

        {/* Workout Plans Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                name: 'Full Body HIIT',
                goal: 'Weight Loss',
                difficulty: 'Intermediate',
                duration: 30,
                calories: 400,
                exercises: 8,
              },
              {
                id: 2,
                name: 'Upper Body Strength',
                goal: 'Muscle Gain',
                difficulty: 'Advanced',
                duration: 45,
                calories: 380,
                exercises: 6,
              },
              {
                id: 3,
                name: 'Core & Flexibility',
                goal: 'Flexibility',
                difficulty: 'Beginner',
                duration: 20,
                calories: 150,
                exercises: 5,
              },
              {
                id: 4,
                name: 'Running Endurance',
                goal: 'Endurance',
                difficulty: 'Intermediate',
                duration: 40,
                calories: 450,
                exercises: 1,
              },
              {
                id: 5,
                name: 'Yoga Flow',
                goal: 'Flexibility',
                difficulty: 'Beginner',
                duration: 60,
                calories: 180,
                exercises: 12,
              },
              {
                id: 6,
                name: 'Lower Body Blast',
                goal: 'Muscle Gain',
                difficulty: 'Advanced',
                duration: 50,
                calories: 420,
                exercises: 7,
              },
            ].map((workout) => (
              <div key={workout.id} className="card hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{workout.name}</h3>
                  <span className="badge badge-primary">{workout.difficulty}</span>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p>Goal: {workout.goal}</p>
                  <p>Duration: {workout.duration} min</p>
                  <p>Calories: ~{workout.calories} kcal</p>
                  <p>Exercises: {workout.exercises}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveWorkout(workout)}
                    className="btn btn-outline flex-1"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleStartWorkout(workout.id)}
                    className="btn btn-primary flex-1"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workout Detail Modal */}
      {activeWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{activeWorkout.name}</h2>
              <button
                onClick={() => setActiveWorkout(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-600">Difficulty: <span className="font-semibold">{activeWorkout.difficulty}</span></p>
              <p className="text-gray-600">Duration: <span className="font-semibold">{activeWorkout.duration} minutes</span></p>
              <p className="text-gray-600">Est. Calories: <span className="font-semibold">{activeWorkout.calories} kcal</span></p>
            </div>

            <h3 className="text-lg font-bold mb-3">Exercises</h3>
            <div className="bg-gray-50 p-4 rounded mb-6 space-y-2 max-h-60 overflow-y-auto">
              {[...Array(activeWorkout.exercises)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="font-semibold text-primary">{i + 1}.</span>
                  <span>Exercise {i + 1}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setActiveWorkout(null)}
                className="btn btn-outline flex-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleStartWorkout(activeWorkout.id);
                  setActiveWorkout(null);
                }}
                className="btn btn-primary flex-1"
              >
                Start Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
