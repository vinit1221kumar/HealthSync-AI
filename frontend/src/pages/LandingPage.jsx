import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-white">
        <div className="text-6xl mb-6">🏥</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          HealthSync AI
        </h1>
        <p className="text-xl md:text-2xl mb-12 opacity-90">
          Your AI-Powered Personal Fitness & Nutrition Companion
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="btn btn-primary btn-lg inline-block"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="btn btn-primary btn-lg inline-block"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="btn btn-outline btn-lg inline-block text-white border-white hover:bg-white hover:text-primary"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-2xl font-bold mb-3">100+ Workouts</h3>
              <p className="text-gray-600">
                Access personalized workout plans tailored to your goals and fitness level
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-2xl font-bold mb-3">Pose Detection</h3>
              <p className="text-gray-600">
                Real-time form analysis using AI to ensure perfect exercise technique
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">🍎</div>
              <h3 className="text-2xl font-bold mb-3">50+ Meal Plans</h3>
              <p className="text-gray-600">
                AI-generated meal plans with complete nutritional tracking
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Analytics</h3>
              <p className="text-gray-600">
                7/30/90-day trends with 100+ data points for comprehensive insights
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-3">ML Calorie Tracking</h3>
              <p className="text-gray-600">
                85%+ accurate AI-powered calorie prediction from food photos
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Smart Recommendations</h3>
              <p className="text-gray-600">
                Personalized suggestions based on your activity and health data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-lg">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-lg">Workout Plans</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-lg">Meal Plans</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <p className="text-lg">Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey with AI-powered fitness and nutrition tracking today
          </p>

          {!isAuthenticated && (
            <Link
              to="/signup"
              className="btn btn-primary btn-lg inline-block"
            >
              Start Free Trial
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 HealthSync AI. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Powered by AI • Data-Driven Fitness • Personalized Health
          </p>
        </div>
      </footer>
    </div>
  );
};
