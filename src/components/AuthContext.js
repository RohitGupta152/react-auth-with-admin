import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      // console.log('Stored Token:', token); // Debugging log

      if (token) {
        try {
          const response = await axios.get('https://new-auth-with-admin.vercel.app/api/admin/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // console.log('Profile Response:', response.data); // Debugging log
          
          if (response.data.success) {
            setIsAuthenticated(true);
            setUser(response.data.profile);
            // console.log('User set:', response.data.profile); // Debugging log
          }
        } catch (error) {
          console.error('Authentication Error:', error); // Detailed error logging
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    // console.log('Login called with:', { userData, token }); // Debugging log
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const isAdmin = () => {
    const adminRoles = ['admin', 'superadmin'];
    const isAdminRole = user && adminRoles.includes(user.role);
    // console.log('Is Admin Check:', { user, isAdminRole }); // Debugging log
    return isAdminRole;
  };

  // Login Verification method
  const verifyLogin = useCallback(async (token) => {
    try {
      const response = await fetch(`https://new-auth-with-admin.vercel.app/api/auth/verify-login/${token}`, {
        method: 'GET',
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        
        return { 
          success: true, 
          redirectUrl: '/dashboard' 
        };
      } else {
        throw new Error(data.message || 'Login verification failed');
      }
    } catch (error) {
      console.error('Login verification error:', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      logout,
      isAdmin,
      verifyLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
