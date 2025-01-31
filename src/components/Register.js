import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';


// You can replace this with an actual logo import
const Logo = () => (
  <div className="flex items-center justify-center mb-6">
    {/* Logo */}
    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full mr-3">
      <span className="text-2xl font-bold">R</span>
    </div>
    
    {/* Company Name */}
    <h1 className="text-3xl font-bold text-gray-900">
      ROHIT
    </h1>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // Validation functions
  const validateName = (name) => {
    return name.trim() !== '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
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

    // Check password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  // Handle blur event
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prevState => ({
      ...prevState,
      [name]: true
    }));
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Medium';
    return 'Strong';
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validate all fields
    if (
      !validateName(formData.name) ||
      !validateEmail(formData.email) ||
      !validatePassword(formData.password) ||
      !validateConfirmPassword(formData.password, formData.confirmPassword)
    ) {
      setError('Please correct the errors in the form');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5000/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Success handling
      setSuccess(data.message || 'Account created successfully');
      
      // Navigate to verification page with email
      navigate('/verification-pending', { 
        state: { email: formData.email } 
      });

    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Password strength color
  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 'Weak': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-6 md:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-6 py-8 md:px-8 lg:px-10">
        {/* Logo and Company Name Section */}
        <div className="text-center">
          {/* Logo and Company Name on Same Line */}
          <Logo />
          
          {/* Subtitle */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Create Your Account
          </h2>
          
          {/* Tagline */}
          <p className="text-sm text-gray-600 mb-4">
            Join our platform and unlock new possibilities
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
              id="name"
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
              id="email"
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

          {/* Password Input */}
          <div className="relative">
            <input
              id="password"
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
              <p className="text-xs text-red-500 mt-1">
                Password must be 8+ chars with letters, numbers, special chars
              </p>
            )}
            {formData.password && (
              <p className={`text-xs mt-1 ${getPasswordStrengthColor()}`}>
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              id="confirmPassword"
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
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
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

export default Register;
