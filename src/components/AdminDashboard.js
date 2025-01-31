import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  LogOut, 
  BarChart2, 
  Settings, 
  Activity 
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!loading) {
        if (!isAuthenticated || !isAdmin()) {
          navigate('/admin/login');
          return;
        }

        // Fetch dashboard data if needed
        // try {
        //   // Implement dashboard data fetching
        // } catch (error) {
        //   console.error('Dashboard data fetch error:', error);
        // }
      }
    };

    checkAuthAndFetchData();
  }, [isAuthenticated, loading, isAdmin, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-2xl text-blue-600 flex items-center space-x-3">
          <span>Loading</span>
          <div className="animate-bounce">...</div>
        </div>
      </div>
    );
  }

  // Additional authentication checks
  if (!user || !isAuthenticated || !isAdmin()) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const quickActions = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Manage Users",
      description: "View and manage system users",
      onClick: () => navigate('/admin/all-users')
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Reports",
      description: "Generate and view reports",
      onClick: () => navigate('/admin/reports')
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "System Settings",
      description: "Configure system parameters",
      onClick: () => navigate('/admin/settings')
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Activity Log",
      description: "View recent system activities",
      onClick: () => navigate('/admin/activity-log')
    }
  ];

  const formatDate = (date) => {
    const d = new Date(date || Date.now());
    const day = d.getDate();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 md:p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-sm md:text-base text-blue-100 mt-2">
                  Welcome back, {user.name || user.email}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:block">Logout</span>
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Section */}
              <div className="md:col-span-1 bg-gray-50 rounded-xl p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  
                  <div className="w-full space-y-3">
                    <div className="
                      bg-gradient-to-r from-red-50 to-red-100 
                      p-3 
                      rounded-xl 
                      shadow-md 
                      border border-red-100
                      hover:shadow-lg
                      transition
                    ">
                      <p className="text-xs text-red-600">Role</p>
                      <p className="font-semibold text-red-800">{user.role}</p>
                    </div>
                    <div className="
                      bg-gradient-to-r from-red-50 to-red-100 
                      p-3 
                      rounded-xl 
                      shadow-md 
                      border border-red-100
                      hover:shadow-lg
                      transition
                    ">
                      <p className="text-xs text-red-600">Last Login</p>
                      <p className="font-semibold text-red-800">
                      {formatDate(user.lastLoginAttempt)}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick Actions */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="
                      bg-white border border-gray-200 rounded-xl p-4 
                      hover:shadow-lg hover:border-blue-300 
                      transition transform hover:-translate-y-1
                      flex flex-col items-start space-y-3
                    "
                  >
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                      {action.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-800">{action.title}</h3>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
