import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  adminOnly = false,
//   redirectPath = '/dashboard'
}) => {
    const { isAuthenticated, loading, user, isAdmin } = useAuth();

    // console.group('Protected Route Check');
    // console.log('Is Authenticated:', isAuthenticated);
    // console.log('Loading:', loading);
    // console.log('User:', user);
    // console.log('Is Admin:', isAdmin());
    // console.groupEnd();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children; // Directly render the children
};

export default ProtectedRoute;
