import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Loader2, 
  UserPlus 
} from 'lucide-react';

// Logo Component
const Logo = () => (
  <div className="flex items-center justify-center mb-6">
    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full mr-3">
      <span className="text-2xl font-bold">R</span>
    </div>
    <h1 className="text-3xl font-bold text-gray-900">ROHIT</h1>
  </div>
);

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    mobileNumber: '',
    bio: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    mobileNumber: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Validation functions
  const validateName = (name) => name.trim().length >= 2;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validatePassword = (password) => password.length >= 8;
  const validateConfirmPassword = (password, confirmPassword) => password === confirmPassword;
  const validateMobileNumber = (number) => /^[0-9]{10}$/.test(number);

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      mobileNumber: true
    });

    // Validate all fields
    if (
      !validateName(formData.name) ||
      !validateEmail(formData.email) ||
      !validatePassword(formData.password) ||
      !validateConfirmPassword(formData.password, formData.confirmPassword) ||
      !validateMobileNumber(formData.mobileNumber)
    ) {
      setError('Please correct the errors in the form');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/admin/register', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        mobileNumber: formData.mobileNumber,
        bio: formData.bio
      });

      // Navigate to login or dashboard
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-6 md:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-6 py-8 md:px-8 lg:px-10">
        {/* Logo and Company Name Section */}
        <div className="text-center">
          <Logo />
          
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Admin Registration
          </h2>
          
          <p className="text-sm text-gray-600 mb-4">
            Create an administrative account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-3 flex items-center rounded-md">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {/* Name Input */}
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                ${touched.name && !validateName(formData.name) 
                  ? 'border-red-300 text-red-900 focus:border-red-500' 
                  : 'border-gray-300'}`}
            />
            {touched.name && !validateName(formData.name) && (
              <p className="text-xs text-red-500 mt-1">Name must be at least 2 characters</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                ${touched.email && !validateEmail(formData.email) 
                  ? 'border-red-300 text-red-900 focus:border-red-500' 
                  : 'border-gray-300'}`}
            />
            {touched.email && !validateEmail(formData.email) && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid email</p>
            )}
          </div>

          {/* Mobile Number Input */}
          <div>
            <input
              name="mobileNumber"
              type="tel"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                ${touched.mobileNumber && !validateMobileNumber(formData.mobileNumber) 
                  ? 'border-red-300 text-red-900 focus:border-red-500' 
                  : 'border-gray-300'}`}
            />
            {touched.mobileNumber && !validateMobileNumber(formData.mobileNumber) && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid 10-digit mobile number</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border-gray-300"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                ${touched.password && !validatePassword(formData.password) 
                  ? 'border-red-300 text-red-900 focus:border-red-500' 
                  : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {touched.password && !validatePassword(formData.password) && (
              <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                ${touched.confirmPassword && !validateConfirmPassword(formData.password, formData.confirmPassword) 
                  ? 'border-red-300 text-red-900 focus:border-red-500' 
                  : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {touched.confirmPassword && !validateConfirmPassword(formData.password, formData.confirmPassword) && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Bio Input */}
          <div>
            <textarea
              name="bio"
              placeholder="Bio (Optional)"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border-gray-300"
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition duration-300 ease-in-out 
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              } flex items-center justify-center space-x-2`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="mr-2" />
                <span>Create Admin Account</span>
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an admin account?{' '}
              <Link 
                to="/admin/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
