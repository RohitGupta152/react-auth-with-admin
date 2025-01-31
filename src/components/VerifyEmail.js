import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage('Verification token is missing');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/auth/verify/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        setStatus('success');
        navigate('/login');
      } catch (error) {
        setStatus('error');
        setMessage('Invalid or expired verification token');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-blue-500 rounded-full p-4">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-bold text-gray-900">Verifying Your Email</h2>
            <p className="mt-3 text-lg text-gray-600 text-center">
              Please wait while we confirm your email address...
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-red-100 rounded-full p-4 animate-fade-in">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="mt-8 text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="mt-3 text-lg text-gray-600 text-center max-w-sm">{message}</p>
            <div className="mt-8 space-y-4 w-full max-w-xs">
              <button
                onClick={() => navigate('/register')}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
              >
                Return to Registration
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-100 rounded-full p-3">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h1>
        <div className="mt-8">
          <div className="bg-white py-10 px-6 shadow-xl rounded-lg sm:px-12 backdrop-blur-sm bg-opacity-80 border border-gray-100">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};


export default VerifyEmail;