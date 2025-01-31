import React from 'react';
import { useAuth } from './AuthContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl mb-6">User Dashboard</h1>
        
        {user && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
