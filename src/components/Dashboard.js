import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch user profile
        const response = await axios.get('https://new-auth-with-admin.vercel.app/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setProfile(response.data.user);
          setLoading(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Overview */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Profile Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-6 w-6 mr-3 text-blue-600" />
                <span className="font-medium">{profile.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 mr-3 text-blue-600" />
                <span>{profile.email}</span>
              </div>
              {profile.mobileNumber && (
                <div className="flex items-center">
                  <Phone className="h-6 w-6 mr-3 text-blue-600" />
                  <span>{profile.mobileNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Account Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="h-6 w-6 mr-3 text-green-600" />
                <span className="font-medium">Role: {profile.role}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-green-600" />
                <span>Joined: {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                {profile.isVerified ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 mr-3 text-green-600" />
                    <span className="text-green-600">Account Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 mr-3 text-red-600" />
                    <span className="text-red-600">Account Not Verified</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {profile.bio && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bio</h2>
            <p className="text-gray-600">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
