import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/api';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    height: user?.height || '',
    weight: user?.weight || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.updateProfile(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Profile 👤</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded ${
              message.includes('success')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary btn-sm"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    disabled
                  />
                </div>

                <div>
                  <label className="input-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600">Full Name</p>
                  <p className="text-xl font-semibold">{formData.name}</p>
                </div>

                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="text-xl font-semibold">{formData.email}</p>
                </div>

                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="text-xl font-semibold">{formData.age} years</p>
                </div>

                <div>
                  <p className="text-gray-600">Gender</p>
                  <p className="text-xl font-semibold capitalize">{formData.gender}</p>
                </div>

                <div>
                  <p className="text-gray-600">Height</p>
                  <p className="text-xl font-semibold">{formData.height} cm</p>
                </div>

                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="text-xl font-semibold">{formData.weight} kg</p>
                </div>
              </div>

              {/* Calculated Stats */}
              <div className="mt-8 p-4 bg-blue-50 rounded">
                <p className="text-gray-600">BMI (Body Mass Index)</p>
                <p className="text-2xl font-bold text-primary">
                  {(formData.weight / ((formData.height / 100) ** 2)).toFixed(1)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>

          <div className="space-y-3">
            <button className="btn btn-outline w-full">
              Change Password
            </button>
            <button className="btn btn-outline w-full">
              Notification Preferences
            </button>
            <button
              onClick={logout}
              className="btn btn-danger w-full"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
