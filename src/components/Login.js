import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import EditUserModal from './EditUserModal';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePassword = (password) => {
    return password.trim().length >= 6;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ 
      ...prevState, 
      [name]: value 
    }));

    // Mark field as touched
    setTouched(prevState => ({
      ...prevState,
      [name]: true
    }));

    // Reset error
    setError('');
  };

  // Handle blur event
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prevState => ({
      ...prevState,
      [name]: true
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const token = localStorage.getItem('token');
  
  if(token){
    setTimeout(() => {
      navigate('/dashboard');
    }, 10);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });

    // Validate all fields
    if (
      !validateEmail(formData.email) ||
      !validatePassword(formData.password)
    ) {
      setError('Please correct the errors in the form');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          rememberMe: rememberMe
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in local storage or context
      // localStorage.setItem('token', data.token);

      // Navigate to verification pending page
      navigate('/verification-pending');
      toast.success('Login Email Verification is sent to you Email Id !!');

    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Social login handler
  const handleSocialLogin = async (provider) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${provider}`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${provider} login failed`);
      }

      localStorage.setItem('token', data.token);
      navigate('/dashboard');

    } catch (err) {
      setError(err.message || `An error occurred during ${provider} login`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
            Sign in to your account
          </h2>
  
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-3 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </div>
          )}
  
          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm 
                    ${touched.email && !validateEmail(formData.email) 
                      ? 'border-red-300 text-red-900 focus:border-red-500' 
                      : 'border-gray-300'}`}
                />
                {touched.email && !validateEmail(formData.email) && (
                  <p className="mt-1 text-xs text-red-500">Please enter a valid email address</p>
                )}
              </div>
            </div>
  
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm 
                    ${touched.password && !validatePassword(formData.password) 
                      ? 'border-red-300 text-red-900 focus:border-red-500' 
                      : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && !validatePassword(formData.password) && (
                <p className="mt-1 text-xs text-red-500">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
  
            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="remember-me" 
                  className="ml-2 block text-xs sm:text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
  
              <div className="text-xs sm:text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
  
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-bold text-white transition duration-300 ease-in-out transform hover:scale-105 ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
  
          {/* Register Link */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Social Login Divider */}
          <div className="mt-4 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3">
              {/* Google Login Button */}
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full inline-flex items-center justify-center py-2 px-2 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-300 ease-in-out"
              >
                <FcGoogle className="mr-1 sm:mr-2 text-base sm:text-xl" />
                <span className="hidden sm:inline">Continue with Google</span>
                <span className="sm:hidden">Google</span>
              </button>

              {/* GitHub Login Button */}
              <button
                onClick={() => handleSocialLogin('github')}
                className="w-full inline-flex items-center justify-center py-2 px-2 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-gray-900 text-white text-xs sm:text-sm font-medium hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                <FaGithub className="mr-1 sm:mr-2 text-base sm:text-xl" />
                <span className="hidden sm:inline">Continue with GitHub</span>
                <span className="sm:hidden">GitHub</span>
              </button>
            </div>

            {/* Error message for social login */}
            {error && (
              <div className="mt-4 text-center text-red-500 text-xs sm:text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
