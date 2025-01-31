import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  Navigate
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRegister from './components/AdminRegister';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard'; // Assume you have this component
import Unauthorized from './components/Unauthorized'; // Optional unauthorized page
import AllUsers from './components/AllUsers';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import VerifyEmail from './components/VerifyEmail';
import VerifyLogin from './components/VerifyLogin';

// Wrapper component to handle routing based on authentication and role
const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
              <div className="text-xl">Loading users...</div>
            </div>; // Or use a Loader component
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/admin/register" 
        element={
          !isAuthenticated ? <AdminRegister /> : 
          (user?.role === 'admin' || user?.role === 'superadmin') ? 
          <Navigate to="/admin/dashboard" replace /> : 
          <Navigate to="/dashboard" replace />
        } 
      />
      <Route 
        path="/admin/login" 
        element={
          !isAuthenticated ? <AdminLogin /> : 
          (user?.role === 'admin' || user?.role === 'superadmin') ? 
          <Navigate to="/admin/dashboard" replace /> : 
          <Navigate to="/dashboard" replace />
        } 
      />

      {/* Admin Protected Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute 
            adminOnly 
            allowedRoles={['admin', 'superadmin']}
          >
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* User Protected Routes */}
      

      {/* Unauthorized Route */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Default Redirect */}
      {/* <Route 
        path="/admin" 
        element={
          <Navigate 
            to={
              !isAuthenticated ? '/admin/login' : 
              (user?.role === 'admin' || user?.role === 'superadmin') ? 
              '/admin/dashboard' : 
              '/dashboard'
            } 
            replace 
          />
        } 
      /> */}

      <Route 
        path="/admin/all-users" 
        element={
          <ProtectedRoute 
                adminOnly 
                allowedRoles={['admin', 'superadmin']}
          >
          <AllUsers />
          </ProtectedRoute>
            } 
      />
      
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="*" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-login" element={<VerifyLogin />} />
      // In your React Router setup
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
    </Routes>
  );
};

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
