import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-dark text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl">🏥</div>
            <span className="text-xl font-bold">HealthSync AI</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/workouts" className="hover:text-primary">
                  Workouts
                </Link>
                <Link to="/meals" className="hover:text-primary">
                  Meals
                </Link>
                <Link to="/pose-detection" className="hover:text-primary">
                  Pose
                </Link>
                <Link to="/profile" className="hover:text-primary">
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">{user?.name}</span>
                <button
                  onClick={logout}
                  className="btn btn-primary btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
