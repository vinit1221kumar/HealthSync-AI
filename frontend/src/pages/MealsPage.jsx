import { useState } from 'react';
import { mealAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';

export const MealsPage = () => {
  const [filters, setFilters] = useState({
    dietType: 'all',
    calorieTarget: 2000,
  });
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealLog, setMealLog] = useState({
    foodItem: '',
    quantity: '',
    mealType: 'breakfast',
  });

  const handleLogMeal = async (e) => {
    e.preventDefault();
    try {
      await mealAPI.logMeal({
        ...mealLog,
        date: new Date(),
      });
      alert('Meal logged successfully!');
      setMealLog({ foodItem: '', quantity: '', mealType: 'breakfast' });
    } catch (err) {
      alert('Failed to log meal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Meal Planner 🍎</h1>

        {/* Meal Plans Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Meal Plans</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                id: 1,
                name: 'Vegan Power',
                type: 'Vegetarian',
                duration: '7 days',
                calories: '2,000 cal/day',
                meals: 21,
              },
              {
                id: 2,
                name: 'High Protein Muscle',
                type: 'Non-Vegetarian',
                duration: '7 days',
                calories: '2,500 cal/day',
                meals: 21,
              },
              {
                id: 3,
                name: 'Weight Loss Plan',
                type: 'Mixed',
                duration: '30 days',
                calories: '1,800 cal/day',
                meals: 90,
              },
            ].map((plan) => (
              <div key={plan.id} className="card hover:shadow-lg transition">
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-3">Type: {plan.type}</p>
                <div className="space-y-1 text-sm mb-4">
                  <p>Duration: {plan.duration}</p>
                  <p>Target: {plan.calories}</p>
                  <p>Total Meals: {plan.meals}</p>
                </div>
                <button className="btn btn-primary w-full">Start Plan</button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Meal Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Log Meal Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Log Your Meal</h2>

              <form onSubmit={handleLogMeal} className="space-y-4">
                <div>
                  <label className="input-label">Meal Type</label>
                  <select
                    value={mealLog.mealType}
                    onChange={(e) =>
                      setMealLog({ ...mealLog, mealType: e.target.value })
                    }
                    className="input"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Food Item</label>
                  <input
                    type="text"
                    value={mealLog.foodItem}
                    onChange={(e) =>
                      setMealLog({ ...mealLog, foodItem: e.target.value })
                    }
                    className="input"
                    placeholder="e.g., Grilled Chicken Breast"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Quantity (grams)</label>
                  <input
                    type="number"
                    value={mealLog.quantity}
                    onChange={(e) =>
                      setMealLog({ ...mealLog, quantity: e.target.value })
                    }
                    className="input"
                    placeholder="200"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Log Meal
                </button>
              </form>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Today's Summary</h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Calories</span>
                  <span>1,620 / 2,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '81%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-gray-600">Protein</p>
                  <p className="font-bold text-lg">65g</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-gray-600">Carbs</p>
                  <p className="font-bold text-lg">180g</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded">
                  <p className="text-gray-600">Fats</p>
                  <p className="font-bold text-lg">45g</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-gray-600">Fiber</p>
                  <p className="font-bold text-lg">25g</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="text-sm font-semibold">Remaining: 380 cal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
