import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const VerifyLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState({
    loading: true,
    success: false,
    error: null
  });

  useEffect(() => {
    const verifyLoginToken = async () => {
      try {
        // Extract token from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (!token) {
          throw new Error('No verification token found');
        }

        // Send verification request to backend
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify-login/${token}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Handle successful verification
        if (response.data.success) {
          // Store token and user info
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          setStatus({
            loading: false,
            success: true,
            error: null
          });

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        // Handle verification errors
        setStatus({
          loading: false,
          success: false,
          error: error.response?.data?.message || 'Verification failed'
        });
      }
    };

    verifyLoginToken();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl sm:px-10">
          <div className="text-center">
            {status.loading && (
              <div className="flex flex-col items-center">
                <Loader2 
                  className="h-12 w-12 text-blue-600 animate-spin mb-4" 
                />
                <p className="text-sm text-gray-600">
                  Verifying your login, please wait...
                </p>
              </div>
            )}

            {status.success && (
              <div className="flex flex-col items-center">
                <CheckCircle 
                  className="h-12 w-12 text-green-500 mb-4" 
                />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Login Verified Successfully
                </h2>
                <p className="text-sm text-gray-600">
                  Redirecting to Dashboard...
                </p>
              </div>
            )}

            {status.error && (
              <div className="flex flex-col items-center">
                <AlertCircle 
                  className="h-12 w-12 text-red-500 mb-4" 
                />
                <h2 className="text-xl font-bold text-red-800 mb-2">
                  Verification Failed
                </h2>
                <p className="text-sm text-red-600 text-center">
                  {status.error}
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyLogin;
